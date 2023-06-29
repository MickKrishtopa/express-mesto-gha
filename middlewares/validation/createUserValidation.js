const { celebrate, Joi } = require('celebrate');
const regexUrlAvatar = require('../../utils/constants');

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexUrlAvatar),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = { createUserValidation };
