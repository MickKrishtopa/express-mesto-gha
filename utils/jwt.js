const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'secret-code';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET, (err, encoded) => {
  if (err) {
    return false;
  }

  return User.findOne({ _id: encoded.id })
    .then((user) => user || false);
});

module.exports = {
  generateToken,
  verifyToken,
};
