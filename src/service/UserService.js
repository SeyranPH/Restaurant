const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Restaurant = require('../model/restaurant');
const Review = require('../model/Review');
const {
  NotFound,
  Unauthorized,
  Forbidden,
  InternalServerError,
} = require('../middleware/errorHandler');
const MailService = require('./MailingService');
const { jwtSecret } = require('../../config');
const { startSession } = require('mongoose');

async function createUser(data) {
  Object.assign(data, {
    emailConfirmed: true,
  });
  const user = await User.create(data);
  return user;
}

async function sendEmailConfirmation(user) {
  const newToken = jwt.sign({ id: user._id, type: 'email_confirmation' }, jwtSecret, {
    expiresIn: '3d',
  });
  await MailService.sendEmailConfirmation({ to: user.email, token: newToken });
  await User.findOneAndUpdate(
    { _id: user._id },
    { emailConfirmationToken: newToken, emailConfirmed: false }
  );
  return;
}

async function signup(data) {
  data.emailConfirmed = false;
  const user = await User.create(data);
  await sendEmailConfirmation(user);
  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '3h' });
  return {
    token,
    name: user.name,
    email: user.email,
    role: user.role,
    _id: user._id,
  };
}

async function emailConfirmation(token) {
  const decodedToken = jwt.verify(token, jwtSecret);
  const { id, type } = decodedToken;
  if (type !== 'email_confirmation') throw new Forbidden('invalid token');
  const user = await User.findOneAndUpdate(
    { _id: id, emailConfirmationToken: token },
    { emailConfirmed: true, emailConfirmationToken: null }
  );
  if (!user) throw new NotFound('user not found');
  return;
}

async function resendConfirmationEmail(user) {
  const { emailConfirmed } = user;
  if (emailConfirmed) {
    throw new Forbidden('email already confirmed');
  }
  const { emailConfirmationToken } = user;
  const { exp, iat } = jwt.verify(String(emailConfirmationToken), jwtSecret);
  const threeDays = 3 * 24 * 60 * 60;
  if (exp - iat < threeDays) {
    await MailService.sendEmailConfirmation({
      to: user.email,
      token: emailConfirmationToken,
    });
    return;
  }
  await sendEmailConfirmation(user);
  return;
}

async function login(data) {
  const user = await User.findOne(data);
  if (!user) throw new Unauthorized('wrong email or password');
  const { id } = user;
  const token = jwt.sign({ id }, jwtSecret, { expiresIn: '3h' });
  return {
    name: user.name,
    email: user.email,
    _id: user._id,
    role: user.role,
    token,
  };
}

async function updateUser(data, userId) {
  if (data._id) {
    delete data._id;
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFound('user not found');
  }

  if (data.email) {
    await sendEmailConfirmation({ ...user, email: data.email });
  }
  await User.findByIdAndUpdate(userId, data);
  return user;
}

async function deleteAccount(userId) {
  console.log('Starting acoount removal');
  const user = await User.findById(userId);
  if (!user) throw new NotFound('user not found');

  const session = await startSession();
  try {
    session.startTransaction();
    console.log('Starting removal of associated restaurants');
    const restaurants = await Restaurant.find({ owner: userId }, null, {
      session,
    });
    if (restaurants.length > 0) {
      await Restaurant.deleteMany({ owner: userId }, { session });
    }
    console.log('Starting removal of associated reviews');
    const reviews = await Review.find({ reviewer: userId }, null, { session });
    if (reviews.length > 0) {
      await Review.deleteMany({ reviewer: userId }, { session });
    }
    console.log('Removing account');
    await User.findByIdAndDelete(userId, { session });
    await session.commitTransaction();
    session.endSession();
    console.log('Succesfully removed the account');
    return;
  } catch (err) {
    console.log('Transaction failed, reverting changes');
    await session.abortTransaction();
    session.endSession();
    console.log(err.message);
    throw new InternalServerError('Session failed');
  }
}

module.exports = {
  createUser,
  signup,
  login,
  emailConfirmation,
  resendConfirmationEmail,
  updateUser,
  deleteAccount,
};
