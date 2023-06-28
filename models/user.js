const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const validator = require('validator');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
const AuthorizationError = require('../errors/AuthorizationError');

const regexUrlAvatar = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator: (string) => regexUrlAvatar.test(string),
      message: 'URL is not a valid!',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',

  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (string) => validator.isEmail(string),
      message: 'Email is not a valid!',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },

});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Invalid email or password');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorizationError('Invalid email or password');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
