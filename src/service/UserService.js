const User = require('../models/user');
const { NotFound, Unauthorized, Forbidden } = require('../errorHandler/httpError');
const { sendEmailConfirmation } = require('./MailingService');
const config = require('../config');

const jwt = require('jsonwebtoken')

const { jwtSecret } = config;




async function signup(data) {
    data.emailConfirmed = false;
    const user = await User.create(data);

    const token = jwt.sign({ id: user._id },
        jwtSecret, { expiresIn: '3d' });
    await User.findOneAndUpdate({ _id: user._id }, { emailConfirmationToken: token })
    await sendEmailConfirmation(user.email, token);
    console.log(token)
    return user;
}

async function email_confirmation(token, { _id, emailConfirmationToken }) {
    const decodedToken = jwt.verify(token, jwtSecret);
    const { id } = decodedToken;
    const result = (id === _id) && (token === emailConfirmationToken);
    if (result) {
        await User.updateOne({ _id }, { emailConfirmed: true, emailConfirmationToken: '' });
        return;
    }
    throw new Unauthorized('Invalid token');
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
    email_confirmation
}

async function userSignup(data) {

}