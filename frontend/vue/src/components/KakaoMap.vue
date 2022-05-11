<template>
<div>
  <CategoryBar
    @searchCategory="searchCategory"
  />
  <v-container style="padding: 0; margin: 0;">
    <SideNav
      ref="sideNav"
      @searchLocation="searchLocation"
      @displayInfowindow="displayInfowindow"
      @closeInfowindow="closeInfowindow"
      @moveMap="moveMap"
      @markCenterLatlng="markCenterLatlng"
      @serachAddrFromCoords="serachAddrFromCoords"
      @removeMarker="removeMarker"
    />
    
    <div class="map_wrap">
      <div id="map" style="position:relative; overflow:hidden;">
        <div class="map_type_controller">
          <span id="btnRoadmap" class="selected_btn" @click="setMapType('roadmap')">지도</span>
          <span id="btnSkyview" class="btn" @click="setMapType('skyview')">스카이뷰</span>
        </div>
      </div>
      <div class="map_zoom_controller">
        <span @click="map.setLevel(map.getLevel() - 1);"><v-icon>mdi-plus</v-icon></span>  
        <span @click="map.setLevel(map.getLevel() + 1);"><v-icon>mdi-minus</v-icon></span>
      </div>
      <div :class="$vuetify.breakpoint.smAndUp ? 'map_camera_xs' : 'map_camera' ">
        <v-btn 
          fab 
          color="accent"
          :large="!$vuetify.breakpoint.xs"
        >
          <v-icon size="36">mdi-camera</v-icon>
          <div>기록하기</div>
        </v-btn>  
      </div>
    </div>
  </v-container>
  
</div>

  
  
</template>

<script>
import SideNav from './SideNav.vue'; 
import CategoryBar from './CategoryBar.vue';
import chat from '@/chat.js';
export default {
  components: {SideNav, CategoryBar},
  mixins: [chat],
  data() {
    return {
      map: null,
      marker: null,
      markers: [],
      bounds: null,
      placeObj: null,
      geocoder: null,
      infowindow: null,
      searchText: null,
      currentCenterLatlng: null,
      polygonBundle: {},
      firstSearch: true,
      searchChanged: null
    }
  },
  
  mounted() {
    if( !window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      const lib = document.createElement('script');
      script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=8f122b1b033b2188d2a62e257cd3a039';
      lib.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=8f122b1b033b2188d2a62e257cd3a039&libraries=services"
      /* global kakao */
      script.addEventListener("load", () => {
        kakao.maps.load(this.loadMap);
      });
      document.head.appendChild(script);
      document.head.appendChild(lib);
    } else {
      this.loadMap();
    }
  }, 
  
  methods: {
    
    loadMap() {
      const container = document.getElementById('map');
      const options = {
        center : new kakao.maps.LatLng(33.450701, 126.570667),
        level: 5
      }
      /*------------------------- kakao 맵 객체 초기화 -------------------------*/
      this.map = new kakao.maps.Map(container, options);
      this.infowindow = new kakao.maps.InfoWindow({zIndex:9999});
      this.marker = new kakao.maps.Marker({ 
        // 지도 중심좌표에 마커를 생성합니다 
        position: this.map.getCenter() 
      });
      //마커를 표시합니다. 
      this.marker.setMap(this.map);
      this.bounds = new kakao.maps.LatLngBounds();
      this.placeObj = new kakao.maps.services.Places();
      this.geocoder = new kakao.maps.services.Geocoder();
      /*-------------------------------------------------------------------------*/
      //마커 이벤트 등록
      kakao.maps.event.addListener(this.map, 'click', (mouseEvent) => {
        //마커 position을 출력합니다.
        let latlng = mouseEvent.latLng;
        this.marker.setPosition(latlng);
        // console.log(latlng);
        if( this.marker.fa.src !== 'http://t1.daumcdn.net/mapjsapi/images/marker.png') {
          this.marker.fa.src = 'http://t1.daumcdn.net/mapjsapi/images/marker.png';
        }

        if( this.$vuetify.breakpoint.xs && this.$refs.sideNav.showSearchResult) {
          this.$refs.sideNav.showList = false; 
        }
        this.closeInfowindow();
      });
      
    },
    
    setMapType(maptype) {
      let roadmapControl = document.getElementById('btnRoadmap');
      let skyviewControl = document.getElementById('btnSkyview'); 
      if (maptype === 'roadmap') {
        this.map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);    
        roadmapControl.className = 'selected_btn';
        skyviewControl.className = 'btn';
      } else {
        this.map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);    
        skyviewControl.className = 'selected_btn';
        roadmapControl.className = 'btn';
      }

    },

    searchLocation(text) {
      if(!this.$refs.sideNav.searchText) {
        this.$refs.sideNav.setSearchText(text);
      }
      if (this.searchText === null ) {
        // 처음 검색했을 때
        this.firstSearch = true;
      } else {
        this.firstSearch = false;
      }
      
      if(this.searchText !== text) {
        this.searchChanged = true;
        this.$store.commit('initSearchResult');
      } else {
        this.searchChanged = false;
      }
      this.searchText = text;
      this.$refs.sideNav.page = 1;
      this.removeMarker();
      this.bounds = new kakao.maps.LatLngBounds(); // 초기화
      this.placeObj.keywordSearch(text, this.placesSearchCB);
    },

    placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
          // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
          // LatLngBounds 객체에 좌표를 추가합니다
        
        if (this.$store.state.nickname && localStorage.getItem('isLogin') && this.$store.state.usingChat) {
          //로그인한 유저가 채팅을 사용하고 있으면~
          this.$store.commit('setSearchResult', data);
        }
        
        for ( let i = 0; i < data.length; i++) {
          this.displayMarker(data[i]);
          this.bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
        }
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        this.map.setBounds(this.bounds);
        this.$refs.sideNav.getListItem(data);  // sideNav에 목록 나타내기
        this.$refs.sideNav.displayPagination(pagination); // sideNav에 pagination 나타내기
        
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

        //alert('검색 결과가 존재하지 않습니다.');
        this.addressSearch(this.searchText);
        return;

      } else if (status === kakao.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

      }
    },

    addressSearch(text) {
      // 주소로 검색한 경우 
      alert('키워드 검색 결과가 없습니다. addressSearch 함수로 검색합니다.');
      // this.$refs.sideNav.removePagination();
      // 주소로 좌표를 검색합니다
      this.geocoder.addressSearch(text, (result, status) => {

        // 정상적으로 검색이 완료됐으면 
        if (status === kakao.maps.services.Status.OK) {
          let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          // 마커를 표시합니다
          this.displayMarker(result[0]);
          // 인포윈도우로 장소에 대한 설명을 표시합니다
          this.displayInfowindow(result[0].address_name);
          // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
          this.map.panTo(coords);
          this.$refs.sideNav.getGeoListItem(result[0]);
        } 
      });    
    },
    displayInfowindow(place, tempMarker, i) {
      // if you have a global variable named "open" like "open = true;"
      // or "var open = true" or something like that, 
      // then the function "open()" would not work anymore.
      
      this.infowindow.setContent(
        `
        <div class="info_title">
          ${place.place_name} 
        </div>
        <div class="info_category">
          ${place.category_name}
        </div>
        <div class="info_address">
          <div>도로명 : ${place.road_address_name}</div>
          <div>지번 : ${place.address_name}</div>
          
        </div>
        <div class="info_detail">
          <span class="info_phone">
            ${place.phone}
          </span>
          
          <span class="info_link">
            <a href="${place.place_url}" target="_blank">링크</a>
          </span>
        </div>
        `

      );
      //console.log(this.markers, i);
      this.isEmpty(i) ? this.infowindow.open(this.map, tempMarker) : this.infowindow.open(this.map, this.markers[i])
      this.setInfoStyle(place);

    },
    displayMarker(place, image) {
      let newMarker = null;
      if(!this.isEmpty(image)) {
        let imageSize = new kakao.maps.Size(24,35);
        newMarker = new kakao.maps.MarkerImage(image, imageSize); 
        this.displayCircle(place);
      }
      this.marker = new kakao.maps.Marker({
        map: this.map,
        position: new kakao.maps.LatLng(place.y, place.x),
        image: newMarker
      })
      let tempMarker = this.marker;
      this.markers.push(tempMarker);
      this.bounds.extend(new kakao.maps.LatLng(place.y, place.x));
      this.map.setBounds(this.bounds);
      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(tempMarker, 'click', () => {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        //console.log('hi', place.place_name);
        this.moveMap(place);
        if (this.isEmpty(place.place_name)) {
          this.displayInfowindow('중간지점', tempMarker);
        } else {
          this.displayInfowindow(place, tempMarker);
        }

      });
      // kakao.maps.event.addListener(tempMarker, 'mouseout', () => {
      //   this.closeInfowindow();
      // });

    },
    displayCircle(place) {
      if (!this.isEmpty(this.polygonBundle)) {
        this.polygonBundle.setMap(null);
      }
      this.polygonBundle = new kakao.maps.Circle({
        center : new kakao.maps.LatLng(place.y, place.x),  // 원의 중심좌표 입니다 
        radius: 1500, // 미터 단위의 원의 반지름입니다 
        strokeWeight: 5, // 선의 두께입니다 
        strokeColor: '#0039cb', // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'dashed', // 선의 스타일 입니다
        fillColor: '#2962ff', // 채우기 색깔입니다
        fillOpacity: 0.2  // 채우기 불투명도 입니다   
      }); 
      
      this.polygonBundle.setMap(this.map);
    },
    closeInfowindow() {
      this.infowindow.close();
    },

    removeMarker() {
      console.log(this.markers);
      for ( let i = 0; i < this.markers.length; i++ ) {
        this.markers[i].setMap(null);
      }   
      this.markers = [];
    },
    setInfoStyle(place) {
      this.$nextTick(()=> {
        let infoTitle = document.querySelectorAll('.info_title');
        let infoAddress = document.querySelectorAll('.info_address');
        let infoDetail = document.querySelectorAll('.info_detail');
        let infoPhone = document.querySelectorAll('.info_phone');
        let infoCategory = document.querySelectorAll('.info_category');
        let infoLink = document.querySelectorAll('.info_link');
        let isMyLocate = this.isEmpty(place.category_name);
        infoTitle.forEach( (e) => {
          let w = e.offsetWidth;
          let ml = w/2;
          e.parentElement.style.top = isMyLocate ? "60px" : "-10px";
          e.parentElement.style.left = isMyLocate ? "50%" : "57%";
          e.parentElement.style.marginLeft = -ml+"px";
          e.parentElement.style.width = "fit-content";
          e.parentElement.style.background = "white";
          e.parentElement.style.boxShadow = "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)";
          e.parentElement.style.padding = "0.75em";
          e.parentElement.previousSibling.style.display = "none";
          e.parentElement.parentElement.style.border = "none";
          e.parentElement.parentElement.style.background = "unset";
        });
        
        if(isMyLocate) {
          infoAddress[0].style.display = 'none';
          infoDetail[0].style.display = 'none';
          infoPhone[0].style.display = 'none';
          infoCategory[0].style.display = 'none';
          infoLink[0].style.display = 'none';
          return;
        }
        
        infoDetail.forEach((e) => {
          e.style.display = 'flex';
          e.style.fontSize = '13px';
          e.style.margin = '5px 0px';
        });
        infoPhone.forEach( (e) => {
          e.style.color = '#288756';
        });

        infoAddress.forEach((e) => {
          e.style.overflow = 'hidden';
          e.style.fontSize = '12px';
          e.style.textOverflow = 'ellipsis';
          e.style.wordWrap = 'break-word';
          e.style.maxHeight = '34px';
          e.style.display = 'block';
          e.style.margin = '5px 0px';
        });
        infoLink.forEach( (e) => {
          e.style.color = '#3d75cc';
          e.style.height = '17px';
          e.style.marginLeft = '1em';
          e.style.float = 'left';
          
        });
        infoCategory.forEach( (e) => {
          e.style.color = '#919191';
          e.style.height = '18px';
          e.style.paddingTop = '2px';
          e.style.fontSize = '12px';
          e.style.lineHeight = '16px';
        })
      })
    },
    moveMap(item) {
      console.log(item.x, item.y);
      let moveLatLon = new kakao.maps.LatLng(item.y, item.x);
      this.map.panTo(moveLatLon);
      console.log('move');
    },
    markCenterLatlng(latlng, latlngArr) {
      console.log(latlng);
      this.currentCenterLatlng = latlng;
      this.removeMarker();
      this.bounds = new kakao.maps.LatLngBounds();
      for (let value of latlngArr) {
        this.displayMarker(value);
      }
      let moveLatLon = new kakao.maps.LatLng(latlng.y, latlng.x);
      this.map.panTo(moveLatLon);
      let img = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
      this.displayMarker(latlng, img);
    },

    searchCategory(item) {
      this.removeMarker();
      this.placeObj = new kakao.maps.services.Places(this.map);
      //console.log(placeObj);
      if ( this.isEmpty(this.currentCenterLatlng) ) {
        this.searchLocation(item.label);
        return;
      }
      this.bounds = new kakao.maps.LatLngBounds();
      this.moveMap(this.currentCenterLatlng);
      let moveLatLon = new kakao.maps.LatLng(this.currentCenterLatlng.y, this.currentCenterLatlng.x);
      this.bounds.extend(moveLatLon);
      //let level = this.map.getLevel();
      this.map.setLevel(5);
      
      this.placeObj.categorySearch(item.code, this.placesSearchCB, {useMapBounds:true}); 
      this.placeObj = new kakao.maps.services.Places();
    },
    serachAddrFromCoords(coords) {
      console.log(coords);
      let currentCoords = new kakao.maps.LatLng(coords.y, coords.x);
      this.geocoder.coord2RegionCode(currentCoords.getLng(), currentCoords.getLat(), (result, status) => {
        console.log(result, status);
        if (status === kakao.maps.services.Status.OK) {
          //eslint-disable-next-line
          let detailAddr = !!(result[0].road_address) 
          ? result[0].road_address.address_name 
          : result[0].address_name; 
          //도로명 주소 : 지번 주소
          console.log(detailAddr);
          let coordsObj = {
            place_name: detailAddr,
            y: coords.y,
            x: coords.x,
            
          }
          this.removeMarker();
          this.displayMarker(coordsObj);
          this.$refs.sideNav.setSearchText(detailAddr);
          this.$refs.sideNav.pushCurrentLocate(coordsObj); 
        }
      })
    },

    returnSearchResult() {
      if(this.isEmpty(this.$refs.sideNav.pageLength)) {
        alert('지역 또는 키워드를 검색하면 투표 목록이 채워집니다. 먼저 지역 또는 키워드를 검색해주세요.');
        return;
      } 

      for ( let i = 0; i < this.$refs.sideNav.pageLength + 1; i++) {
        this.$refs.sideNav.paginationObj.gotoPage(i);
      }
      return this.$store.state.searchResult;
    }
  } 
}
</script>

<style>
.map_wrap {
  position: absolute;
  overflow:hidden;
  width:100%;
  height:100vh;
}
#map {
  width:100%;
  height:100%;
  position:relative;
  overflow:hidden;
}
.map_type_controller {
  position: absolute;
  min-width:130px;
  height:30px;
  margin:0;
  padding:10px;
  z-index:10;
  font-size:12px;
  right: 40px;
}

.map_type_controller span {
  display:block;
  width:65px;
  height:30px;
  float:left;
  text-align:center;
  line-height:30px;
  cursor:pointer;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)!important;
}
.map_type_controller .btn {
  background:#fff;
  background:linear-gradient(#fff,  #e6e6e6);
}       
.map_type_controller .btn:hover {
  background:#f5f5f5;
  background:linear-gradient(#f5f5f5,#e3e3e3);
}
.map_type_controller .btn:active {
  background:#e6e6e6;
  background:linear-gradient(#e6e6e6, #fff);
}    
.map_type_controller .selected_btn {
  color:#fff;
  background:#425470;
  background:linear-gradient(#425470, #5b6d8a);
}
.map_type_controller .selected_btn:hover {
  color:#fff;
}  
.map_zoom_controller {
  position:absolute;
  top:50px;
  right:50px;
  width:36px;
  height:80px;
  overflow:hidden;
  z-index:1;
  background-color:#f5f5f5;
  box-shadow: 0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)!important;

}
.map_zoom_controller span {
  display:flex;
  justify-content: center;
  width:36px;
  height:40px;
  cursor:pointer;
}     
.map_zoom_controller span:first-child{
  border-bottom:1px solid #bfbfbf;
}       

.info_title{
  display: block;
  font-weight: bold;
  text-align: center;
  height: 24px;
  line-height:22px;
  border-radius:4px;
  padding:0px 10px;
}

.mobile_header{
  position: absolute;
  top: 11px;
  left: calc( 50% - 80px );
  z-index: 11;
  width: 80px;
  padding: 0 10px;
}
.map_camera{
  position: absolute;
  z-index: 11;
  bottom: 70px;
  left: 50%;
  transform: translate(-50%, 0);
}

.map_camera_xs {
  position: absolute;
  z-index: 11;
  bottom: 16px;
  transform: translate(0, -100%);
  padding: 0 16px;
  bottom: calc(50% - 64px);
  left: unset !important;
  right: 0;
}
@media screen and (max-width: 600px) {
  .map_type_controller {
    top: 11vh;
    left: 2vw;
  }
  .map_zoom_controller {
    top: 12vh;
    right: 20px;
  }
}
/* 
@media screen and (max-width: 1264px) {
  .map_wrap {
    width: 100vw;
  }
 
} */
</style>