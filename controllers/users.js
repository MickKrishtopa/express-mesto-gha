const statusCodes = require('http').STATUS_CODES;
const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const User = require('../models/user');
// console.log(statusCodes);
// console.log(httpConstants);
const getUsers = (req, res) => User.find({})
  .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
  .catch(() => {
    res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
      message: `${statusCodes[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]}`,
    });
  });

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(new Error('UserNotFound'))
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err.message === 'UserNotFound') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({
          message: `${statusCodes[httpConstants.HTTP_STATUS_NOT_FOUND]}`,
        });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${statusCodes[httpConstants.HTTP_STATUS_BAD_REQUEST]}, invalid ID`,
        });
      }
      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `${statusCodes[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]}`,
      });
    });
};

const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: Object.values(err.errors)
            .map((error) => error.message)
            .join(', '),
        });
      }

      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `${statusCodes[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]}`,
      });
    });
};

function updateUserDataByID(req, res, newUserData) {
  const userId = req.user._id;
  console.log(newUserData);

  return User.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
  })
    .orFail(new Error('UserNotFound'))
    .then((updateUserData) => res.status(httpConstants.HTTP_STATUS_OK).send(updateUserData))
    .catch((err) => {
      if (err.message === 'UserNotFound') {
        return res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({
          message: `${statusCodes[httpConstants.HTTP_STATUS_NOT_FOUND]}`,
        });
      }

      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: Object.values(err.errors)
            .map((error) => error.message)
            .join(', '),
        });
      }

      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `${statusCodes[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]}`,
      });
    });
}

const changeUserById = (req, res) => {
  const newUserData = {
    name: req.body.name,
    about: req.body.about,
  };
  updateUserDataByID(req, res, newUserData);
};

const changeAvatarUserById = (req, res) => {
  const newUserData = {
    avatar: req.body.avatar,
  };
  updateUserDataByID(req, res, newUserData);
};

const login = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secretCode!', { expiresIn: '7d' });
      return res.status(httpConstants.HTTP_STATUS_OK).send(token);
    })
    .catch((err) => {
      if (err.message === 'InvalidPasswordOrEmail') {
        return res.status(httpConstants.HTTP_STATUS_UNAUTHORIZED).send({
          message: `Invalid password or email. ${statusCodes[httpConstants.HTTP_STATUS_UNAUTHORIZED]}`,
        });
      }

      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({
          message: Object.values(err.errors)
            .map((error) => error.message)
            .join(', '),
        });
      }

      return res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: `${statusCodes[httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR]}`,
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUserById,
  changeAvatarUserById,
  login,
};
