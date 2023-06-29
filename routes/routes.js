const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const { createUserValidation } = require('../middlewares/validation/createUserValidation');
const { loginValidation } = require('../middlewares/validation/loginValidation');
const userRoutes = require('./users');
const cardsRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);
router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);
router.use('*', (req, res, next) => next(new NotFoundError()));

module.exports = router;
