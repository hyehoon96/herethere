const express = require('express');
const router = express.Router();
const database = require('../database');
const logger = require('../logger');


router.route('/')
  .all((req, res, next) => {
    req.conn = database.init();
    next();
  })
  .get((req, res) => {
    req.conn.query('SELECT * FROM room', (err, row) => {
      if(err) {
        logger.error(err)
        return res.status(404).send('Not found');
      }
      return res.status(201).json(row)
    })
    database.end(req.conn);
  })
  .post((req, res) => {
    if (!req.session.key) {
        return res.status(401).json({
            message: '로그인 되지 않은 사용자입니다.'
        });
    }
    const params = [
      req.body.title,
      req.body.max,
      req.body.password,
      0
    ]
    req.conn.query('INSERT INTO room( `title`, `max`, `password`, `current_client`) VALUES (?,?,?,?)', params, (err, row) => {
      if(err) { 
        logger.error(err)
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
      if (err) { logger.error(err) }
      return res.status(204).send();
    });
    database.end(req.conn);
  })

  
  router.get('/:password', (req, res) => {
    req.conn = database.init();
    const roomNumber = req.params.password;
    req.conn.query('SELECT *  FROM room WHERE password = ?', roomNumber, (err, row) => {
      
      if (err) { logger.error(err) }
      if (!row[0]) {
        return res.status(200).send({empty: 'empty'});
      }
      return res.json(row[0]);
    });
    database.end(req.conn);
  })

  router.post('/:password', (req, res) => {
    try {
      const chat = {
        user: req.body.user,
        chat: req.body.chat,
        vapidKey: req.body.vapidKey,
        systemMsg: req.body.systemMsg,
        color: req.session.color,
        locate: req.body.locate,
        voteList: req.body.voteList

      };
      req.app.get('io').of('/room').to(req.params.password).emit('chat', chat);
      res.status(200).send();
    } catch (e) {
      logger.error(e);
    }
    
  })
  router.post('/vote/:password', (req, res) => {
    const voteChat = {
      user: req.body.user,
      vapidKey: req.body.vapidKey,
      index: req.body.index
    }
    req.app.get('io').of('/room').to(req.params.password).emit('voteChat', voteChat);
    res.status(200).send();
  })
  router.put('/:password', (req, res) => {
    req.conn = database.init();
    const roomNumber = req.params.password;
    req.conn.query(`UPDATE room SET current_client=${req.body.currentClient}  WHERE password = ? `, roomNumber, (err, row) => {
      if (err) { logger.error(err) }
      res.status(200).send();
    })
    database.end(req.conn);
  })
module.exports = router;