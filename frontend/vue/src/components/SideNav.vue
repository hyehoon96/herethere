<template>
  <v-card elevation="48" tile width="360px">
    <v-dialog
      max-width="500"
      v-model="displayDialog"
    > 
      <custom-dialog
        :header-title=" dialogType === 'create' ? '방 생성하기' : '방 찾기' "
        @hide="displayDialog = false;"
        @submit="dialogType === 'create' ? createRoom() : findRoom()"
        :footerSubmitTitle="dialogType === 'create' ? '생성' : '접속'"
      >
        <template v-slot:body>
          <v-row class="mt-3"  justify="center">
            <v-col cols="11" v-if="dialogType === 'find'">
              <v-text-field
                v-model="userName"
                outlined
                hide-details
                type="string"
                label="채팅방에서 사용할 이름을 입력하세요."
              />
            </v-col>

            <v-col cols="11" v-else>
              <v-text-field
                v-model="roomMax"
                outlined
                hide-details
                type="number"
                label="채팅방 인원을 입력해주세요."
              />
            </v-col>

            <v-col cols="11">
              <v-text-field
                v-model="roomNumber"
                outlined
                hide-details
                label="채팅방 비밀번호를 입력해주세요."
              />
            </v-col>
          </v-row>
          
        </template>
      </custom-dialog>
    </v-dialog> 

    <div style="position: absolute; z-index:11;" class="pa-5" v-if="$vuetify.breakpoint.mdAndDown && showSideNav === false">
      <v-toolbar dense style="flex-basis: 100%;">
        <v-btn  
          style="height: 100%;"
          elevation="0" 
          @click="showSideNav = !showSideNav"
          icon
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-toolbar-title>
          <v-text-field
            solo
            label="장소를 검색해주세요!"
            append-icon="mdi-magnify"
            light
            flat
            hide-details
            @click:append="callSearchFunc"
            @keyup.enter="callSearchFunc"
            v-model="searchText"
          >
          </v-text-field>
        </v-toolbar-title>
      </v-toolbar>

      <div v-if="searchResult.length > 0">
        <v-card
            class="mx-auto"
            max-height="250"
            flat
            tile
          >
          <!-- 검색 결과 -->
          <v-list>
            <v-list-item-group v-model="targetLocate">
              <v-list-item
                v-for="(item, i) in searchResult"
                :key="i"
                style="border-bottom: 1px solid #eaeaea;"
              >
                <v-list-item-icon>
                  <v-icon color="primary">mdi-map-marker</v-icon>
                </v-list-item-icon>
                <v-list-item-content 
                  @mouseover="moveMaptoTarget(item, i)"
                  @mouseout="closeInfowindow"
                  @click="pushInCalcBundle(item)"  
                >
                  <v-list-item-title class="font-weight-black">{{item.place_name}}</v-list-item-title>
                  <v-list-item-subtitle>
                    <div style="color: #3d75cc;">{{item.address_name}}</div>
                    <div style="color: green;" v-if="item.road_address">{{item.road_address.zone_no}}</div>
                    <div style="color: green;">{{item.phone}}</div>
                    
                  </v-list-item-subtitle>
                </v-list-item-content>
                <div style="font-size: 11px;" v-if="item.category_name">
                  {{item.category_name.split('>')[item.category_name.split('>').length-1]}}
                </div>
                
              </v-list-item>
              <div class="text-center">
                <ul id="placesList"></ul>
                <div id="pagination">
                  <!-- a tag -->
                </div>
              </div>
            </v-list-item-group>
          </v-list>
        </v-card>
      </div>
    </div>


    <v-navigation-drawer
      app
      permanent
      width="360px"
      class=""
      style="overflow-y: hidden;"
      v-if="showSideNav"
    >
      <v-card color="#258fff" dark tile>
        <div class="d-flex justify-center">
          <h1>HereThere</h1>
          <v-btn v-if="$vuetify.breakpoint.mdAndDown" icon style="left: 100px;" @click="showSideNav = !showSideNav">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </div>
        <v-row>
          <v-col cols="12" class="d-flex">
            
            <v-btn 
              icon
              background-color="#258fff"
              class="flex-grow-1 d-flex flex-column" 
              v-for="item in menuGroup" :key="item.text"
              :to="item.route"
              :rounded="false"
              tile
              min-height="40"
            >
              
              <v-icon size="20">{{item.icon}}</v-icon>
              <div class="font-weight-black" style="font-size: 13px;">{{item.text}}</div>
            </v-btn>

              
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="d-flex" cols="11">
            <v-text-field
              solo
              label="장소를 검색해주세요!"
              append-icon="mdi-magnify"
              light
              v-model="searchText"
              @click:append="callSearchFunc"
              @keyup.enter="callSearchFunc"
              hide-details
            >
            </v-text-field>

          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex mb-3" cols="12">
            <v-btn 
              icon
              background-color="#258fff"
              class="flex-grow-1 d-flex flex-column" 
              v-for="item in roomBtnGroup" :key="item.text"
              :rounded="false"
              tile
              @click="item.onClick"
              min-height="40"
            >
              
              <v-icon size="20">{{item.icon}}</v-icon>
              <div class="font-weight-black" style="font-size: 13px;">{{item.text}}</div>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-row no-gutters>
        <v-col cols="12" >
          
          <v-card
            class="mx-auto"
            max-height="250"
            flat
            tile
            
          >
            <!-- 검색 결과 -->
            <v-list v-if="searchResult">
              <v-list-item-group v-model="targetLocate">
                <v-list-item
                  v-for="(item, i) in searchResult"
                  :key="i"
                  style="border-bottom: 1px solid #eaeaea;"
                >
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-map-marker</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content 
                    @mouseover="moveMaptoTarget(item, i)"
                    @mouseout="closeInfowindow"
                    @click="pushInCalcBundle(item)"  
                  >
                    <v-list-item-title class="font-weight-black">{{item.place_name}}</v-list-item-title>
                    <v-list-item-subtitle>
                      <div style="color: #3d75cc;">{{item.address_name}}</div>
                      <div style="color: green;" v-if="item.road_address">{{item.road_address.zone_no}}</div>
                      <div style="color: green;">{{item.phone}}</div>
                      
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <div style="font-size: 11px;" v-if="item.category_name">
                    {{item.category_name.split('>')[item.category_name.split('>').length-1]}}
                  </div>
                  
                </v-list-item>
                <div class="text-center">
                  <ul id="placesList"></ul>
                  <div id="pagination">
                    <!-- a tag -->
                  </div>
                </div>
              </v-list-item-group>
            </v-list>
            <div class="text-start" v-if="isEmpty(searchResult)"> 
              1. 주소를 입력하세요. <br>
              2. 주소 목록을 클릭해주세요. <br>
              3. 하단의 "어디서 만날까요?" 버튼을 눌러주세요. <br>
              4. 화면 우측 하단의 카테고리를 설정해주세요.
            </div>
          </v-card>
          <v-divider class="my-3"></v-divider> 
        </v-col>
        
      </v-row>
      
      <v-row>
        <v-col cols="12" class="my-5 ">
          <v-card 
            style="max-height: 25vh; overflow-y: scroll;"
            :elevation="latlngBundle.length > 0 ? 4 : 0"  
          >
            <transition-group name="list" tag="p" style="padding: 0; margin: 0;">
              <v-list-item
                v-for="(item, i) in latlngBundle"
                :key="item.place_name"
                style="border-bottom: 1px solid #eaeaea;"
              >
                <v-list-item-icon @click="latlngBundle.splice(i,1)">
                  <v-icon color="accent">mdi-minus</v-icon>
                </v-list-item-icon>
                <v-list-item-content @mouseover="moveMaptoTarget(item, i)" @mouseout="closeInfowindow">
                  <v-list-item-title class="font-weight-black">{{item.place_name}}</v-list-item-title>
                </v-list-item-content>
                <!-- <v-list-item-icon @click="linkToKakaMap(item.id)">
                  <v-btn tile depressed> 
                    <v-icon color="primary">mdi-navigation-variant-outline</v-icon>
                    <div>길찾기</div>
                  </v-btn>
                </v-list-item-icon> -->
              </v-list-item>
            </transition-group>
          </v-card>
        </v-col>
      </v-row>

      <div>
        <v-btn fixed bottom block color="primary" style="bottom: 0;" @click="getCenterLatlng">어디서 만날까요?</v-btn>
      </div>
      
      
    </v-navigation-drawer>
  </v-card>
</template>

<script>
//https://stackoverflow.com/questions/46966689/how-can-i-call-method-from-data-on-vue-js
export default {
  data() {
    var self = this;
    return {
      displayDialog: false,
      showSideNav: true,
      userName: null,
      roomNumber: null,
      roomMax: 4,
      dialogType: null,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 6 || 'Max 20 characters',
      },
      menuGroup: [
        { text:'로그인', icon: 'mdi-login', route: 'login' },
        { text:'정보', icon: 'mdi-information-outline', route: 'info' },
        { text:'기록', icon: 'mdi-history', route: 'history' },
        { text:'설정', icon: 'mdi-cog', route: 'setting' },
      ],
      roomBtnGroup: [
        { text: '내 위치', 
          icon: 'mdi-crosshairs-gps', 
          onClick: function() {
            self.getCurrentLocate();
          }},
        { text: '방 생성', 
          icon: 'mdi-folder-plus',
          onClick: () => {
            self.displayDialog = true;
            self.dialogType = 'create';
          }},
        { text: '방 찾기', 
          icon: 'mdi-folder-search-outline',
          onClick: () => {
            self.displayDialog = true;
            self.dialogType = 'find'
        }},
          

      ],
      searchText: null,
      targetLocate: null,
      targetRadio: [],
      searchResult: [],
      paginationObj : {},
      currentPage: 1,
      latlngBundle: [],
      debounce1: null,
      debounce2: null,
    }
  },
  
  mounted() {
    this.showSideNav = this.$vuetify.breakpoint.lgAndUp;
  },
  
  methods: {
    test() {
      alert('hi');
    },
    getCurrentLocate() {
      if('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position);
          this.$emit('serachAddrFromCoords', {y: position.coords.latitude, x: position.coords.longitude});
        },
        error => alert(error, '에러가 발생하였습니다.'),
        {enableHighAccuracy: true});
      } else {
        alert('지원하지 않는 브라우저입니다.');
      }
    },
    getListItem(item) {
      this.searchResult = item;
    },
    getGeoListItem(item) {
      let temp = {
        place_name : item.address_name,
        address_name: item.address.address_name,
        road_address : item.road_address,
        category_name : '지역',
        x: item.x,
        y: item.y
      }
      this.searchResult = [];
      this.searchResult[0] = temp;
    },

    callSearchFunc() {
      console.log(this.searchText);
      if (this.isEmpty(this.searchText)) {
        alert('키워드를 입력해주세요!');
        return false;
      }
      this.$emit('searchLocation', this.searchText);
    },
    
    displayPagination(pagination) {
      this.paginationObj = pagination;
      let paginationEl = document.getElementById('pagination');
      let fragment = document.createDocumentFragment();

      // 기존에 추가된 페이지번호를 삭제합니다
      this.removePagination();
      for (let i=1; i<=pagination.last; i++) {
        let el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;
        
        if (i===pagination.current) {
          el.className = 'on';
        } else {
          el.onclick = ((i) => {
            return () => {
              this.$emit('removeMarker');
              pagination.gotoPage(i);
            }
          })(i);
        }

        fragment.appendChild(el);
      }
        paginationEl.appendChild(fragment);
      },
    removePagination() {
      let paginationEl = document.getElementById('pagination');
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild);
      }

    },
    closeInfowindow() {
      clearTimeout(this.debounce2);
      this.debounce2 = setTimeout(() => {
        this.$emit('closeInfowindow');  
      }, 300) ;
      
    },
    pushInCalcBundle(item) {
      const isNew = (element) =>  element.address_name !== item.address_name;
      if(this.latlngBundle.every(isNew)) {
        this.latlngBundle.push(item);
      }
      this.$emit('displayMarker', item);
    },

    moveMaptoTarget(item, i) {
      clearTimeout(this.debounce1);
      this.debounce1 = setTimeout(() => {
        this.$emit('moveMap', item);
        this.$emit('displayInfowindow', item.place_name, null, i)
      }, 300);
      
    },
    getCenterLatlng() {
      if ( this.latlngBundle.length < 2) {
        alert('장소를 최소 두 곳 입력해주세요!');
        return;
      }
      console.log(this.latlngBundle);
      let latlngArr = [];
      this.latlngBundle.forEach( (element) => {
        let temp = {
          x: element.x,
          y: element.y
        };
        latlngArr.push(temp);
      })
      console.log(latlngArr);
      let xSort = latlngArr.sort(function(a, b) {
        return a.x - b.x;
      })
      let ySort= latlngArr.sort(function(a, b) {
        return a.y - b.y;
      })
      let xLargest = Number(xSort[xSort.length - 1].x);  
      let xSmallest = Number(xSort[0].x);
      let yLargest = Number(ySort[ySort.length - 1].y);
      let ySmallest = Number(ySort[0].y);
      
      let centerOfSquare = {
        x: (xSmallest + ((xLargest - xSmallest) / 2)).toFixed(6),
        y: (ySmallest + ((yLargest - ySmallest) /2)).toFixed(6)
      }
      
      this.$emit('markCenterLatlng', centerOfSquare, this.latlngBundle);
    },
    setSearchText(text) {
      this.searchText = text;
    },
    async createRoom() {
      let room = await this.$axiosAPI('/api/room/' + this.roomNumber ,'get');
      console.log(room);
      if (!room.empty) {
        alert('다른 비밀번호를 사용해주세요.');
      } else {
        console.log('createRoom');
        await this.$axiosAPI('/api/room/', 'post', {owner: 'user0418', password: this.roomNumber, max: this.roomMax});
        this.$router.push({ name: 'ChatRoom', params: {roomNumber: btoa(this.roomNumber), roomMax: this.roomMax, role: 'owner'} });
        this.displayDialog = false;
      }
    },

    async findRoom() {
      let room = await this.$axiosAPI('/api/room/' + this.roomNumber ,'get');
      if(!room.empty) {
        if(room.max === room.currentClient) {
          alert('채팅방 인원이 초과하였습니다.');
          return;
        }
        this.$router.push({ name: 'ChatRoom', params: {roomNumber: btoa(this.roomNumber), roomMax: room.max, user: this.userName, role: 'guest'} });
        this.displayDialog = false;
      } else {
        alert('채팅방을 찾을 수 없습니다.');
      }
    }
  }
}
</script>

<style scoped>
nav {
  box-shadow: 0px 0px 2px 2px rgba(0,0,0,0.35);
}
::v-deep .v-navigation-drawer__content {
 overflow: hidden
}

.v-item-group {
  max-height: 35vh;
  overflow-y: scroll;
}
#pagination {
  margin:10px auto !important;
  text-align: center !important;
}
#pagination >>> a {
  display:inline-block !important;
  margin-right:10px !important;
}
#pagination >>> .on {
  font-weight: bold !important; 
  cursor: default !important;
  color:#777 !important;
}
a {
  text-decoration: none !important;
  color:#000 !important;
}
.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}

</style>