const User = require("../model/user");
const config = require('../../config');
const jwt = require('jsonwebtoken');
const {Unauthorized}= require("./errorHandler")

const { jwtSecret } = config;

async function verify(req, res, next) {
    try {
        const bearer = req.headers.authorization
        if (!bearer) {
            throw new Unauthorized('Bearer token is not provided');
        }
        const token = bearer.split(' ')[1];

        const isVerified = jwt.verify(token, jwtSecret)

        if (!isVerified) {
            throw new Unauthorized('Bearer token is not valid');
        }
        const {id} = isVerified;
        const user = await User.findOne({ _id: id });
        req.user = user;
        next();
    }
    catch (error) {
         next(error, req, res, next);
    }
}
//stugel 
module.exports = verify