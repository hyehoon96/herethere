const express = require('express');
const router = express.Router();
const database = require('../database');

router.route('/')
    .all((req, res, next) => {
        console.log(router.route);
        if (!req.session.user) {
            return res.status(401).json({
                message: '로그인 되지 않은 사용자입니다.'
            });
        } else {
            req.conn = database.init();
            next();
        }
    })
    /**
     * 히스토리 생성 API
     */
    .post((req, res) => {
        var userId  = req.session.user.id;
        var placeId = req.body.id;

        const selectPlaceSql = 'SELECT `id`, `views` FROM place WHERE `id`=?';
        const insertPlaceSql = 'INSERT INTO place(`id`,`name`,`category_name`,`category_group_code`,`category_group_name`,`phone`,`address_name`,`road_address_name`,`x`,`y`,`url`) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        const updatePlaceViewsSql = 'UPDATE `place` SET `views`=`views`+1, `updated_date`=CURRENT_TIMESTAMP WHERE `id`=?';
        const insertHistorySql = 'INSERT INTO history(`user_id`,`place_id`) VALUES (?,?)';

        // 1. fetch place
        req.conn.query(selectPlaceSql, placeId, (err, row) => {
            if (err) { console.log(err); }
            if (!row[0]) {
                // 1-1. 없으면 insert place
                const params = [
                    req.body.id,
                    req.body.place_name,
                    req.body.category_name,
                    req.body.category_group_code,
                    req.body.category_group_name,
                    req.body.phone,
                    req.body.address_name,
                    req.body.road_address_name,
                    req.body.x,
                    req.body.y,
                    req.body.place_url
                ]

                req.conn.query(insertPlaceSql, params, (err, row) => {
                    if (err) { console.log(err); }
                });
            } else {
                // 1-2. 있으면 views 증가
                req.conn.query(updatePlaceViewsSql, placeId, (err, row) => {
                    if (err) { console.log(err); }
                });
            }

            // 2. insert history
            req.conn.query(insertHistorySql, [userId, placeId], (err, row) => {
                return res.status(201).json({
                    userId: userId,
                    placeId: placeId
                });
            });
            database.end(req.conn);
        });
    })
module.exports = router;