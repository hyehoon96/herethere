const express = require('express');
const router = express.Router();
const database = require('../database');


router.post('/', (req, res) => {
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
  
  
})
module.exports = router;