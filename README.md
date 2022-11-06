# Herethere


모임 장소를 찾는 것이 번거로워 **중간 지점을 찾기 위해 만든 Toy project**
<br>
2022-03 ~ 2022-06


## 스택

<div> 
  <img src="https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white">
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
  <img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
  <img src="https://img.shields.io/badge/pwa-78a22e?style=for-the-badge&logo=pwa&logoColor=white">
  <br>
  <img src="https://img.shields.io/badge/kakaomap-FFCA28?style=for-the-badge&logo=kakao&logoColor=white">
  <img src="https://img.shields.io/badge/amazonaws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white">
  <br>
  <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/redis-003545?style=for-the-badge&logo=redis&logoColor=white">
  

</div>



## 1. 기능 소개

###   검색 및 약속 장소 찾기

#####                - 지역, 키워드를 검색하고, 클릭해주세요. <br>
#####                - "어디서 만날까요?" 버튼을 눌러주세요. <br>
#####                - 카테고리를 설정해주세요.
---

### 채팅 및 위치 공유, 장소 투표

#####                - 채팅 버튼을 눌러 채팅방을 확인하세요.
#####                - 채팅방을 새로 생성하거나 기존 채팅방에 접속할 수 있습니다.
#####                - 내 위치를 공유하거나, 친구의 위치를 공유받을 수 있습니다.
#####                - 약속 장소를 투표로 결정해보세요.
---

### 북마크 및 핫플레이스


#####                - 마음에 드는 장소를 북마크에 추가하세요.
#####                - 북마크 버튼을 눌러 북마크를 조회하고, 지도에 나타낼 수 있습니다.
#####                - 핫플레이스 버튼을 눌러 최근 인기가 많은 지역 (핫플레이스)을 조회해보세요.
  


## 2. 구현 방법

### 중간 지점 찾기
- 상, 하, 좌, 우 4방향 좌표를 잡아 x축 y축 중간점을 계산

```javascript
// 목록의 x축 좌표, y축 좌표 정렬
let xSort = latlngArr.sort(function(a, b) {
  return a.x - b.x;
})
let ySort= latlngArr.sort(function(a, b) {
  return a.y - b.y;
})

let xLargest = xSort[xSort.length - 1].x;  
let xSmallest = xSort[0].x;
let yLargest = ySort[ySort.length - 1].y;
let ySmallest = ySort[0].y;


```


### 채팅 및 투표
- socket.io 라이브러리를 활용하여, 이벤트 기반의 실시간 통신
- 투표 시 투표 항목 데이터를 객체 property로 담아 http 요청
- 서버에서 투표 데이터를 broadcasting

```javascript
// 채팅방 접속 및 chat 이벤트
room.on('connection', (socket)=> {
  socket.on('chat', (data) => {
    socket.to(roomId).broadcast.emit(data);
  });
}
```

```javascript
// 채팅방 내에 인원이 0명일 경우 방 삭제
if (userCount <= 0) { 
  axios.delete(process.env.URL, {data: {password: roomId} })
    .then(() => {
      console.log('room deleted');
    })
    .catch((error) => {
      logger.error(error);
    })
} else {
  let systemMsg = {
    user: '',
    chat: '',
    isMine: false,
    systemMsg: `${user}님이 퇴장했습니다.`
  }
  socket.broadcast.to(roomId).emit('exit', systemMsg);
}

```


### 핫플레이스
- 사용자가 장소를 검색할 때마다 해당 장소의 views 데이터를 증가시키고 DB에 저장 
- views가 높은 장소는 사용자의 관심도가 높은 장소로 판단

```javascript
// 1. fetch place
req.conn.query(selectPlaceStmt, placeId, (err, row) => {
    if (err) { logger.error(err) }
    if (!row[0]) {
        // 1-1. 없으면 insert place
        const params = [
            req.body.id,
            req.body.place_name,
            req.body.category_name,
            req.body.category_group_code,
            req.body.category_group_name,
            req.body.phone,
            req.body.address_name,
            req.body.road_address_name,
            req.body.x,
            req.body.y,
            req.body.place_url
        ]

        req.conn.query(insertPlaceStmt, params, (err, row) => {
            if (err) { logger.error(err) }
        });
    } else {
        // 1-2. 있으면 views 증가
        req.conn.query(updatePlaceViewsStmt, placeId, (err, row) => {
            if (err) { logger.error(err) }
        });
    }

    // 2. insert history
    req.conn.query(insertHistoryStmt, [userId, placeId], (err, row) => {
        return res.status(201).json({
            userId: userId,
            placeId: placeId
        });
    });


```





## 3. 주안점

### 프로젝트 관리
- slack을 통한 이슈 관리 및 협업
- winston 라이브러리를 통한 로그 관리
- pm2 라이브러리를 통한 배포 운영


### 카카오맵
- 맵 관련 오픈 API 중 커뮤니티가 활발하고 접근성이 좋음 
- 기능 구현에 필요한 마킹 및 검색 API가 충분하고 가이드가 충실함
- 영리 목적의 프로젝트가 아니므로 요금, 속도는 후순위로 고려하여 선정

### Redis
- pm2를 통한 멀티 프로세싱으로 서버 부하 관리
- 그러나 멀티 프로세싱이므로 서버 메모리 자원 공유가 불가능함
- 따라서 로그인 Session 공유를 위해 Redis 데이터베이스 활용
- 세션을 캐시 형태로 Redis 데이터베이스에 저장하고 이를 통해 서버가 세션을 공유


### 프론트엔드 최적화
- gzip 압축 적용
- 일부 페이지 lazy load 적용


### PWA
- 모바일 어플리케이션 설치를 위한 PWA 적용
- 순수 자바스크립트로 작성하여 개발 효율을 높임
- 반응형 웹 적용하여 웹 및 앱 ui 대응


### AWS
- EC2, S3를 통한 프론트엔드, 백엔드 관리
- 프론트엔드 및 백엔드 프로젝트 관리가 용이하도록 분담하고, AWS 서비스를 학습
- ACM을 통한 https 인증서 발급 및 통합 관리
- 각 서비스에 대한 주 1-2회 스터디 진행하여 프로젝트 운영 및 배포

