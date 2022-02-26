class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class BadRequest extends HttpError {
  constructor(message) {
    super(message, 400);
  }
}

class NotFound extends HttpError {
  constructor(message) {
    super(message, 404);
  }
}

class Forbidden extends HttpError {
  constructor(message) {
    super(message, 403);
  }
}

class Unauthorized extends HttpError {
  constructor(message) {
    super(message, 401);
  }
}

class MethodNotAllowed extends HttpError {
  constructor(message) {
    super(message, 405);
  }
}

class InternalServerError extends HttpError {
  constructor(message) {
    super(message, 500);
  }
}

function ErrorHandler(error, req, res, next) {
  console.log(error.message);
  if (error && error instanceof HttpError) {
    return res.status(error.status).send(error.message);
  }
  return res.status(500).send({ msg: 'internal error' });
}

module.exports = {
  ErrorHandler,
  HttpError,
  BadRequest,
  NotFound,
  Forbidden,
  Unauthorized,
  MethodNotAllowed,
  InternalServerError,
};
