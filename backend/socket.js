const SocketIO = require('socket.io');

module.exports = (server) => {
  const io =SocketIO(server, {
    path: '/socket.io',
    cors: {origin: '*'}
  });

  io.on('connection', (socket)=> {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
    })

    socket.on('error', (error) => {
      console.error(error);
    })

    socket.on('chat', (data) => {
      console.log(data);
      let rtnMessage = {
        message: data.message
      };
      socket.broadcast.emit('chat', rtnMessage);
    })
    socket.on('send', (data) => {
      console.log(data);
      let rtnMessage = {
        message: data.message
      };
      socket.broadcast.emit('chat', rtnMessage);
    })
  })
}