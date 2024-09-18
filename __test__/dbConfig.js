const mysql = require("mysql2");

exports.connect = function (done) {
  let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "DB_TESTING",
    port: 3306,
  });
  console.log("BASE DE DATOS TESTING");
  global.db = pool;
};
