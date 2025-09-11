require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // Logging library (optional)
const { errors } = require("celebrate");
const helmet = require("helmet");

const connectToDatabase = require("./db"); // Import the database connection function
const auth = require("./middlewares/auth");
const routes = require("./routes"); // Import centralized routes
const { NotFoundError } = require("./utils/errors"); // Make sure this is imported
const { login, createUser } = require("./controllers/users"); // Import controllers

const { PORT = 9100 } = process.env;
const app = express();

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl} body:`, req.body);
  next();
});

const errorHandler = require("./middlewares/error-handler");
const { logger, requestLogger, errorLogger } = require("./middlewares/logger");
const {
  loginValidation,
  userCreationValidation,
} = require("./middlewares/validation");

const apiLimiter = require("./middlewares/rateLimiter");

connectToDatabase(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("Failed to connect to MongoDB:", err));

app.use(helmet()); // Add Helmet middleware for security headers

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(morgan("dev")); // Add request logging (optional)

app.use(requestLogger);

app.use(apiLimiter); // <--- Add this line here

// remove after passing review
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Add routes for signing in and signing up
app.post("/signin", loginValidation, login); // <-- Add loginValidation here
app.post("/signup", userCreationValidation, createUser);
// Add a protected route to demonstrate authentication
app.get("/protected-route", auth, (req, res) => {
  if (!req.user || !req.user._id || !req.user.name || !req.user.role) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.send({
    message: "Access granted",
    userId: req.user._id,
    name: req.user.name, // Include name
    role: req.user.role, // Include role
  });
});
// Add a health check endpoint
app.get("/health", (req, res) => {
  res.send({ status: "OK" });
});
app.get("/user-data", (req, res) => {
  res.json({ id: 1, name: "John Doe" });
});
app.get("/", (req, res) => {
  res.send({ message: "Welcome to the API!" });
});
app.get("/test", (req, res) => {
  res.send({ message: "Server is running" });
});

// Centralized routes
app.use("/", routes);

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

app.use(errors()); // Celebrate error handler

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
