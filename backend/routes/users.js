const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const database = require('../database');
// 회원정보를 가져오는 API


router.route('/:id')
  .all((req, res, next) => {
    req.conn = database.init();
    next();
  })
  .get((req, res) => {
    console.log('get user from user router');
    const id = req.params.id;
    req.conn.query('SELECT userid, password, name, nickname FROM user WHERE userid = ? AND is_deleted = "N"', id, (err, row) => {
      if (err) { console.log(err); }
      let user = row[0];
      if (!user) {
        return res.status(404).json({err: 'Unknown user'});
      }
      res.json(user);
      database.end(req.conn);
    });
  })
  
  // 회원정보를 생성하는 API
  // 조건1. 중복이 아닌 아이디
  // 조건2. 생성 규칙을 준수하는 비밀번호
  
  .post((req, res) => {
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
      database.end(conn);
    });
  })

  // 회원정보를 삭제하는 API
  // 1. 테이블에서 데이터를 삭제하는 방법
  // 2. 플래그를 사용하여 데이터가 삭제되었다고 표시 -> 적용!

  .delete((req, res) => {
    const id = req.params.id;
    conn.query('UPDATE user SET is_deleted = "Y", deleted_date = CURRENT_TIMESTAMP WHERE id = ?', id, (err, row) => {
      if (err) { console.log(err); }
      return res.status(204).send();
    });
    database.end(conn);
  })

  



// 아이디 유효성 검사 API
router.get('/checkId/:id', (req, res) => {
  const id = req.params.id;
  conn.query('SELECT id FROM user WHERE id = LOWER(?)', id, (err, row) => {
    if (err) { console.log(err); }
    return res.status(200).json({
        result: row[0] ? false : true
    });
  })
  // database.end(conn);
});

module.exports = router;