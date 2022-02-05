/*global kakao*/
//https://stackoverflow.com/questions/19586137/addeventlistener-using-for-loop-and-passing-values

if (window.location.pathname === '/search') {
  var searchBtn = document.querySelectorAll('.search__btn');
  console.log(document.querySelector(`.area${0}`));
  for ( var i = 0; i < searchBtn.length; i++ ) {
    searchBtn[i].addEventListener('click', addSearchFunc.bind( null , i));
  }
}
function addSearchFunc(i) {
  var address = document.querySelector(`.area${i}`).value;
  searchAddress(address, i);  
}
//버튼에 검색기능 붙이기

function searchAddress(address, index) {
  geocoder.addressSearch(address, function(result, status) {
    alert(address);
    // 정상적으로 검색이 완료됐으면 
     if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: `<div style="width:150px;text-align:center;padding:6px 0;">${address}</div>`
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
        var latlng = map.getCenter(); 
        
        var message = '<p>중심 좌표는 위도 ' + latlng.getLat() + ', 경도 ' + latlng.getLng() + '입니다</p>';
        console.log(index);
        var resultDiv = document.getElementById('clickLatlng'+index); 
        
        resultDiv.innerHTML = message;
    } else {
      searchPlaces(address, index);  
    }
  });    
}

var num = 3;
var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

var map = new kakao.maps.Map(mapContainer, mapOption);
//지도 생성

// 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
var mapTypeControl = new kakao.maps.MapTypeControl();
// 지도 타입 컨트롤을 지도에 표시합니다
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

/* 확대 축소하기 */
function setMapType(maptype) { 
  var roadmapControl = document.getElementById('btnRoadmap');
  var skyviewControl = document.getElementById('btnSkyview'); 
  if (maptype === 'roadmap') {
      map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);    
      roadmapControl.className = 'selected_btn';
      skyviewControl.className = 'btn';
  } else {
      map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);    
      skyviewControl.className = 'selected_btn';
      roadmapControl.className = 'btn';
  }
}

function zoomIn() {
  map.setLevel(map.getLevel() - 1);
}

function zoomOut() {
  map.setLevel(map.getLevel() + 1);
}


/* 마커 생성하기 */

var marker = new kakao.maps.Marker({ 
  // 지도 중심좌표에 마커를 생성합니다 
  position: map.getCenter() 
}); 
// 지도에 마커를 표시합니다
marker.setMap(map);

// 지도에 클릭 이벤트를 등록합니다
// 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
  
  // 클릭한 위도, 경도 정보를 가져옵니다 
  var latlng = mouseEvent.latLng; 
  
  // 마커 위치를 클릭한 위치로 옮깁니다
  marker.setPosition(latlng);
  
  // var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
  // message += '경도는 ' + latlng.getLng() + ' 입니다';
  
  // var resultDiv = document.getElementById('clickLatlng'); 
  // resultDiv.innerHTML = message;
  
});

var geocoder = new kakao.maps.services.Geocoder();


/*----------------키워드로 주소검색하기 --------------*/
var markers = [];
var ps = new kakao.maps.services.Places();
var infowindow = new kakao.maps.InfoWindow({zIndex:1});

function searchPlaces(address, i) {
  if (!address.replace(/^\s+|\s+$/g, '')) {
      alert('키워드를 입력해주세요!');
      return false;
  }

  // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
  ps.keywordSearch( address, placesSearchCB); 
}
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {

      // 정상적으로 검색이 완료됐으면
      // 검색 목록과 마커를 표출합니다
      displayPlaces(data);

      // 페이지 번호를 표출합니다
      displayPagination(pagination);

  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.');
      return;

  } else if (status === kakao.maps.services.Status.ERROR) {

      alert('검색 결과 중 오류가 발생했습니다.');
      return;

  }
}
function displayPlaces(places) {

    var listEl = document.getElementById('placesList'), 
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new kakao.maps.LatLngBounds(), 
    listStr = '';
    
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();
    
    for ( var i=0; i<places.length; i++ ) {

        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i), 
            itemEl = getListItem(i, places[i], placePosition); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function(marker, title) {
            kakao.maps.event.addListener(marker, 'mouseover', function() {
                displayInfowindow(marker, title);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });

            itemEl.onmouseover =  function () {
                displayInfowindow(marker, title);
            };

            itemEl.onmouseout =  function () {
                infowindow.close();
            };
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}
function getListItem(index, places, placePosition) {

  var el = document.createElement('li'),
  itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
              '<div class="info">' +
              '   <h5>' + places.place_name + '</h5>';

  if (places.road_address_name) {
      itemStr += '    <span>' + places.road_address_name + '</span>' +
                  '   <span class="jibun gray">' +  places.address_name  + '</span>';
  } else {
      itemStr += '    <span>' +  places.address_name  + '</span>'; 
  }
               
    itemStr += '  <span class="tel">' + places.phone  + '</span>' +
              '</div>';           

  el.innerHTML = itemStr;
  el.className = 'item';
  el.addEventListener('click', showLocation.bind( null, places.address_name, placePosition))
  return el;
}
var addressArr = [];

function showLocation(address_name, placePosition) {
  map.setCenter(placePosition);
  addressArr.push({
    address: address_name,
    location: placePosition
  });
  
}
function addMarker(position, idx, title) {
  var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
      imgOptions =  {
          spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
          marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage 
      });

  marker.setMap(map); // 지도 위에 마커를 표출합니다
  markers.push(marker);  // 배열에 생성된 마커를 추가합니다

  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
  for ( var i = 0; i < markers.length; i++ ) {
      markers[i].setMap(null);
  }   
  markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시하는 함수입니다
function displayPagination(pagination) {
  var paginationEl = document.getElementById('pagination'),
      fragment = document.createDocumentFragment(),
      i; 

  // 기존에 추가된 페이지번호를 삭제합니다
  while (paginationEl.hasChildNodes()) {
      paginationEl.removeChild (paginationEl.lastChild);
  }

  for (i=1; i<=pagination.last; i++) {
      var el = document.createElement('a');
      el.href = "#";
      el.innerHTML = i;

      if (i===pagination.current) {
          el.className = 'on';
      } else {
          el.onclick = (function(i) {
              return function() {
                  pagination.gotoPage(i);
              }
          })(i);
      }

      fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
  var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
  infowindow.setContent(content);
  infowindow.open(map, marker);

}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {   
  while (el.hasChildNodes()) {
      el.removeChild (el.lastChild);
  }
}

