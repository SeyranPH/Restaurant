const Joi = require('joi');
const { BadRequest } = require('../../middleware/errorHandler');

function validateEmailConfirmation(params) {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  if (!schema.validate(params)) {
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
  if (!schema.validate(input)) {
    throw new BadRequest(result.error);
  }
  return;
}

function validateSignup(input) {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),

    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    role: Joi.string().valid('owner', 'regular', 'admin').required(),
  });
  if (!schema.validate(input)) {
    throw new BadRequest(result.error);
  }
  return;
}

module.exports = {
  validateEmailConfirmation,
  validateLogin,
  validateSignup,
};
