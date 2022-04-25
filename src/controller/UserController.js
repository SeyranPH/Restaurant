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
router.get('/:id', isVerified, getUser);
router.get('/', [isVerified, isAdmin], getUsers);
router.put('/', isVerified, updateUser);
router.delete('/', isVerified, deleteAccount);

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
    return res.sendStatus(204);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function resendConfirmationEmail(req, res, next) {
  try {
    const { user } = req;
    await UserService.resendConfirmationEmail(user);
    return res.sendStatus(204);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function login(req, res, next) {
  try {
    const data = req.body;
    const user = await UserService.login(data);
    return res.status(200).send(user);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function updateUser(req, res, next) {
  try {
    UserRequestValidator.validateUpdateUser(req.body);
    const data = req.body;
    const { role } = req.user;
    const userId = req.user.role.toLowerCase() === 'admin' ? req.query.id : req.user._id;
    const user = await UserService.updateUser(data, userId);
    return res.sendStatus(204);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getUser(req, res, next) {
  try {
    const userId = req.params.id;
    const isAdmin = req.user.role.toLowerCase() === 'admin';
    const user = await UserService.getUser(userId, isAdmin);
    return res.status(200).send({ user });
  } catch (error) {
    next(error, req, res, next);
  }
}

async function getUsers(req, res, next) {
  try {
    const {limit, skip} = req.query;
    const users = await UserService.getUsers({limit, skip});
    return res.status(200).send(users);
  } catch (error) {
    next(error, req, res, next);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const userId = req.user.role.toLowerCase() === 'admin' ? req.query.id : req.user._id;
    await UserService.deleteAccount(userId);
    return res.sendStatus(204);
  } catch (error) {
    next(error, req, res, next);
  }
}

module.exports = router;
