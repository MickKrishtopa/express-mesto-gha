const router = require('express').Router();

// const addOwnerId = require('../middlewares/addOwnerId.js');
const userRoutes = require('./users');
const cardsRoutes = require('./cards');

// router.use('/', addOwnerId);
router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);
router.use('*', (req, res) => res.status(404).send({ message: 'Page not found' }));

module.exports = router;
