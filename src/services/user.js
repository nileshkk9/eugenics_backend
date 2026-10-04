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

const assertAdmin = (adminUser) => {
  if (adminUser.level !== 'ADMIN') throwError('Only ADMIN can manage users', 403);
};

const parseUserId = (id) => {
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) throwError('Invalid user id', 400);
  return parsed;
};

const stripSecrets = (row) => {
  if (!row) return row;
  const { password, auth_token, token, token_expire_time, ...safe } = row;
  return safe;
};

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
  const res = await query(
    `SELECT * FROM users WHERE username = ? AND password = ?`,
    [userobj.username, userobj.password]
  );
  if (res.length === 0) throwError(`Invalid Username or Password`);
  const authToken = await generateAuthToken({ username: res[0].username });
  res[0].auth_token = authToken;
  return res;
};

user.getById = async (adminUser, id) => {
  assertAdmin(adminUser);
  const userId = parseUserId(id);
  const rows = await query(`SELECT * FROM users WHERE id = ?`, [userId]);
  if (rows.length === 0) throwError('User not found', 404);
  return stripSecrets(rows[0]);
};

user.updateById = async (adminUser, id, body) => {
  assertAdmin(adminUser);
  const userId = parseUserId(id);
  const rows = await query(`SELECT * FROM users WHERE id = ?`, [userId]);
  if (rows.length === 0) throwError('User not found', 404);
  const existing = rows[0];

  const fields = [];
  const values = [];

  if (body.username !== undefined) {
    const username = String(body.username).trim();
    if (!username) throwError('Username is required', 400);
    if (username !== existing.username) {
      const taken = await query(
        `SELECT id FROM users WHERE username = ? AND id <> ?`,
        [username, userId]
      );
      if (taken.length > 0) throwError('Username already in use', 400);
    }
    fields.push('username = ?');
    values.push(username);
  }

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) throwError('Name is required', 400);
    fields.push('name = ?');
    values.push(name);
  }

  if (body.email !== undefined) {
    const email = String(body.email).trim();
    if (email) {
      if (email !== existing.email) {
        const taken = await query(
          `SELECT id FROM users WHERE email = ? AND id <> ?`,
          [email, userId]
        );
        if (taken.length > 0) throwError('Email already in use', 400);
      }
    }
    fields.push('email = ?');
    values.push(email);
  }

  if (body.phn !== undefined) {
    fields.push('phn = ?');
    values.push(String(body.phn).trim());
  }

  if (body.address !== undefined) {
    fields.push('address = ?');
    values.push(String(body.address).trim());
  }

  if (body.password !== undefined && String(body.password).length > 0) {
    fields.push('password = ?');
    values.push(String(body.password));
  }

  if (body.isactive !== undefined) {
    const isactive =
      body.isactive === true || body.isactive === 1 || body.isactive === '1'
        ? 1
        : body.isactive === false || body.isactive === 0 || body.isactive === '0'
          ? 0
          : null;
    if (isactive === null) throwError('isactive must be 0 or 1', 400);
    if (isactive === 0 && Number(adminUser.id) === userId) {
      throwError('You cannot deactivate your own account', 400);
    }
    fields.push('isactive = ?');
    values.push(isactive);
  }

  if (fields.length === 0) throwError('No fields to update', 400);

  values.push(userId);
  await query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

  const updatedRows = await query(`SELECT * FROM users WHERE id = ?`, [userId]);
  const updated = updatedRows[0];
  const usernameChanged = updated.username !== existing.username;
  if (usernameChanged) {
    await generateAuthToken({ username: updated.username });
  }

  return {
    user: stripSecrets(updated),
    usernameChanged,
    mustRelogin: usernameChanged && Number(adminUser.id) === userId,
  };
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
