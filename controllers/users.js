const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../utils/jwt');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

// console.log(statusCodes);
// console.log(httpConstants);

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
  .catch(next);

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail(new NotFoundError())
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError());
      }

      return next(err);
    });
};

const createUser = (req, res, next) => {
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
    .then((user) => {
      const publicUseData = {
        name: user.name,
        about: user.about,
        _id: user._id,
        avatar: user.avatar,
        email: user.email,
      };
      return res.status(httpConstants.HTTP_STATUS_CREATED).send(publicUseData);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError(Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')));
      }

      if (err.name === 'MongoServerError') {
        return next(new ConflictError('User already created'));
      }
      return next(err);
    });
};

function updateUserDataByID(req, res, next, newUserData) {
  const userId = req.user._id;

  return User.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError())
    .then((updateUserData) => res.status(httpConstants.HTTP_STATUS_OK).send(updateUserData))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new ValidationError(Object.values(err.errors)
          .map((error) => error.message)
          .join(', ')));
      }

      return next(err);
    });
}

const changeUserById = (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    about: req.body.about,
  };
  updateUserDataByID(req, res, next, newUserData);
};

const changeAvatarUserById = (req, res, next) => {
  const newUserData = {
    avatar: req.body.avatar,
  };
  updateUserDataByID(req, res, next, newUserData);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken(user._id);
      return res.status(httpConstants.HTTP_STATUS_OK).send({ jwt: token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => User.findById(req.user._id)
  .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
  .catch(next);

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUserById,
  changeAvatarUserById,
  login,
  getUserInfo,
};
