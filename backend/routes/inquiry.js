const express = require('express');
const router = express.Router();
const database = require('../database');


router.post('/', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
        message: '로그인 되지 않은 사용자입니다.'
    });
  }
   
  conn = database.init();
  
  const params = [
    req.body.title,
    req.body.text
  ]
  conn.query('INSERT INTO inquiry(`title`, `text`) VALUES (?, ?)', params, (err, row) => {
    if(err) {
      console.log(err);
      return res.status(404).send('error');
    }
    return res.status(201).json(row)
  })
  database.end();
  
})
module.exports = router;