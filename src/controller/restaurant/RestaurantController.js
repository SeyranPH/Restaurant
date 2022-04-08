const router = require('express').Router();

const verify = require('../../middleware/authorization');
const isOwner = require('../../middleware/isOwner');
const RestaurantService = require('../../service/RestaurantService');
const RestaurantRequestValidator = require('../../service/RequestValidation/RestaurantRequestValidator');

router.post('/', [verify, isOwner], createRestaurant);
router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);

async function createRestaurant(req, res, next) {
  try {
    RestaurantRequestValidator.validateCreateRestaurant(req.body);
    const userId = req.user._id;
    const data = req.body;
    const restaurantId = await RestaurantService.createRestaurant(data, userId);
    res.send({id: restaurantId});
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getRestaurants(req, res, next) {
  try {
    RestaurantRequestValidator.validateGetRestaurants(req.query);
    const {limit, skip} = req.query;
    const restaurantData = await RestaurantService.getRestaurants(limit, skip);
    res.json(restaurantData);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getRestaurantById(req, res, next) {
  try {
    const restaurantId = req.params.id;
    const restaurantInfo = await RestaurantService.getRestaurantById(
      restaurantId
    );
    res.status(200).send(restaurantInfo);
  } catch (error) {
    next(error, req, res, next);
  }
}

module.exports = router;
