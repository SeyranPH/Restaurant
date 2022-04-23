const router = require('express').Router();
const UserService = require('../service/UserService');
const UserRequestValidator = require('../service/RequestValidation/UserRequestValidator');
const isVerified = require('../middleware/authorization');
const isAdmin = require('../middleware/isAdmin');

router.post('/', [isVerified, isAdmin], createUser);
router.post('/signup', signup);
router.post('/login', login);
router.get('/email-confirmation/:token', emailConfirmation);
router.post('/email-confirmation', isVerified, resendConfirmationEmail);
router.put('/:id', isVerified, updateUser);
router.get('/:id', isVerified, getUser);
router.delete('/:id', [isVerified], deleteAccount);

async function createUser(req, res, next) {
  try {
    UserRequestValidator.validateCreateUser(req.body);
    const data = req.body;
    const user = await UserService.createUser(data);
    return res.status(201).send({ user });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function signup(req, res, next) {
  try {
    UserRequestValidator.validateSignup(req.body);
    const data = req.body;
    const user = await UserService.signup(data);
    return res.status(201).send(user);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function emailConfirmation(req, res, next) {
  try {
    const token = req.params.token;
    await UserService.emailConfirmation(token);
    return res.sendStatus(200);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function resendConfirmationEmail(req, res, next) {
  try {
    const { user } = req;
    await UserService.resendConfirmationEmail(user);
    return res.sendStatus(200);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function login(req, res, next) {
  try {
    const data = req.body;
    const token = await UserService.login(data);
    return res.status(200).send({ token });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function updateUser(req, res, next) {
  try {
    UserRequestValidator.validateUpdateUser(req.body);
    const data = req.body;
    const { role } = req.user;
    const userId = role.toLowerCase() === 'admin' ? data._id : req.user._id;
    const user = await UserService.updateUser(data, userId);
    return res.status(200).send({ user });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getUser(req, res, next) {
  try {
    const userId = req.params.id;
    if (
      req.user.role !== 'admin' &&
      userId.toString() !== req.user._id.toString()
    ) {
      throw new Error('Should be same user');
    }
    const user = await UserService.getUser(userId);
    const sendBackUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return res.status(200).send({ user: sendBackUser });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function deleteAccount(req, res, next) {
  try {
    await UserService.deleteAccount(req.params.id.toString());
    return res.sendStatus(200);
  } catch (error) {
    next(error, req, res, next);
  }
}

module.exports = router;
