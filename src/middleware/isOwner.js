const User = require('../model/user');
const { InternalServerError, Forbidden } = require('./errorHandler');

async function isOwner(req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      throw new InternalServerError();
    }
    if (
      !user.role.toLowerCase() === 'owner' &&
      !user.role.toLowerCase() === 'admin'
    ) {
      throw new Forbidden('You are not authorized to perform this action');
    }
    next();
  } catch (error) {
    next(error, req, res, next);
  }
}

module.exports = isOwner;
