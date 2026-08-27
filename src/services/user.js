const { query } = require('../db/mysql');
const generateAuthToken = require('../utils/generateAuthToken');
const { throwError, generateToken } = require('../utils/utils');
const {
  sendContactUsMail,
  sendForgetPasswordMail,
  sendInviteMail,
} = require('../utils/mailTransporter');
const { REACT_BASE_URL, COMPANY_EMAIL } = require('../utils/constants');
const user = {};

user.createInvite = async (adminUser, { email, level }) => {
  if (adminUser.level !== 'ADMIN') throwError('Only ADMIN can generate invite links', 403);
  const token = generateToken();
  await query(
    `INSERT INTO user_invitations (token, email, level, created_by, expires_at)
     VALUES (?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
    [token, email, level, adminUser.id]
  );
  const link = `${REACT_BASE_URL}/register/${token}`;
  await sendInviteMail(email, link);
  return { message: 'Invite sent', link };
};

user.registerViaToken = async (token, { username, password, name, phn, address }) => {
  const rows = await query(
    `SELECT * FROM user_invitations WHERE token = ? AND is_used = 0 AND expires_at > NOW()`,
    [token]
  );
  if (rows.length === 0) throwError('Invalid or expired invite link', 400);
  const invite = rows[0];
  await query(
    `INSERT INTO users (username, password, email, phn, name, address, level, isactive)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [username, password, invite.email, phn, name, address, invite.level]
  );
  await query(
    `UPDATE user_invitations SET is_used = 1, used_at = NOW() WHERE token = ?`,
    [token]
  );
  const authToken = await generateAuthToken({ username });
  return { token: authToken, username, name };
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
