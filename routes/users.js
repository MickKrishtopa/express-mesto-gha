const router = require('express').Router();
const { getUserByIdValidation } = require('../middlewares/validation/getUserByIdValidation');
const { changeUserByIdValidation } = require('../middlewares/validation/changeUserByIdValidation');
const { changeAvatarUserByIdValidation } = require('../middlewares/validation/changeAvatarUserByIdValidation');

const {
  getUsers,
  getUserById,
  changeUserById,
  changeAvatarUserById,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUserByIdValidation, getUsers);

router.patch('/:userId', changeUserByIdValidation, changeUserById);
router.patch('/me', changeUserByIdValidation, changeUserById);
router.get('/me', getUserByIdValidation, getUserInfo);
router.patch('/me/avatar', changeAvatarUserByIdValidation, changeAvatarUserById);
router.get('/:userId', getUserByIdValidation, getUserById);

module.exports = router;
