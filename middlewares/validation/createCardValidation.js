const { celebrate, Joi } = require('celebrate');
// eslint-disable-next-line
const regexUrlAvatar = /^((https?):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(regexUrlAvatar),
  }),
});

module.exports = { createCardValidation };
