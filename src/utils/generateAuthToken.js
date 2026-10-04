const jwt = require("jsonwebtoken");
const {query} = require("../db/mysql");
require("dotenv").config();


const generateAuthToken = async (user) => {
  const token = jwt.sign(
    { username: user.username.toString() },
    process.env.JWT_KEY
  );
  await query(`UPDATE users SET auth_token = ? WHERE username = ?`, [
    token,
    user.username,
  ]);
  return token;
};

module.exports = generateAuthToken;
