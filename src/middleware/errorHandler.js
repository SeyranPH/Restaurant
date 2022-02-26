class HttpError extends Error{
    constructor(message, status){
     super(message)   
     this.status = status;
    }
};

class BadRequest extends HttpError{
    constructor(message) {
        super(message, 400)
    }
};

class NotFound extends HttpError{
    constructor(message) {
        super(message, 404)
    }
};

class Forbidden extends HttpError{
    constructor(message) {
        super(message, 403)
    }
};

class Unauthorized extends HttpError{
    constructor(message) {
        super(message, 401)
    }
};

class MethodNotAllowed extends HttpError{
    constructor(message) {
        super(message, 405)
    }
};

class InternalServerError extends HttpError{
    constructor(message) {
        super(message, 500)
    }
};

module.exports = {
    HttpError,
    BadRequest,
    NotFound,
    Forbidden,
    Unauthorized,
    MethodNotAllowed,
    InternalServerError
};