const winston = require("winston");
const expressWinston = require("express-winston");

// Custom formatter for console logs
const messageFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({ level, message, meta, timestamp }) =>
      `${timestamp} ${level}: ${meta?.error?.stack || message}`
  )
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      format: messageFormat, // Use your custom format for console
    }),
  ],
  format: winston.format.simple(), // This is used for file logs
});

const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: "request.log" })],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: "error.log" })],
  format: winston.format.json(),
});

module.exports = {
  logger,
  requestLogger,
  errorLogger,
};
