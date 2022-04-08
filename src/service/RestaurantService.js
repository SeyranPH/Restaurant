const Restaurant = require('../model/restaurant');

const createRestaurant = async (data, userId) => {
  const restaurantData = Object.assign(data, {ownerId: userId});
  const restaurant = await Restaurant.create(restaurantData);
  return restaurant._id;
};

const getRestaurants = async (limit, skip) => {
  const query = [
    {
      $sort: {
        rating: -1,
      }
    },
    {
      $project: {
        createdAt: 0,
        updatedAt: 0,
        rating: 0,
        __v: 0
      },
    }
  ]
  if (limit) {
    query.push({
      $limit: Number(limit),
    });
  }
  if (skip) {
    query.push({
      $skip: Number(skip),
    });
  }
  const result = await Restaurant.aggregate(query);
  return result;
};

const getRestaurantById = async (restaurantId) => {
  const result = await Restaurant.findOneAndUpdate({_id: restaurantId}, {$inc: {rating: 1}}, {new: true});
  return result;
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,

};
