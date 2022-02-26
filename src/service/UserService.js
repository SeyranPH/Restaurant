const User = require('../model/user');
const { NotFound, Unauthorized, Forbidden } = require('../middleware/errorHandler');
const { sendEmailConfirmation } = require('./MailingService');
const config = require('../../config');

const jwt = require('jsonwebtoken')

const { jwtSecret } = config;




async function signup(data) {
    data.emailConfirmed = false;
    const user = await User.create(data);

    const token = jwt.sign({ id: user._id, type: 'email_confirmation' },
        jwtSecret, { expiresIn: '3d' });
    await User.findOneAndUpdate({ _id: user._id }, { emailConfirmationToken: token })
    await sendEmailConfirmation(user.email, token);
    console.log(token)
    return user;
}

async function emailConfirmation(token) {
    const decodedToken = jwt.verify(token, jwtSecret);
    const { id, type } = decodedToken;
    if (type !== 'email_confirmation') throw new Forbidden("invalid token");
    const user = await User.findOneAndUpdate({ _id: id, emailConfirmationToken: token }, { emailConfirmed: true, emailConfirmationToken: null });
    if (!user) throw new NotFound("user not found");
    return;
}

async function login(data) {
    const user = await User.findOne(data);
    if (!user) throw new Unauthorized("wrong email or password");
    if (!user.emailConfirmed === false) throw new Forbidden("please confirm your email");
    const { id } = user;
    const token = jwt.sign({ id }, jwtSecret, { expiresIn: '3h' });
    return token;
}

module.exports = {
    signup,
    login,
    emailConfirmation
}

async function userSignup(data) {

}