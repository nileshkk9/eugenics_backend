const mysql = require("mysql");
const util = require("util");

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});


const connectionOld = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER_OLD,
  password: process.env.DB_PASS_OLD,
  database: process.env.DB_NAME_OLD,
});


const query = util.promisify(connection.query).bind(connection);
const queryOld = util.promisify(connectionOld.query).bind(connectionOld);

module.exports = { connection,connectionOld, query, queryOld };
