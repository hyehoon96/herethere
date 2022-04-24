require('dotenv').config();
const mysql = require('mysql');
const db_config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}

module.exports = {
    init: function () {
        return mysql.createConnection(db_config);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if (err) {
                console.error('데이터베이스 연결에 실패했습니다: ' + err.stack);
            } else {
                console.log('데이터베이스를 연결했습니다: ' + conn.threadId);
            }
        });
    },
    end: function(conn) {
        conn.end(function(err) {
            if (err) {
                console.error('데이터베이스 연결 종료에 실패했습니다: ' + err.stack);
            } else {
                console.log('데이터베이스 연결을 종료했습니다: ' + conn.threadId);
            }
        })
    }
}