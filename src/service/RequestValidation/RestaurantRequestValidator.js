const Joi = require('joi');
const { BadRequest } = require('../../middleware/errorHandler');

function validateCreateRestaurant(params) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    creatorUid: Joi.string().required(),
  });
  if (!schema.validate(params)) {
    throw new BadRequest(result.error);
  }
  return;
}

function validateUpdateRestaurantData(params) {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    location: Joi.string(),
    creatorUid: Joi.string(),
  });
  if (!schema.validate(params)) {
    throw new BadRequest(result.error);
  }
  return;
}

function validateGetRestaurantDataFilteredByOwner(params) {
  const schema = Joi.object({
    userUid: Joi.string().required(),
  });
  if (!schema.validate(params)) {
    throw new BadRequest(result.error);
  }
  return;
}

module.exports = {
  validateCreateRestaurant,
  validateUpdateRestaurantData,
  validateGetRestaurantDataFilteredByOwner,
};
