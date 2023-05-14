const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const generateToken = async (username) => {
  // const payload = { id: user._id,username:user.username, email: user.email };
  const options = { expiresIn: '1h' };
  const jwt_sign = await jwt.sign({username:username}, JWT_SECRET, options);
  return jwt_sign;
};

module.exports = generateToken;