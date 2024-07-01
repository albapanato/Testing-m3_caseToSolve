const mysql = require('mysql2')

exports.connect = function (done) {

    let pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'm3_casetosolve',
        port: 3306

    })

    global.db = pool;

}