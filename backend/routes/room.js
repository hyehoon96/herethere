const express = require('express');
const router = express.Router();

router.post('/:password', (req, res) => {
  req.app.io.sockets.on('connection', socket => {
    console.log('connected!');
  })
  
});

module.exports = router;