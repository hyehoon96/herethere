require('dotenv').config();
const mysql = require('mysql');
var db;
const db_config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}
function connectDatabase() {
    if (!db) {
        db = mysql.createConnection(db_config);

        db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();
// module.exports = {
//     init: function () {
//         return mysql.createConnection(db_config);
//     },
//     connect: function(conn) {
//         conn.connect(function(err) {
//             if (err) {
//                 console.error('데이터베이스 연결에 실패했습니다: ' + err.stack);
//             } else {
//                 console.log('데이터베이스를 연결했습니다: ' + conn.threadId);
//             }
//         });
//     },
//     end: function(conn) {
//         conn.end(function(err) {
//             if (err) {
//                 console.error('데이터베이스 연결 종료에 실패했습니다: ' + err.stack);
//             } else {
//                 console.log('데이터베이스 연결을 종료했습니다: ' + conn.threadId);
//             }
//         })
//     }
// }