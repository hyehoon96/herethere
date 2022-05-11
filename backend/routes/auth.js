const express = require('express');
const bcrypt = require("bcrypt");
const router = express.Router();
const database = require('../database');

router.post('/login', (req, res) => {
    const userid = req.body.userid;
    const password = req.body.password;
    const remember = req.body.remember;
    if (req.session.user) {
        console.log(req.session.user);
        return res.status(400).json({
            message: '이미 로그인된 사용자입니다.'
        });
    } else {
        const conn = database.init();
        const selectUserSql = 'SELECT `id`,`userid`,`password`,`name`,`nickname` FROM user WHERE `userid`=?';

        conn.query(selectUserSql, userid, (err, row) => {
            if (err) { console.log(err); }
            var user = row[0];

            if (user === undefined || user === null) {
                return res.status(404).json({
                    message: '가입되지 않은 사용자입니다.'
                });
            } else {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (err) { console.log(err); }
                    if (check === true) {
                        req.session.user = {
                            id: user.id,
                            userid: user.userid,
                            name: user.name,
                            nickname: user.nickname,
                            authorized: true,
                        };
                        if (remember) {
                            req.session.cookie.maxAge = 60 * 24 * 60 * 60 * 1000; 
                        }
                        return res.status(200).json({
                            message: '사용자의 세션을 생성했습니다.',
                            nickname: user.nickname
                        });
                    } else {
                        return res.status(400).json({
                            message: '잘못된 비밀번호입니다.'
                        });
                    }
                });
            }
        });
        database.end(conn);
    }
});

router.get('/logout', (req, res) => {

    if (req.session.user) {
        req.session.destroy(err => {
            if (err) { console.log(err); }
            res.clearCookie('session_cookie_name');
            return res.status(205).json({
                message: '사용자의 세션을 삭제했습니다.'
            });
        });
    } else {
        return res.status(401).json({
            message: '로그인 되지 않은 사용자입니다.'
        });
    }
});

module.exports = router;