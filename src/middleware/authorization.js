const User = require("../model/user");
const config = require('../../config');
const jwt = require('jsonwebtoken');
const {Unauthorized}= require("./errorHandler")

const { jwtSecret } = config;

async function isVerified(req, res, next) {
    try {
        const bearer = req.headers.authorization
        if (!bearer) {
            throw new Unauthorized('Bearer token is not provided');
        }
        const token = bearer.split(' ')[1];

        const verifiedUser = jwt.verify(token, jwtSecret)

        if (!verifiedUser) {
            throw new Unauthorized('Bearer token is not valid');
        }
        const {id} = verifiedUser;
        const user = await User.findOne({ _id: id });
        req.user = user;
        next();
    }
    catch (error) {
         next(error, req, res, next);
    }
}
//stugel 
module.exports = isVerified