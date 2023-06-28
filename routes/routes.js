const router = require('express').Router();
const httpConstants = require('http2').constants;
const { auth } = require('../middlewares/auth');
const { createUserValidation } = require('../middlewares/validation/createUserValidation');
const { loginValidation } = require('../middlewares/validation/loginValidation');

// const addOwnerId = require('../middlewares/addOwnerId.js');
const userRoutes = require('./users');
const cardsRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');

// router.use('/', addOwnerId);
router.post('/signin', loginValidation, login);
router.post('/signup', createUserValidation, createUser);
router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardsRoutes);
router.use('*', (req, res) => res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Page not found' }));

module.exports = router;
