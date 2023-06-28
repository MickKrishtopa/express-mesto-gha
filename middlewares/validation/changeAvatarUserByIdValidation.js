const { celebrate, Joi } = require('celebrate');

const changeAvatarUserByIdValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(2).max(30),
  }),
});

module.exports = { changeAvatarUserByIdValidation };
