const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const database = require('../database');

/**
 * 유저 생성 API
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

  // 데이터베이스 연결 및 쿼리 정의
  const conn = database.init();
  const selectDuplicateUseridSql = 'SELECT `userid` FROM user WHERE `userid`=LOWER(?)';
  const insertUserSql = 'INSERT INTO user(`userid`,`password`,`name`,`nickname`,`age_group`,`gender`,`question`,`answer`) VALUES (?,?,?,?,?,?,?,?)';

  // 중복 아이디 확인
  conn.query(selectDuplicateUseridSql, params[0], (err, row) => {
    if (err) { console.log(err); }
    if (row[0]) {
      return res.status(409).json({
        message: '이미 존재하는 아이디입니다.'
      });
    }
  });

  // 비밀번호 암호화 및 유저 생성
  bcrypt.hash(params[1], 10, (err, hash) => {
    params[0] = params[0].toLowerCase(); // 소문자로 변환
    params[1] = hash;

    conn.query(insertUserSql, params, (err, row) => {
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
     * 유저 조회 API
     */
  .get((req, res) => {
    const userid = req.params.userid;
    const selectUserSql = 'SELECT `userid`,`password`,`name`,`nickname`,`age_group`,`gender` FROM user WHERE `userid`=? AND `locked`=\'N\'';

    req.conn.query(selectUserSql, userid, (err, row) => {
      if (err) { console.log(err); }

      if (row[0]) {
        return res.status(200).json({
          userid: row[0].userid,
          //password: row[0].password,
          name: row[0].name,
          nickname: row[0].nickname,
          ageGroup: row[0].age_group,
          gender: row[0].gender
        });
      } else {
        return res.status(404).json({
          message: '해당 유저를 찾을 수 없습니다.'
        });
      }
    });
    database.end(req.conn);
  })
    /**
     * 유저 삭제 API
     */
  .delete((req, res) => {
    const userid = req.params.userid;
    const deleteUserSql = 'UPDATE user SET `locked`=\'Y\', `deleted_date`=CURRENT_TIMESTAMP WHERE `userid`=?'

    req.conn.query(deleteUserSql, userid, (err, row) => {
      if (err) { console.log(err); }
      return res.status(204).send();
    });
    database.end(req.conn);
  })

module.exports = router;