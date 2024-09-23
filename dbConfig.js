const mysql = require("mysql2");

exports.connect = function (done) {
  let pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: process.env.NODE_ENV === "test" ? "DB_TESTING" : "PROYECTO",
    port: 3306,
  });
  console.log(
    `BASE DE DATOS ${process.env.NODE_ENV === "test" ? "TESTING" : "PROYECTO"}`
  );

  global.db = pool;
};
