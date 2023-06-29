const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line
const regexUrlAvatar = /^((https?):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexUrlAvatar),
    email: Joi.string().required().min(2).max(30).email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = { createUserValidation };
