const SocketIO = require('socket.io'); // 라이브러리를 불러옴
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { //서버와 연결
    path: '/socket.io', //클라이언트가 접속할 경로
    cors: {origin: '*'} // 기타 옵션 설정 가능
  });
  app.set('io', io); // app 객체에서 연결 객체를 'io'로 설정 (다른 파일에서 app.get('io')로 호출)
  const room = io.of('/room'); // room이라는 네임스페이스를 설정함
  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  })

  room.on('connection', (socket)=> {
    console.log('room 네임스페이스 접속');

    const req = socket.request;
    const { headers: {referer} } = req;
    var roomId = null;
    var user = null; // current client name
    var currentClient = null; // count

    socket.on('roomId', (data) => {
      roomId = data.roomId;
      user = data.user;
      currentClient = data.currentClient;
      console.log(user);
      let systemMsg = {
        user: '',
        chat: '',
        isMine: false,
        systemMsg: `${data.user}님이 접속했습니다.`
      }
      socket.join(roomId);
      socket.to(roomId).emit('join',systemMsg);
      axios.put(`http://localhost:8080/api/room/${roomId}`, {currentClient})
        .then(() => {
          console.log(`현재 인원 ${data.currentClient}`);
        })
        .catch((error) => {
          console.log(error);
        })
    })
   
    socket.on('chat', (data) => {
      socket.to(roomId).broadcast.emit(data);
    });
    
    socket.on('disconnect', () => {
      // console.log('room 네임스페이스 접속 해제', roomId);
      const currentRoom = socket.adapter.rooms.get(roomId);      
      const userCount = currentRoom ? currentRoom.size : 0;

      axios.put(`http://localhost:8080/api/room/${roomId}`, {currentClient: userCount})
        .then(() => {
          console.log(`현재 인원 ${userCount}`);
        })
        .catch( (error)=> {
          console.log(error);
        })
      // console.log(socket.adapter.rooms.get(roomId).size);
      socket.leave(roomId);
      
      if (userCount <= 0) {
        axios.delete(`http://localhost:8080/api/room/`, {data: {password: roomId} })
          .then(() => {
            console.log('방 제거');
          })
          .catch((error) => {
            console.log(error);
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
    })
  })
}