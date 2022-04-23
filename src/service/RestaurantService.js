const { Forbidden, NotFound } = require('../middleware/errorHandler');
const Restaurant = require('../model/restaurant');
const Review = require('../model/Review');
const { startSession } = require('mongoose');
const { image } = require('../mockData');

const createRestaurant = async (data, userId) => {
  const restaurantData = Object.assign(data, { owner: userId });
  const restaurant = await Restaurant.create(restaurantData);
  return restaurant._id;
};

const getRestaurants = async (limit, skip, ownerUserId) => {
  const query = [
    {
      $sort: {
        score: -1,
      },
    },
    {
      $project: {
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      },
    },
  ];
  if (ownerUserId) {
    query.push({
      $match: {
        $expr: { $eq: ['$ownerId', { $toObjectId: ownerUserId }] },
      },
    });
  }
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
  const resultAdditionalData = result.map((result) => ({
    ...result,
    averageScore: 4.5,
    image,
  }));
  return resultAdditionalData;
};

const getRestaurantById = async (restaurantId) => {
  const result = await Restaurant.findOne({ _id: restaurantId }).populate(
    'reviews'
  );
  if (!result) {
    throw new NotFound('Restaurant not found');
  }
  result.averageScore = 4.5;
  console.log(result);
  result.image = image;

  return result;
};

const updateRestaurant = async ({ restaurantId, user, data }) => {
  if (user.role && user.role.toLowerCase === 'owner') {
    const result = await Restaurant.findOneAndUpdate(
      { _id: restaurantId },
      data,
      { new: true }
    );
    if (!result) {
      throw new NotFound("The user doesn't own restaurant with this id");
    }
    return result;
  }
  const result = await Restaurant.findOneAndUpdate(
    { _id: restaurantId },
    { new: true }
  );
  return result;
};

const deleteRestaurant = async ({ restaurantId, user }) => {
  if (user.role.toLowerCase() !== 'owner') {
    throw new Forbidden("The user doesn't own restaurant with this id");
  }
  try {
    session.startTransaction();

    const restaurant = await Restaurant.findOneAndDelete(
      { _id: restaurantId, owner: user._id },
      { session }
    );
    if (!restaurant) {
      throw new NotFound("The user doesn't own restaurant with this id");
    }
    console.log('Succesfully removed the restaurant');

    const reviews = restaurant.reviews;
    await Review.deleteMany({ _id: { $in: reviews } });
    console.log('Succesfully removed associated reviews');

    await session.commitTransaction();
    session.endSession();
    return;
  } catch (err) {
    console.log('Transaction failed, reverting changes');
    await session.abortTransaction();
    session.endSession();
    console.log(err.message);
    throw new InternalServerError('Session failed');
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};
