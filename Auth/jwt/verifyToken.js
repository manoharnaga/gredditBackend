const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    const { exp } = decoded;  // Get token expiration time in seconds from decoded token
    if (Date.now() >= exp * 1000) {
      // Token has expired, generate a new token and send it in the response
      const newToken = jwt.sign({ username: decoded.username }, JWT_SECRET, { expiresIn: '1h' });
      res.setHeader('Authorization', `Bearer ${newToken}`);
    }
    req.user = decoded;
    next();
  });
};
module.exports = verifyToken;