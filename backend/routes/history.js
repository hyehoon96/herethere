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
    /**
     * 히스토리 생성 API
     */
    .post((req, res) => {
        var userId  = req.session.key.id;
        var placeId = req.body.id;

        const selectPlaceStmt = 'SELECT `id`, `views` FROM place WHERE `id`=?';
        const insertPlaceStmt = 'INSERT INTO place(`id`,`name`,`category_name`,`category_group_code`,`category_group_name`,`phone`,`address_name`,`road_address_name`,`x`,`y`,`url`) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
        const updatePlaceViewsStmt = 'UPDATE `place` SET `views`=`views`+1, `updated_date`=CURRENT_TIMESTAMP WHERE `id`=?';
        const insertHistoryStmt = 'INSERT INTO history(`user_id`,`place_id`) VALUES (?,?)';

        // 1. fetch place
        req.conn.query(selectPlaceStmt, placeId, (err, row) => {
            if (err) { logger.error(err) }
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

                req.conn.query(insertPlaceStmt, params, (err, row) => {
                    if (err) { logger.error(err) }
                });
            } else {
                // 1-2. 있으면 views 증가
                req.conn.query(updatePlaceViewsStmt, placeId, (err, row) => {
                    if (err) { logger.error(err) }
                });
            }

            // 2. insert history
            req.conn.query(insertHistoryStmt, [userId, placeId], (err, row) => {
                return res.status(201).json({
                    userId: userId,
                    placeId: placeId
                });
            });
            database.end(req.conn);
        });
    })
    /**
     * 히스토리 목록 조회 API
     */
    .get((req, res) => {

        var userId  = req.session.key.id;
        const selectHistoryListStmt = 'SELECT p.id, p.name, p.category_name, p.category_group_code, p.category_group_name, p.phone, p.address_name, p.road_address_name, p.x, p.y, p.url FROM history h JOIN place p ON h.place_id = p.id WHERE h.user_id = ? AND h.locked = \'N\' AND p.locked = \'N\' ORDER BY h.created_date DESC';

        req.conn.query(selectHistoryListStmt, userId, (err, rows) => {
            if (err) { logger.error(err) }
            // todo: 응답에 히스토리 리스트 크기 추가하기
            return res.status(200).json(
                JSON.parse(JSON.stringify(rows))
            );
        });
        database.end(req.conn);
    })

router.route('/:placeId')
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
    /**
     * 히스토리 삭제 API
     */
    .delete((req, res) => {
        var userId  = req.session.key.id;
        var placeId = req.params.placeId;

        const deleteHistoryStmt = 'UPDATE history SET `locked` = \'Y\', `deleted_date` = CURRENT_TIMESTAMP WHERE `user_id`=? AND `place_id`=?';

        req.conn.query(deleteHistoryStmt, [userId, placeId], (err, row) => {
            if (err) { logger.error(err) }
            return res.status(204).send();
        });
        database.end(req.conn);
    })

router.get('/ranking', (req, res) => {
    req.conn = database.init();

    req.conn.query('SELECT * FROM place WHERE (updated_date BETWEEN DATE_ADD(NOW(),INTERVAL -1 MONTH ) AND NOW()) AND views > 0 ORDER BY views DESC LIMIT 10 ', (err, row) => {
        if(err) {
            logger.error(err)
            return res.status(500).send({message: '서버 오류가 발생했습니다.'});
        } 
        if (row) {
            return res.status(200).json(row);
        } else {
            return res.status(404).send({message: '데이터가 충분하지 않아 조회할 수 없습니다.'});
        }
    })
    database.end(req.conn);
})

module.exports = router;