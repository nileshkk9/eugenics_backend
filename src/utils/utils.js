const crypto = require("crypto");

const throwError = (msg, status) => {
  const err = new Error(msg);
  err.status = status;
  throw err;
};
const generateToken = () => crypto.randomBytes(64).toString("hex");

module.exports = { throwError, generateToken };
