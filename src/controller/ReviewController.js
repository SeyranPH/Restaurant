const router = require('express').Router();

const isVerified = require('../middleware/authorization');
const isOwner = require('../middleware/isOwner');
const ReviewRequestValidator = require('../service/RequestValidation/ReviewRequestValidator');
const ReviewService = require('../service/ReviewService');

router.post('/', [isVerified], createReview);
router.put('/:id', [isVerified], updateReview);
router.delete('/:id', [isVerified], deleteReview);
router.post('/:id/reply', [isVerified, isOwner], createReply);
router.put('/:id/reply', [isVerified, isOwner], updateReply);
router.delete('/:id/reply/:id', [isVerified, isOwner], deleteReply);
router.get('/unreplied', [isVerified, isOwner], getUnrepliedReviews);

async function createReview(req, res, next) {
  try {
    ReviewRequestValidator.validateCreateReview(req.body);
    const userId = req.user._id;
    const data = req.body;
    const review = await ReviewService.createReview(data, userId);
    return res.status(201).send({ review });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function updateReview(req, res, next) {
  try {
    ReviewRequestValidator.validateUpdateReview(req.body);
    const result = await ReviewService.updateReview(req.params.id, req.body);
    return res
      .status(200)
      .send({ message: 'Review updated successfully', review: result });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function deleteReview(req, res, next) {
  try {
    await ReviewService.deleteReview(req.params.id, req.user._id);
    return res.status(200).send({ message: 'Review deleted successfully' });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function createReply(req, res, next) {
  try {
    ReviewRequestValidator.validateCreateReply(req.body);
    const userId = req.user._id;
    const reviewId = req.params.id;
    const result = await ReviewService.createReply(reviewId, userId, req.body);
    return res
      .status(201)
      .send({ message: 'Review reply created successfully', review: result });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function updateReply(req, res, next) {
  try {
    ReviewRequestValidator.validateUpdateReply(req.body);
    const userId = req.user._id;
    const reviewId = req.params.id;
    const result = await ReviewService.updateReply(reviewId, userId, req.body);
    return res
      .status(200)
      .send({ message: 'Review reply updated successfully', review: result });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function deleteReply(req, res, next) {
  try {
    const userId = req.user._id;
    const reviewId = req.params.id;
    await ReviewService.deleteReply(reviewId, userId);
    return res
      .status(200)
      .send({ message: 'Review reply deleted successfully' });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getUnrepliedReviews(req, res, next) {
  try {
    const userId = req.user._id;
    const reviews = await ReviewService.getUnrepliedReviews(userId);
    res.status(200).send({
      reviews,
      message: 'Unreplied reviews retrieved successfully',
    })

  } catch (error) {
    next(error, req, res, next);
  }
}

module.exports = router;
