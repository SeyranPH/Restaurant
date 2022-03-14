const Restaurant = require('../model/restaurant');

const getRestaurantData = async () => {
  const result = await Restaurant.find({});

  return result;
};
const getRestaurantInfo = async (restaurantId) => {
  const result = await Restaurant.find({});
  return Promise.resolve({});
};
const getRestaurantDataFilteredByOwner = async (data) => {
  return Promise.resolve({});
};
const createRestaurant = async (data) => {
  return Promise.resolve({});
};
const updateRestaurantData = async (data) => {
  return Promise.resolve({});
};
const deleteRestaurant = async (restaurantId) => {
  return Promise.resolve({});
};

module.exports = {
  getRestaurantData,
  getRestaurantInfo,
  getRestaurantDataFilteredByOwner,
  createRestaurant,
  updateRestaurantData,
  deleteRestaurant,
};
