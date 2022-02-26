const User = require('../model/user');
const {
  NotFound,
  Unauthorized,
  Forbidden,
} = require('../middleware/errorHandler');

const getRestaurantData = async () => {
  return Promise.resolve({});
};
const getRestaurantInfo = async (restaurantId) => {
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
  signup,
  login,
  emailConfirmation,
};

async function userSignup(data) {}
