const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const database = require('../database');
const logger = require('../logger');

/**
 * 유저 생성 API
 */
router.post('/', (req, res) => {
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

  const conn = database.init();
  const selectDuplicateUseridStmt = 'SELECT `userid` FROM user WHERE `userid`=LOWER(?)';
  const insertUserStmt = 'INSERT INTO user(`userid`,`password`,`name`,`nickname`,`age_group`,`gender`,`question`,`answer`) VALUES (?,?,?,?,?,?,?,?)';

  // 중복 아이디 확인
  conn.query(selectDuplicateUseridStmt, params[0], (err, row) => {
    if (err) {
      logger.error(err)
    }
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

    conn.query(insertUserStmt, params, (err, row) => {
      database.end(conn);
      if (err) {
        logger.error(err)
      }
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
  });
  //database.end(conn);
})

router.route('/reset/:userid/:nickname')
  .all((req, res, next) => {
    req.conn = database.init();
    next();
  })
  .get((req, res) => {
    const userParams = [
      req.params.userid,
      req.params.nickname,
    ];
    req.conn.query('SELECT `question`,`answer` FROM user WHERE `userid`=? AND `nickname`=?', userParams, (err, row) => {
      if (err) {
        logger.error(err)
        return res.status(500).json({
          message: 'internal server error!'
        });
      }
      if (row[0]) {
        return res.status(201).json({
          question: row[0].question,
          answer: row[0].answer,
        })
      } else {
        return res.status(404).json({
          message: '조회된 결과가 없습니다.'
        });
      }
    })
    database.end(req.conn);
  })
  .put((req, res) => {
    const resetUserParams = [
      req.body.userid,
      req.body.nickname
    ]
    bcrypt.hash(req.body.rePassword, 10, (err, hash) => {
      req.conn.query(`UPDATE user SET \`password\`= '${hash}' WHERE userid=? AND nickname=?`, resetUserParams, (err, row) => {
        if (err) {
          logger.error(err);
          return res.status(500);
        } else {
          return res.status(200).json({
            message: '비밀번호가 변경되었습니다.'
          });
        }
      });
      database.end(req.conn);  
    })
  })

router.route('/:userid')
  .all((req, res, next) => {
    req.conn = database.init();
    next();
  })
    /**
     * 유저 조회 API
     */
  .get((req, res) => {
    const userid = req.params.userid;
    const selectUserStmt = 'SELECT `userid`,`password`,`name`,`nickname`,`age_group`,`gender` FROM user WHERE `userid`=? AND `locked`=\'N\'';

    req.conn.query(selectUserStmt, userid, (err, row) => {
      if (err) {
        logger.error(err)
      }
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
      const deleteUserStmt = 'UPDATE user SET `locked`=\'Y\', `deleted_date`=CURRENT_TIMESTAMP WHERE `userid`=?';

      req.conn.query(deleteUserStmt, userid, (err, row) => {
        if (err) {
          logger.error(err)
        }
        return res.status(204).send();
      });
      database.end(req.conn);
    })

module.exports = router;