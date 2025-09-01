function errorHandler(err, req, res, next) {
  console.error(err.stack || err); // Log the error stack or error itself
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).send({ message });
}

module.exports = errorHandler;