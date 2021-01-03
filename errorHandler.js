exports.checkStatusCode = (err, next) => {
  if (!err.statusCode)
    err.statusCode = 500;
  next(err);
};

exports.createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};