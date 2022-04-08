const Joi = require('joi');
const { BadRequest } = require('../../middleware/errorHandler');

function validateCreateRestaurant(input) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string()
  });
  const result = schema.validate(input)
  if (result.error){
    throw new BadRequest(result.error);
  }
  return;
}

function validateGetRestaurants(input) {
  const schema = Joi.object({
    limit: Joi.number(),
    skip: Joi.number()
  });
  const result = schema.validate(input)
  if (result.error){
    throw new BadRequest(result.error);
  }
}

function validateUpdateRestaurant(input) {
  const schema = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    location: Joi.string(),
    image: Joi.string()
  });
  const result = schema.validate(input)
  if (result.error){
    throw new BadRequest(result.error);
  }
}

module.exports = {
  validateCreateRestaurant,
  validateGetRestaurants,
  validateUpdateRestaurant
};
