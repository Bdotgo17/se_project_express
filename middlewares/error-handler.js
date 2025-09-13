const { logger } = require("./logger");

function errorHandler(err, req, res, next) {
  logger.error(err.stack || err); // Log the error stack or error itself

  // Celebrate/Joi or Mongoose validation error
  if (err.joi || err.name === "ValidationError") {
    return res.status(400).send({ message: "Invalid data passed" });
  }

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).send({ message });
}

module.exports = errorHandler;