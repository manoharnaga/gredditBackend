const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const attachToken = (req, res, next) => {
  const token = generateToken(req.user);
  res.cookie('token', token, { httpOnly: true });
  next();
};

module.exports = attachToken;