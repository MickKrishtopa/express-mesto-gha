const User = require('../models/user');

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch(() => {
    res.status(500).send({
      message: 'Что-то пошло не так',
    });
  });

const getUserById = (req, res) => {
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.status(200).send(user);
    })
    .catch(() => {
      if (userId.length !== 12) {
        return res.status(400).send({
          message: 'Некорректный ID',
        });
      }
      return res.status(500).send({
        message: 'Что-то пошло не так.',
      });
    });
};

const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: Object.values(err.errors)
            .map((error) => error.message)
            .join(', '),
        });
      }

      return res.status(500).send({
        message: 'Что-то пошло не так.',
      });
    });
};

const changeUserById = (req, res) => {
  const userId = req.user._id;
  const newUserData = req.body;

  return User.findByIdAndUpdate(userId, newUserData, {
    new: true,
    runValidators: true,
  })
    .then((updateUserData) => {
      if (!updateUserData) {
        return res.status(404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }

      return res.status(200).send(updateUserData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: Object.values(err.errors)
            .map((error) => error.message)
            .join(', '),
        });
      }

      return res.status(500).send({
        message: 'Что-то пошло не так.',
      });
    });
};
const changeAvatarUserById = (req, res) => {
  const userId = req.user._id;
  const newAvatarUserLink = req.body;
  return User.findByIdAndUpdate(userId, newAvatarUserLink, {
    new: true,
    runValidators: true,
  })
    .then((updateUserData) => {
      if (!updateUserData) {
        return res.status(404).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }

      return res.status(200).send(updateUserData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: Object.values(err.errors)
            .map((error) => error.message)
            .join(', '),
        });
      }

      return res.status(500).send({
        message: 'Что-то пошло не так.',
      });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  changeUserById,
  changeAvatarUserById,
};
