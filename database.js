require('dotenv').config();

const mysql = require('mysql');
const db_config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}

module.exports = {
    init: function () {
        return mysql.createConnection(db_config);
    },
    connect: function(conn) {
        conn.connect(function(err) {
            if (err) {
                console.error('mysql connection failed: ' + err.stack);
            } else {
                console.log('mysql is successfully connected! thread_id: ' + conn.threadId);
            }
        });
    }
}
