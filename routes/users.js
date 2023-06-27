const router = require('express').Router();

const {
  getUsers,
  getUserById,
  // createUser,
  changeUserById,
  changeAvatarUserById,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUsers);

// router.post('/', createUser);
router.patch('/:userId', changeUserById);
router.patch('/me', changeUserById);
router.get('/me', getUserInfo);
router.patch('/me/avatar', changeAvatarUserById);
router.get('/:userId', getUserById);

module.exports = router;
