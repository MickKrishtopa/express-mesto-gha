const { celebrate, Joi } = require('celebrate');

const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = { getUserByIdValidation };
