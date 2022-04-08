const router = require('express').Router();
const userRouter = require('./user/UserController.js');
const restaurantRouter = require('./restaurant/RestaurantController.js');

router.use('/user', userRouter);
router.use('/restaurant', restaurantRouter);

module.exports = router;
