const { celebrate, Joi } = require('celebrate');

const cardByIdValidation = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
});

module.exports = { cardByIdValidation };
