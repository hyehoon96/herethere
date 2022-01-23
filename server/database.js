const mysql    = require('mysql');
const dbconfig = require('../config/database.js');

module.exports.connect = function(){
    const conn = mysql.createConnection({
        host: dbconfig.host,
        port: dbconfig.port,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database
    });
    conn.connect(function(err) {
        if (err) {
            console.error('Connection failed: ' + err.stack);
            return;
        }
        console.log('Connected successfully! threadId: ' + conn.threadId);
    });
    return conn;
}