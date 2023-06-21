const router = require('express').Router();

router.use((req, res, next) => {
  // console.log('middleware');
  req.user = {
    _id: '649180734c899be0396963fd',
  };
  // console.log('users ID from middleware', req.user);
  next();
});

module.exports = router;
