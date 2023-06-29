/* eslint-disable consistent-return */
const { verifyToken } = require('../utils/jwt');
const AuthorizationError = require('../errors/AuthorizationError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  const check = verifyToken(authorization);

  if (!check) {
    return next(new AuthorizationError('Authorization required'));
  }

  req.user = { _id: check.id };
  // eslint-disable-next-line no-console
  console.log('Запрос от юзера с ID:', req.user._id);
  next();
};

module.exports = { auth };
