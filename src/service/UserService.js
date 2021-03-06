const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const Restaurant = require('../model/restaurant');
const Review = require('../model/review');
const {
  NotFound,
  Unauthorized,
  Forbidden,
  InternalServerError,
  BadRequest,
} = require('../middleware/errorHandler');
const MailService = require('./MailingService');
const { jwtSecret } = require('../../config');
const { startSession } = require('mongoose');

// A helper function to send confirmation email
async function sendEmailConfirmation(user) {
  const newToken = jwt.sign(
    { id: user._id, type: 'email_confirmation' },
    jwtSecret,
    {
      expiresIn: '3d',
    }
  );
  await MailService.sendEmailConfirmation({ to: user.email, token: newToken });
  await User.findOneAndUpdate(
    { _id: user._id },
    { emailConfirmationToken: newToken, emailConfirmed: false }
  );
  return;
}

async function createUser(data) {
  Object.assign(data, {
    emailConfirmed: true,
  });
  const user = await User.create(data);
  return user;
}

async function signup(data) {
  data.emailConfirmed = false;
  const passwordHash = await bcrypt.hash(data.password, 5);
  data.password = passwordHash;

  const user = await User.create(data);
  await sendEmailConfirmation(user);
  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '3h' });
  return {
    token,
    name: user.name,
    email: user.email,
    role: user.role,
    emailConfirmed: user.emailConfirmed,
    _id: user._id,
  };
}

async function emailConfirmation(token) {
  const decodedToken = jwt.verify(token, jwtSecret);
  const { id, type } = decodedToken;
  if (type !== 'email_confirmation') throw new Forbidden('invalid token');

  const user = await User.findOne({
    _id: id,
    emailConfirmationToken: token,
  });

  if (!user) {
    throw new NotFound('user not found');
  }

  await User.findOneAndUpdate(
    { _id: id, emailConfirmationToken: token },
    { emailConfirmed: true, emailConfirmationToken: null }
  );
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

async function login(email, password) {
  console.log(email);
  const user = await User.findOne({email});
  if (!user) throw new Unauthorized('wrong email or password');
  const isPassowordVerified = await bcrypt.compare(password, user.password);
  if (!isPassowordVerified) {
    throw new Unauthorized('wrong email or password');
  }
  const { id } = user;
  const token = jwt.sign({ id }, jwtSecret, { expiresIn: '3h' });
  return {
    name: user.name,
    email: user.email,
    _id: user._id,
    role: user.role,
    emailConfirmed: user.emailConfirmed,
    token,
  };
}

async function getUser(userId, isAdmin) {
  if (!userId) {
    throw new BadRequest('userId is required');
  }
  if (isAdmin) {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFound('user not found');
    }
    return user;
  }
  const user = await User.findById(userId).select([
    '_id',
    'name',
    'email',
    'role',
  ]);
  if (!user) {
    throw new NotFound('User not found');
  }
  return user;
}

async function getUsers({ limit, skip }) {
  const users = await User.find({}, null, {
    limit,
    skip,
  });
  return users;
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
  return;
}

async function deleteAccount(userId) {
  if (!userId) {
    throw new BadRequest('user id is required');
  }

  const user = await User.findById(userId);
  if (!user) throw new NotFound('user not found');

  const session = await startSession();
  try {
    session.startTransaction();
    const restaurants = await Restaurant.find({ owner: userId }, null, {
      session,
    });
    if (restaurants.length > 0) {
      await Restaurant.deleteMany({ owner: userId }, { session });
    }
    const reviews = await Review.find({ reviewer: userId }, null, { session });
    if (reviews.length > 0) {
      await Review.deleteMany({ reviewer: userId }, { session });
    }
    await User.findByIdAndDelete(userId, { session });
    await session.commitTransaction();
    session.endSession();
    console.log('Succesfully removed the account');
    return;
  } catch (err) {
    console.log('Removal failed, reverting changes');
    await session.abortTransaction();
    session.endSession();
    console.log(err.message);
    throw new InternalServerError('Remove user session failed');
  }
}

module.exports = {
  createUser,
  signup,
  login,
  emailConfirmation,
  resendConfirmationEmail,
  getUser,
  getUsers,
  updateUser,
  deleteAccount,
};
