const { celebrate, Joi } = require('celebrate');
const regexUrlAvatar = require('../../utils/constants');

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(regexUrlAvatar),
  }),
});

module.exports = { createCardValidation };
