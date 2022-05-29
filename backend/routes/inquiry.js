const express = require('express');
const router = express.Router();
const database = require('../database');
const logger = require('../logger');

router.route('/')
  .all((req, res, next) => {
    if (req.session.key) {
      req.conn = database.init();
      next();
    } else {
      return res.status(401).json({
        message: '로그인 되지 않은 사용자입니다.'
      });
    }
  })
  .post((req, res) => {
    const params = [
      req.body.title,
      req.body.text
    ]
    req.conn.query('INSERT INTO inquiry(`title`, `text`) VALUES (?, ?)', params, (err, row) => {
      if(err) {
        logger.error(err)
        return res.status(404).send('error');
      } else {
        return res.status(201).json('ok');
      }
    })
    database.end(req.conn);
  })
  .get((req, res) => {
    req.conn.query('SELECT * FROM inquiry', (err, row) => {
      if(err) {
        logger.error(err)
        return res.status(404).send('Not found');
      } else {
        return res.status(200).json(row)
      }
    })
    database.end(req.conn);
  })

module.exports = router;