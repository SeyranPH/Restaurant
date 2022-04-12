const jwt = require('jsonwebtoken');

const User = require('../model/user');
const Restaurant = require('../model/restaurant');
const Review = require('../model/Review');
const { NotFound, Unauthorized, Forbidden, InternalServerError } = require('../middleware/errorHandler');
const { sendEmailConfirmation } = require('./MailingService');
const { jwtSecret } = require('../../config');
const { startSession } = require('mongoose')

async function signup(data) {
  data.emailConfirmed = false;
  const user = await User.create(data);
  const id = user._id;
  const token = jwt.sign(
    { id, type: 'email_confirmation' },
    jwtSecret,
    { expiresIn: '3d' }
  );

  await User.findOneAndUpdate(
    { _id: user._id },
    { emailConfirmationToken: token }
  );
  await sendEmailConfirmation({ to: user.email, token });
  const accessToken = jwt.sign({ id }, jwtSecret, { expiresIn: '3h' });
  return {accessToken}
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

async function login(data) {
  const user = await User.findOne(data);
  if (!user) throw new Unauthorized('wrong email or password');

  const { id } = user;
  const token = jwt.sign({ id }, jwtSecret, { expiresIn: '3h' });
  return token;
}

async function deleteAccount(userId){
  console.log('Starting acoount removal')
  const user = await User.findById(userId);
  if (!user) throw new NotFound('user not found');
  
  const session = await startSession()
  try {
    session.startTransaction();
    console.log('Starting removal of associated restaurants');
    const restaurants = await Restaurant.find({ owner: userId }, null, {session});
    if (restaurants.length > 0) {
      await Restaurant.deleteMany({ owner: userId }, {session});
    }
    console.log('Starting removal of associated reviews');
    const reviews = await Review.find({ reviewer: userId }, null, {session});
    if (reviews.length > 0) {
      await Review.deleteMany({ reviewer: userId }, {session});
    }
    console.log('Removing account');
    await User.findByIdAndDelete(userId, {session});
    await session.commitTransaction();
    session.endSession();
    console.log('Succesfully removed the account');
    return;
} catch (err) {
  console.log('Transaction failed, reverting changes');
  await session.abortTransaction();
  session.endSession();
  console.log(err.message)
  throw new InternalServerError('Session failed');
}
}

module.exports = {
  signup,
  login,
  emailConfirmation,
  deleteAccount
};

