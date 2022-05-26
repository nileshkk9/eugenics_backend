const { query } = require("../db/mysql");
const generateAuthToken = require("../utils/generateAuthToken");
const { throwError, generateToken } = require("../utils/utils");
const sendMail = require("../utils/mailTransporter");

const user = {};
user.addUser = async (userobj) => {
  const sql = `INSERT INTO users (username, email, phn, name) VALUES ('${userobj.username}', '${userobj.email}' , '${userobj.phn}', '${userobj.name}')`;
  const res = await query(sql);
  const token = await generateAuthToken(userobj);
  return token;
};

user.login = async (userobj) => {
  const sql = `SELECT * FROM users WHERE username = '${userobj.username}' 
  AND password = '${userobj.password}'`;
  const res = await query(sql);
  if (res.length === 0) throwError(`Invalid Username or Password`);
  return res;
};

user.forgotpasswordMailer = async (email) => {
  const sql = `SELECT * FROM users WHERE email = '${email}'`;
  const res = await query(sql);
  if (res.length === 0) {
    throwError(`No user with ${email} found`);
  }
  const token = generateToken();
  const sqlUpdateToken = `UPDATE users SET token='${token}', 
  token_expire_time=DATE_ADD(NOW(),INTERVAL 5 MINUTE) WHERE email='${email}'`;
  await query(sqlUpdateToken);
  const url = "http://eugenicspharma.in";
  await sendMail(email, url);
  return res;
};

user.verifyRecovery = async ({ email, token, password }) => {
  const sql = `SELECT * FROM users WHERE email='${email}' 
  AND token='${token}' AND token<>'' AND token_expire_time > NOW()`;
  const res = await query(sql);
  if (res.length > 0) {
    const sqlUpdatePass = `UPDATE users SET token='', password = '${password}' 
    WHERE email='${email}'`;
    await query(sqlUpdatePass);
  } else {
    throwError(`No user with email = ${email} found or token expired`);
  }
  return res;
};

user.getDoctorsByUserId = async (user) => {
  const sql = `SELECT DISTINCT d.name label FROM entries e 
  INNER JOIN doctor d on e.docid = d.id WHERE e.uid = ${user.id}`;
  const res = await query(sql);
  return res;
};



user.getDoctorsQualification = async (user) => {
  const sql = `SELECT DISTINCT qualification label FROM doctor`;
  const res = await query(sql);
  return res;
};

user.getLocationsByUserId = async (user) => {
  const sql = `SELECT DISTINCT l.name label FROM entries e 
  INNER JOIN location l on e.locid = l.id WHERE e.uid = ${user.id}`;
  const res = await query(sql);
  return res;
};

module.exports = user;
