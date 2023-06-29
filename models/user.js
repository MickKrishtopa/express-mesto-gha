const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthorizationError = require('../errors/AuthorizationError');
const regexUrlAvatar = require('../utils/constants');

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
