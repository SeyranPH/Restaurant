const { Forbidden, NotFound } = require('../middleware/errorHandler');
const ImageService = require('./ImageService');
const Restaurant = require('../model/restaurant');
const Review = require('../model/review');
const { startSession } = require('mongoose');

const createRestaurant = async (data, userId, photo) => {
  const s3Url = await ImageService.uploadImageToS3(photo);
  const restaurantData = Object.assign(data, { owner: userId, image: s3Url });
  const {
    name,
    description,
    image,
    location,
    _id: id,
  } = await Restaurant.create(restaurantData);
  return { name, description, image, location, id };
};

const getRestaurants = async (limit, skip, ownerId) => {
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
  if (ownerId) {
    query.push({
      $match: {
        $expr: { $eq: ['$owner', { $toObjectId: ownerId }] },
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
  result.image = image;

  return result;
};

const updateRestaurant = async ({ restaurantId, user, data }) => {
  if (user.role && user.role.toLowerCase() === 'owner') {
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
  const session = await startSession();
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
