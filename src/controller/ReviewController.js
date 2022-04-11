const router = require('express').Router();

const isVerified = require('../middleware/authorization');
const isOwner = require('../middleware/isOwner');
const ReviewRequestValidator = require('../service/RequestValidation/ReviewRequestValidator');
const ReviewService = require('../service/ReviewService');

router.post('/', [isVerified], createReview);
router.put('/:id', [isVerified, isOwner], updateReview);
router.delete('/:id', [isVerified, isOwner], deleteReview);

async function createReview(req, res, next) {
    try {
        ReviewRequestValidator.validateCreateReview(req.body);
        const userId = req.user._id;
        const data = req.body;
        const review = await ReviewService.createReview(data, userId);
        return res.status(201).send({review});
    } catch (error) {
      next(error, req, res, next);
    }
}

async function updateReview(req, res, next) {
    try {
        ReviewRequestValidator.validateUpdateReview(req.body);
        const result = await ReviewService.updateReview(req.params.id, req.body);
        return res.status(200).send({message: 'Review updated successfully', review: result});
    } catch (error) {
        next(error, req, res, next);
    }
}

async function deleteReview(req, res, next) {
    try {
        await ReviewService.deleteReview(req.params.id, req.user._id);
        return res.status(200).send({message: 'Review deleted successfully'});
    } catch (error) {
        next(error, req, res, next);
    }
}

module.exports = router;