const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line
const regexUrlAvatar = /^((https?):\/\/)(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

const changeAvatarUserByIdValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexUrlAvatar),
  }),
});

module.exports = { changeAvatarUserByIdValidation };
