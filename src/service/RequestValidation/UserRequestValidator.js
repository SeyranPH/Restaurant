const Joi = require('joi');
const { BadRequest } = require('../../middleware/errorHandler');

function validateEmailConfirmation(params) {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  const result = schema.validate(input)
  if (result.error){
    throw new BadRequest(result.error);
  }
  return;
}

function validateLogin(input) {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
  });
  const result = schema.validate(input)
  if (result.error){
    throw new BadRequest(result.error);
  }
  return;
}

function validateSignup(input) {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
    name: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    role: Joi.string().valid('owner', 'regular').required(),
  });
  const result = schema.validate(input)
  if (result.error){
    throw new BadRequest(result.error);
  }
  return;
}

module.exports = {
  validateEmailConfirmation,
  validateLogin,
  validateSignup,
};
