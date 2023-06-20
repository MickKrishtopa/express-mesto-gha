const User = require("../models/user.js");

const getUsers = (req, res) => {
  console.log("getUsers");
  return User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      res.status(500).send({
        message: "Что-то пошло не так",
      });
    });
};

const getUserById = (req, res) => {
  console.log("getUserById");
  const { userId } = req.params;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "Запрашиваемый пользователь не найден",
        });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Что-то пошло не так.",
      });
    });
};

const createUser = (req, res) => {
  console.log("cteateUser");
  const newUserData = req.body;
  console.log("New user data:", newUserData);

  return User.create(newUserData)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: Object.values(err.errors)
            .map((err) => err.message)
            .join(", "),
        });
      }

      res.status(500).send({
        message: "Что-то пошло не так.",
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
          message: "Запрашиваемый пользователь не найден",
        });
      }

      return res.status(200).send(updateUserData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: Object.values(err.errors)
            .map((err) => err.message)
            .join(", "),
        });
      }

      console.log(err);
      res.status(500).send({
        message: "Что-то пошло не так.",
      });
    });
};
const changeAvatarUserById = (req, res) => {
  console.log("changeAvatarUserById");
  const userId = req.user._id;
  const newAvatarUserLink = req.body;
  return User.findByIdAndUpdate(userId, newAvatarUserLink, {
    new: true,
    runValidators: true,
  })
    .then((updateUserData) => {
      if (!updateUserData) {
        return res.status(404).send({
          message: "Запрашиваемый пользователь не найден",
        });
      }

      return res.status(200).send(updateUserData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: Object.values(err.errors)
            .map((err) => err.message)
            .join(", "),
        });
      }

      res.status(500).send({
        message: "Что-то пошло не так.",
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
