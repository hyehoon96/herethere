const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const database = require('../database');

/**
 * 회원정보 생성 API
 * - 조건1. 중복이 아닌 아이디
 * - 조건2. 작성규칙을 준수하는 비밀번호
 */
router.post('/', (req, res) => {
  console.log(req.body);
  const params = [
    req.body.userid,
    req.body.password,
    req.body.name,
    req.body.nickname,
    req.body.ageGroup,
    req.body.gender,
    req.body.question,
    req.body.answer
  ];


  conn = database.init();
  // 중복 아이디 확인
  conn.query(selectDuplicateUseridSql, params[0], (err, row) => {
    if (err) { console.log(err); }
    if (row[0]) {
      return res.status(409).json({
        message: '이미 존재하는 아이디입니다.'
      });
    }
  });
  bcrypt.hash(params[1], 10, (err, hash) => {
    params[0] = params[0].toLowerCase(); // 소문자로 변환
    params[1] = hash;
    conn.query('INSERT INTO user(`userid`,`password`,`name`,`nickname`,`age_group`,`gender`,`question`,`answer`) VALUES (?,?,?,?,?,?,?,?)'
        , params, (err, row) => {
      if (err) { console.log(err); }
      return res.status(201).json({
        id: row.insertId,
        userid: params[0],
        // password: params[1],
        name: params[2],
        nickname: params[3],
        ageGroup: params[4],
        gender: params[5]
      });
    });
    database.end(conn);
  });
})

router.route('/:userid')
  .all((req, res, next) => {
    console.log(router.route);
    req.conn = database.init();
    next();
  })
    /**
     * 회원정보 단건조회 API
     */
  .get((req, res) => {
    console.log('get user from user router');
    const userid = req.params.userid;

    req.conn.query('SELECT `userid`, `password`, `name`, `nickname`, `age_group`, `gender` FROM user WHERE `userid` = ? AND `is_deleted` = "N"'
    req.conn.query(selectUserSql, userid, (err, row) => {
      if (err) { console.log(err); }
      if (user = row[0]) {
        return res.status(200).json({
          userid: user.userid,
          password: user.password,
          name: user.name,
          nickname: user.nickname,
          ageGroup: user.age_group,
          gender: user.gender
        });
      } else {
        return res.status(404).json({err: 'Unknown user'});
      }
      database.end(req.conn);
    });
  })
    /**
     * 회원정보 삭제 API
     */
  .delete((req, res) => {
    //console.log('delete user from user router');
    req.conn.query('UPDATE user SET `is_deleted` = "Y", `deleted_date` = CURRENT_TIMESTAMP WHERE `userid` = ?'
    const userid = req.params.userid;
    req.conn.query(deleteUserSql, userid, (err, row) => {
      if (err) { console.log(err); }
      return res.status(204).send();
    });
    database.end(req.conn);
  })

module.exports = router;