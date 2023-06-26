const router = require('express').Router();
const httpConstants = require('http2').constants;

// const addOwnerId = require('../middlewares/addOwnerId.js');
const userRoutes = require('./users');
const cardsRoutes = require('./cards');
const { login, createUser } = require('../controllers/users');

// router.use('/', addOwnerId);
router.post('/signin', login);
router.post('/signup', createUser);
router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);
router.use('*', (req, res) => res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Page not found' }));

module.exports = router;
