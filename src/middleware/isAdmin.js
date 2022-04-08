const User = require("../model/user");
const {InternalServerError, Forbidden}= require("./errorHandler")

const { jwtSecret } = config;

async function isAdmin(req, res, next) {
    try {
        
        const user = req.user;
        if (!user) {
            throw new InternalServerError();
        }
        if (!user.role.toLowerCase() === 'admin') {
            throw new Forbidden('You are not authorized to perform this action');
        }
        next();
    }
    catch (error) {
         next(error, req, res, next);
    }
}

module.exports = isAdmin

