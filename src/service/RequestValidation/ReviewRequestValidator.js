const Joi = require('joi');
const { BadRequest } = require('../../middleware/errorHandler');

function validateCreateReview(input) {
  const schema = Joi.object({
    comment: Joi.string().disallow(''),
    score: Joi.number().min(0).max(5).required().integer(),
    restaurant: Joi.string().required().length(24),
  });
  const result = schema.validate(input);
  if (result.error) {
    throw new BadRequest(result.error);
  }
  return;
}

function validateUpdateReview(input) {
  const schema = Joi.object({
    comment: Joi.string().disallow(''),
    score: Joi.number().min(0).max(5).integer(),
  });
  const result = schema.validate(input);
  if (result.error) {
    throw new BadRequest(result.error);
  }
}

function validateCreateReply(input) {
  const schema = Joi.object({
    comment: Joi.string().disallow('').required(),
  });
  const result = schema.validate(input);
  if (result.error) {
    throw new BadRequest(result.error);
  }
}

function validateUpdateReply(input) {
  const schema = Joi.object({
    comment: Joi.string().disallow('').required(),
  });
  const result = schema.validate(input);
  if (result.error) {
    throw new BadRequest(result.error);
  }
}

module.exports = {
  validateCreateReview,
  validateUpdateReview,
  validateCreateReply,
  validateUpdateReply
};
