const { Forbidden, NotFound } = require('../middleware/errorHandler');
const Restaurant = require('../model/restaurant');
const Review = require('../model/Review');

const createRestaurant = async (data, userId) => {
  const restaurantData = Object.assign(data, {owner: userId});
  const restaurant = await Restaurant.create(restaurantData);
  return restaurant._id;
};

const getRestaurants = async (limit, skip) => {
  const query = [
    {
      $sort: {
        popularity: -1,
        rating: -1
      }
    },
    {
      $project: {
        createdAt: 0,
        updatedAt: 0,
        popularity: 0,
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
  if (!result) {
    throw new NotFound('Restaurants not found');
  }
  return result;
};

const getRestaurantById = async (restaurantId) => {
  const result = await Restaurant.findOneAndUpdate({_id: restaurantId}, {$inc: {popularity: 1}}, {new: true}).populate('reviews');
  if (!result) {
    throw new NotFound('Restaurant not found');
  }
  return result;
};

const updateRestaurant = async ({restaurantId, user, data}) => {
  if (user.role && user.role.toLowerCase === 'owner') {
    const result = await Restaurant.findOneAndUpdate({_id: restaurantId}, data, {new: true});
    if (!result) {
      throw new NotFound('The user doesn\'t own restaurant with this id');
    }
    return result;
  }
  const result = await Restaurant.findOneAndUpdate({_id: restaurantId}, {new: true});
  return result;
}


const deleteRestaurant = async ({restaurantId, user}) => {
  if (user && user.role.toLowerCase === 'owner') {
    const result = await Restaurant.findOneAndDelete({_id: restaurantId, owner: user._id});
    if (!result) {
      throw new Forbidden('The user doesn\'t own restaurant with this id');
    }
    return;
  }
  const restaurant = await Restaurant.findOneAndDelete({_id: restaurantId});
  const reviews = restaurant.reviews;
  await Review.deleteMany({_id: {$in: reviews}});
  return;
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
};
