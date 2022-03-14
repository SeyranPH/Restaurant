const router = require('express').Router();
const RestaurantService = require('../../service/RestaurantService');
const RestaurantRequestValidator = require('../../service/RequestValidation/RestaurantRequestValidator');

router.get('/getRestaurantData', getRestaurantData);
router.get('/getRestaurantInfo/:id', getRestaurantInfo);
router.get(
  '/getRestaurantDataFilteredByOwner',
  getRestaurantDataFilteredByOwner
);
router.post('/createRestaurant', createRestaurant);
router.post('/updateRestaurantData', updateRestaurantData);
router.delete('/deleteRestaurant/:id', deleteRestaurant);

async function getRestaurantData(req, res, next) {
  try {
    const restaurantData = await RestaurantService.getRestaurantData();
    res.json(restaurantData);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getRestaurantInfo(req, res, next) {
  try {
    const restaurantId = req.params.id;
    const restaurantInfo = await RestaurantService.getRestaurantInfo(
      restaurantId
    );
    res.json(restaurantInfo);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getRestaurantDataFilteredByOwner(req, res, next) {
  try {
    RestaurantRequestValidator.validateGetRestaurantDataFilteredByOwner(
      req.body
    );
    const data = req.body;
    const restaurantData =
      await RestaurantService.getRestaurantDataFilteredByOwner(data);
    res.json(restaurantData);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function createRestaurant(req, res, next) {
  try {
    RestaurantRequestValidator.validateCreateRestaurant(req.body);
    const data = req.body;
    const restaurant = await RestaurantService.createRestaurant(data);
    res.json(restaurant);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function updateRestaurantData(req, res, next) {
  try {
    RestaurantRequestValidator.validateUpdateRestaurantData(req.body);
    const data = req.body;
    const restaurant = await RestaurantService.updateRestaurantData(data);
    res.json(restaurant);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function deleteRestaurant(req, res, next) {
  try {
    const restaurantId = req.params.id;
    const restaurantInfo = await RestaurantService.deleteRestaurant(
      restaurantId
    );
    res.json(restaurantInfo);
  } catch (error) {
    next(error, req, res, next);
  }
}

module.exports = router;
