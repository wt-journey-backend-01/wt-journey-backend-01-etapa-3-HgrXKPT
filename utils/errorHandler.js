function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode;
  const message = err.message;

  res.status(statusCode).json({
    error: true,
    message: message
  });
}

module.exports = errorHandler;