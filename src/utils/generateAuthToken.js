const jwt = require("jsonwebtoken");
const {query} = require("../db/mysql");
require("dotenv").config();


const generateAuthToken = async (user) => {
  const token = jwt.sign(
    { username: user.username.toString() },
    process.env.JWT_KEY
  );
  const sql = `UPDATE users SET auth_token = '${token}' WHERE username = '${user.username}' `;
  await query(sql);
  return token;
};

module.exports = generateAuthToken;
