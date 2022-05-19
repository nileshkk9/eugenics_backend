const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const query = util.promisify(connection.query).bind(connection);

module.exports = { connection, query };
