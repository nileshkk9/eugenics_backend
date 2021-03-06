const jwt = require("jsonwebtoken");
const { query } = require("../db/mysql");
const { throwError } = require("../utils/utils");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const sql = `SELECT * FROM users where username = '${decoded.username}'`;
    const res = await query(sql);
    if (res.length === 0) throwError("Logged user was not found", 400);
    req.token = token;
    req.user = res[0];
    next();
  } catch (error) {
    res.status(401).send({ error: "please autheniticate" });
  }
};
module.exports = auth;
