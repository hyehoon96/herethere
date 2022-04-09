var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var conn = require('../database');

// 회원정보를 가져오는 API
router.get('/:id', (req, res) => {
    console.log('get user from user router');
  const id = req.params.id;
  conn.query('SELECT id, password, name, nickname FROM user WHERE id = ? AND is_deleted = "N"', id, (err, row) => {
      if (err) { console.log(err); }
      let user = row[0];
      if (!user) {
          return res.status(404).json({err: 'Unknown user'});
      }
      res.json(user);
  });
});

// 회원정보를 삭제하는 API
// 1. 테이블에서 데이터를 삭제하는 방법
// 2. 플래그를 사용하여 데이터가 삭제되었다고 표시 -> 적용!
router.delete('/user/:id', (req, res) => {
  const id = req.params.id;
  conn.query('UPDATE user SET is_deleted = "Y", deleted_date = CURRENT_TIMESTAMP WHERE id = ?', id, (err, row) => {
      if (err) { console.log(err); }
      return res.status(204).send();
  });
});

// 회원정보를 생성하는 API
// 조건1. 중복이 아닌 아이디
// 조건2. 생성 규칙을 준수하는 비밀번호
router.post('/user', (req, res) => {
  const params = [
      req.body.id.toLowerCase(), // 소문자로 변환
      req.body.password,
      req.body.name,
      req.body.nickname
  ];
  bcrypt.hash(params[1], 10, (err, hash) => {
      params[1] = hash;
      conn.query('INSERT INTO user(`id`,`password`,`name`,`nickname`) VALUES (?,?,?,?)', params, (err, row) => {
          if (err) { console.log(err); }
          return res.status(201).json({
              no: row['insertId'],
              id: params[0],
              password: params[1],
              name: params[2],
              nickname: params[3]
          });
      });
  });
});

// 아이디 유효성 검사 API
router.get('/user/checkId/:id', (req, res) => {
  const id = req.params.id;
  conn.query('SELECT id FROM user WHERE id = LOWER(?)', id, (err, row) => {
      if (err) { console.log(err); }
      return res.status(200).json({
          result: row[0] ? false : true
      });
  })
});

module.exports = router;