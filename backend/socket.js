const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, {
    path: '/socket.io',
    cors: {origin: '*'}
  });
  app.set('io', io);
  const room = io.of('/room');
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