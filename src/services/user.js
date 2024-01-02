const { query } = require('../db/mysql');
const generateAuthToken = require('../utils/generateAuthToken');
const { throwError, generateToken } = require('../utils/utils');
const {
  sendContactUsMail,
  sendForgetPasswordMail,
} = require('../utils/mailTransporter');
const { REACT_BASE_URL, COMPANY_EMAIL } = require('../utils/constants');
const user = {};
user.addUser = async (userobj) => {
  const sql = `INSERT INTO users (username, password, email, phn, name, address) VALUES ('${userobj.username}', '${userobj.password}', '${userobj.email}' , '${userobj.phn}', '${userobj.name}', '${userobj.address}')`;
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

user.getRegionalUsers = async (user) => {
  let sql = '';
  if (user.level === 'EMP') {
    throwError('EMP Level Not Authorized', 404);
  } else if (user.level === 'MANAGER') {
    sql = `SELECT id, username, name FROM users WHERE isactive = 1 AND level = 'EMP'`;
  } else if (user.level === 'ADMIN') {
    sql = `SELECT id, username, name FROM users`;
  }
  const res = await query(sql);
  if (res.length === 0) throwError(`Empty user DB`);
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
  const url = `${REACT_BASE_URL}/${email}/${token}`;
  await sendForgetPasswordMail(email, url);
  return res;
};

user.contactUsMail = async ({ name, email, phoneNumber, subject, message }) => {
  const url = `${REACT_BASE_URL}`;
  await sendContactUsMail(name, email, phoneNumber, subject, message);
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

module.exports = user;
