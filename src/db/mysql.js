const mysql = require('mysql');
const util = require('util');

const connection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectTimeout: 30000,
  timeout: 30000,
  dateStrings: true,
});
const connectionWebsite = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER_OFFICIAL_WEBSITE,
  password: process.env.DB_PASS_OFFICIAL_WEBSITE,
  database: process.env.DB_NAME_OFFICIAL_WEBSITE,
  connectTimeout: 30000,
  timeout: 30000,
  dateStrings: true,
});

const connectionOld = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER_OLD,
  password: process.env.DB_PASS_OLD,
  database: process.env.DB_NAME_OLD,
  connectTimeout: 3 * 60 * 60 * 1000,
  timeout: 3 * 60 * 60 * 1000,
});

const query = util.promisify(connection.query).bind(connection);
const queryWebsite = util.promisify(connection.query).bind(connectionWebsite);
const queryOld = util.promisify(connectionOld.query).bind(connectionOld);

module.exports = { connection, connectionOld, query, queryOld, queryWebsite };
