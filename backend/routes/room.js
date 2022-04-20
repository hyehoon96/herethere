const express = require('express');
const router = express.Router();
const database = require('../database');

router.route('/')
  .all((req, res, next) => {
    req.conn = database.init();
    next();
  })
  
  .post((req, res) => {
    console.log(req.body);
    const params = [
      req.body.max,
      req.body.password,
      0
    ]
    req.conn.query('INSERT INTO room( `max`, `password`, `currentClient`) VALUES (?,?,?)', params, (err, row) => {
      if(err) { 
        console.log(err); 
        return res.status(404).send('Not found');
      }
      return res.status(201).json({
        max: params[0],
        password: params[1],
      })
    })
    database.end(req.conn);
  })
  .delete((req, res) => {
    const roomNumber = req.body.password;
    req.conn.query('DELETE FROM room WHERE password = ?', roomNumber, (err, row) => {
      if (err) { console.log(err); }
      return res.status(204).send();
    });
    database.end(req.conn);
  })

  
  router.get('/:password', (req, res) => {
    console.log(req.params.password);
    req.conn = database.init();
    const roomNumber = req.params.password;
    req.conn.query('SELECT *  FROM room WHERE password = ?', roomNumber, (err, row) => {
      
      if (err) { console.log(err); }
      let room = row[0];
      if (!room) {
        return res.status(201).send({empty: 'empty'});
      }
      res.json(room);
      database.end(req.conn);
    })
  })

  router.post('/:password', (req, res) => {
    try {
      const chat = {
        user: req.body.user,
        chat: req.body.chat,
        vapidKey: req.body.vapidKey,
        systemMsg: req.body.systemMsg,
        color: req.session.color
      };
      req.app.get('io').of('/room').to(req.params.password).emit('chat', chat);
      res.send('ok');
    } catch (e) {
      console.log(e);
    }
    
  })

  router.put('/:password', (req, res) => {
    req.conn = database.init();
    const roomNumber = req.params.password;
    console.log(req.body);
    req.conn.query(`UPDATE room SET currentClient=${req.body.currentClient}  WHERE password = ? `, roomNumber, (err, row) => {
      if (err) { console.log(err); }
      res.send('ok');
    })
  })
module.exports = router;