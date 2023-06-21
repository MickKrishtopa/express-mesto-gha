const statusCodes = require('http').STATUS_CODES;
const httpConstants = require('http2').constants;
const mongoose = require('mongoose');

const User = require('../models/user');

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
  const newUserData = req.body;

  return User.create(newUserData)
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

const updateUserDataByID = (req, res, newUserData) => {
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
};

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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUserById,
  changeAvatarUserById,
};
