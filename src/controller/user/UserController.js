const router = require('express').Router();
const UserService = require('../../service/UserService');
const UserRequestValidator = require('../../service/RequestValidation/UserRequestValidator');

router.post('/signup', signup);
router.post('/login', login);
router.get('/email-confirmation/:token', emailConfirmation)

async function signup(req, res, next) {
    try {
        UserRequestValidator.validateSignup(req.body);
        const data = req.body;
        const user = await UserService.signup(data);
    }
    catch (error) {
        next(error, req, res, next);
    }
}

async function emailConfirmation(req, res, next) {
    try {
        const token = req.params.token;
        await UserService.emailConfirmation(token);
    }
    catch (error) {
        next(error, req, res, next);
    }
}

async function login(req, res, next) {
    try {
        const data = req.body;
        const token = await UserService.login(data);
    } catch (error) {
        next(error, req, res, next);
    }
}



module.exports = router;



