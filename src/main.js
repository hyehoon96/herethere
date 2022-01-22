/*global kakao*/
var searchBtn = document.querySelectorAll('.btn-search');
var address = null;
searchBtn[0].addEventListener('click', function() {
  address = document.querySelector(".area1").value;
  searchAddress(address, '1');
})
searchBtn[1].addEventListener('click', function() {
  address = document.querySelector(".area2").value;
  searchAddress(address, '2');
})
//테스트 함수, 수정 예정

var plusBtn = document.querySelector('.btn-plus');
var minusBtn = document.querySelector('.btn-minus');
var searchRow = document.querySelector('.row-search');
plusBtn.addEventListener('click', function() {
  document.querySelector('.counter').valueAsNumber += 1;
  
});
minusBtn.addEventListener('click', function() {
  document.querySelector('.counter').valueAsNumber -= 1;
});


var cardBody = document.querySelector('.card-body');
var createBtn = document.querySelector('.btn-creater');
var newSearchRow = searchRow.cloneNode(true);

createBtn.addEventListener('click', function() {
  console.log(document.querySelector('.counter').valueAsNumber);
  for ( var i = 0; i < document.querySelector('.counter').valueAsNumber; i++) {
    
    var clone = newSearchRow.cloneNode(true)
    clone.getElementsByTagName('p')[0].id = 'clickLatlng' + (i+3);
    clone.getElementsByTagName('input')[0].classList.remove('area1');
    clone.getElementsByTagName('input')[0].classList.add('area'+(i+3));
    
    cardBody.appendChild(clone);
    clone.getElementsByTagName('button')[0].addEventListener('click', makeFunc.bind(this, i+3), false);    
  }
})
//https://stackoverflow.com/questions/19586137/addeventlistener-using-for-loop-and-passing-values
function makeFunc(index) {
  console.log(index);
  console.log(document.querySelector('.area'+(index)));
  var address = document.querySelector('.area'+(index)).value;
  searchAddress(address, index);
}

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
  
  var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
  message += '경도는 ' + latlng.getLng() + ' 입니다';
  
  var resultDiv = document.getElementById('clickLatlng'); 
  resultDiv.innerHTML = message;
  
});

var geocoder = new kakao.maps.services.Geocoder();

// 주소로 좌표를 검색합니다





