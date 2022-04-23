const router = require('express').Router();

const isVerified = require('../middleware/authorization');
const isOwner = require('../middleware/isOwner');
const RestaurantService = require('../service/RestaurantService');
const RestaurantRequestValidator = require('../service/RequestValidation/RestaurantRequestValidator');

router.post('/', [isVerified, isOwner], createRestaurant);
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', [isVerified, isOwner], updateRestaurant);
router.delete('/:id', [isVerified, isOwner], deleteRestaurant);

async function createRestaurant(req, res, next) {
  try {
    RestaurantRequestValidator.validateCreateRestaurant(req.body);
    const userId = req.user._id;
    const data = req.body;
    const restaurantId = await RestaurantService.createRestaurant(data, userId);
    return res.send({ id: restaurantId });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getRestaurants(req, res, next) {
  try {
    RestaurantRequestValidator.validateGetRestaurants(req.query);
    const { limit, skip, ownerUserId } = req.query;
    const restaurantData = await RestaurantService.getRestaurants(
      limit,
      skip,
      ownerUserId
    );
    return res.json(restaurantData);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getRestaurantById(req, res, next) {
  try {
    const restaurantId = req.params.id;
    const restaurant = await RestaurantService.getRestaurantById(restaurantId);
    return res.status(200).send(restaurant);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function updateRestaurant(req, res, next) {
  try {
    RestaurantRequestValidator.validateUpdateRestaurant(req.body);
    const result = await RestaurantService.updateRestaurant({
      restaurantId: req.params.id,
      user: req.user,
      data: req.body,
    });
    return res
      .status(200)
      .send({ message: 'Restaurant updated successfully', restaurant: result });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function deleteRestaurant(req, res, next) {
  try {
    await RestaurantService.deleteRestaurant({
      restaurantId: req.params.id,
      user: req.user,
    });
    return res.status(200).send({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    next(error, req, res, next);
  }
}

module.exports = router;
