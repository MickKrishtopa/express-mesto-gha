const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret-code';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET, (err, encoded) => {
  if (err) {
    return false;
  }
  return encoded;
});

module.exports = {
  generateToken,
  verifyToken,
};
