const router = require('express').Router();

const {
  getUsers,
  getUserById,
  createUser,
  changeUserById,
  changeAvatarUserById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/:userId', changeUserById);
router.patch('/me', changeUserById);
router.patch('/me/avatar', changeAvatarUserById);

module.exports = router;
