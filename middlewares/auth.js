/* eslint-disable consistent-return */
const { verifyToken } = require('../utils/jwt');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  return verifyToken(authorization)
    .then((check) => {
      req.user = { _id: check.id };
      // eslint-disable-next-line no-console
      console.log('Запрос от юзера с ID:', req.user._id);
      next();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { auth };
