require('dotenv').config();

const { query } = require('../src/db/mysql');
const generateAuthToken = require('../src/utils/generateAuthToken');

const username = process.argv[2];

if (!username) {
  console.error('Usage: node scripts/reissue-auth-token.js <username>');
  process.exit(1);
}

(async () => {
  const rows = await query('SELECT id, username FROM users WHERE username = ?', [
    username,
  ]);
  if (rows.length === 0) {
    console.error(`No user found with username "${username}"`);
    process.exit(1);
  }

  const token = await generateAuthToken({ username });
  console.log(token);
  process.exit(0);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
