const router = require('express').Router();
const userRouter = require('./UserController.js');
const restaurantRouter = require('./RestaurantController.js');
const reviewRouter = require('./ReviewController.js');

router.use('/user', userRouter);
router.use('/restaurant', restaurantRouter);
router.use('/review', reviewRouter);

module.exports = router;
