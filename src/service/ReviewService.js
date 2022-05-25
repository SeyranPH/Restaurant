const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Restaurant = require('../model/restaurant');
const Review = require('../model/review');
const {
  NotFound,
  Unauthorized,
  Forbidden,
} = require('../middleware/errorHandler');

async function updateRestaurantScore(restaurantId) {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    throw new NotFound('Restaurant not found');
  }
  const reviews = await Review.find({ restaurant: restaurantId });
  let score = 0;
  let count = 0;
  reviews.forEach((review) => {
    score += review.score;
    count++;
  });
  if (count > 0) {
    score = score / count;
  }
  await Restaurant.findByIdAndUpdate(restaurantId, { score });
  return score;
}

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
  await Restaurant.findByIdAndUpdate(data.restaurant, {
    $push: { reviews: review._id },
  });
  await updateRestaurantScore(data.restaurant);
  return { id: review._id, comment: review.comment, score: review.score };
}

async function updateReview(reviewId, data) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFound('Review not found');
  }
  const updatedReview = await Review.findByIdAndUpdate(reviewId, data, {
    new: true,
  });
  if (data.score) {
    await updateRestaurantScore(review.restaurant);
  }
  return updatedReview;
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
  await updateRestaurantScore(review.restaurant);
  return;
}

async function createReply(reviewId, userId, { comment }) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFound('Review not found');
  }

  const restaurant = await Restaurant.findById(review.restaurant);
  if (restaurant.owner.toString() !== userId.toString()) {
    throw new Forbidden('Only restaurant owner can reply to its reviews');
  }

  const result = await Review.findByIdAndUpdate(
    { _id: reviewId },
    {
      reply: { comment, createdAt: new Date(), updatedAt: new Date() },
    },
    { new: true }
  );
  return result;
}

async function updateReply(reviewId, userId, { comment }) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFound('Review not found');
  }

  if (review.reviewer.toString() !== userId.toString()) {
    throw new Forbidden('You are not allowed to update this review');
  }

  const result = await Review.findByIdAndUpdate(
    { _id: reviewId },
    { reply: { comment, updatedAt: new Date() } },
    { new: true }
  );
  return result;
}

async function deleteReply(reviewId, userId) {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new NotFound('Review not found');
  }

  await Review.findByIdAndUpdate(reviewId, { reply: null });
  return;
}

async function getUnrepliedReviews(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFound('User not found');
  }
  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: 'restaurants',
        localField: 'restaurant',
        foreignField: '_id',
        as: 'restaurant',
      },
    },
    {
      $match: {
        'restaurant.owner': userId,
        'reply': { $exists: false },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'reviewer',
        foreignField: '_id',
        as: 'reviewerObject',
      },
    },
    {
      $addFields: {
        restaurantId: {
          $arrayElemAt: ['$restaurant._id', 0],
        },
        restaurantName: {
          $arrayElemAt: ['$restaurant.name', 0],
        },
        reviewerName: {
          $arrayElemAt: ['$reviewerObject.name', 0],
        }
      },
    },
    {
      $project: {
        _id: 1,
        comment: 1,
        score: 1,
        reviewer: 1,
        restaurantId: 1,
        restaurantName: 1,
        reviewerName: 1
      },
    },
  ]);
  return reviews;
}

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  createReply,
  updateReply,
  deleteReply,
  getUnrepliedReviews,
};
