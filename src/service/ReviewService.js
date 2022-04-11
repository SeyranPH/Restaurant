const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Restaurant = require('../model/restaurant');
const Review = require('../model/Review');
const {
  NotFound,
  Unauthorized,
  Forbidden,
} = require('../middleware/errorHandler');

async function createReview(data, userId) {
  const user = await User.findById(userId);
  if (!user.emailConfirmed) {
    throw new Unauthorized('Please confirm your email first');
  }
  const restaurant = await Restaurant.findOne({ _id: data.restaurant });
  if (!restaurant) {
    throw new NotFound('Restaurant not found');
  }
  if (restaurant.owner.toString() === userId.toString()) {
    throw new Forbidden('You are not allowed to review your own restaurant');
  }
  const reviewExists = await Review.findOne({
    restaurant: data.restaurant,
    reviewer: userId,
  });
  if (reviewExists) {
    throw new Forbidden('You have already reviewed this restaurant');
  }
  const reviewData = Object.assign(data, { reviewer: userId });
  const review = await Review.create(reviewData);
  return {id: review._id, comment: review.comment, score: review.score};
}

async function updateReview(reviewId, data) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFound('Review not found');
  }
  const updateReview = await Review.findByIdAndUpdate(reviewId, data, {
    new: true,
  });
}

async function deleteReview(reviewId, userId) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFound('Review not found');
  }
  if (review.reviewer.toString() !== userId.toString()) {
    throw new Forbidden('You are not allowed to delete this review');
  }    
  await Review.findByIdAndDelete(reviewId);
  return;
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
};
