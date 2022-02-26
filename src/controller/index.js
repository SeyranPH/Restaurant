
const router = require('express').Router();

router.use('/user', require('./user/UserController.js'));
//router.use('/restaurant', require('./restaurant/RestaurantController'));

module.exports = router;