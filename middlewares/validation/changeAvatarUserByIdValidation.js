const { celebrate, Joi } = require('celebrate');

const regexUrlAvatar = require('../../utils/constants');

const changeAvatarUserByIdValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regexUrlAvatar),
  }),
});

module.exports = { changeAvatarUserByIdValidation };
