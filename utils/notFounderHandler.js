// middleware/notFoundHandler.js
function notFoundHandler(req, res, next) {
  const error = new Error('Not Found');
  error.statusCode = 404;
  next(error); // Passa o erro para o próximo middleware (seu errorHandler)
}

module.exports = notFoundHandler;