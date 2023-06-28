const jwt = require('jsonwebtoken');
const User = require('../models/user');
const AuthorizationError = require('../errors/AuthorizationError');

const JWT_SECRET = 'secret-code';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

const verifyToken = (token) => jwt.verify(token, JWT_SECRET, (err, encoded) => {
  if (err) {
    return Promise.reject(new AuthorizationError('Authorization required'));
  }

  return User.findOne({ _id: encoded.id })
    .then((user) => user || new AuthorizationError('Authorization required'));
});

module.exports = {
  generateToken,
  verifyToken,
};
