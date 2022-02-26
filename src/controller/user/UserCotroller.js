const router = require('express').Router();
const UserService = require('../../services/UserService');
const { Forbidden, Unauthorized, NotFound } = require('../../errorHandler/httpError');
//const { email_confirmation: email_confirmationValidation, signup: signupValidation, login: loginValidation } = require('../../services/RequestValidation/UserRequestValidation');

router.post('/signup', signup);
router.post('/login', login);
router.get('/email-confirmation/:token', email_confirmation)

async function signup(req, res, next) {
    try {
        const data = req.body;
        const user = await UserService.signup(data);
    }
    catch (error) {
        next(error, req, res, next);
    }
}



async function login(req, res, next) {
    try {
        
    } catch (error) {
        next(error, req, res, next);
    }
}



module.exports = router;



// async function email_confirmation(req, res, next) {
//     try {
//         
//     }
//     catch (error) {
//         next(error, req, res, next);
//     }
// }