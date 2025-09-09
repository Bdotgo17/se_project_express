require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // Logging library (optional)
const { errors } = require("celebrate");

const connectToDatabase = require("./db"); // Import the database connection function
const clothingItemRoutes = require("./routes/clothingItem");
const auth = require("./middlewares/auth");
const routes = require("./routes"); // Import centralized routes
const { NOT_FOUND } = require("./utils/errors");
const { login, createUser } = require("./controllers/users"); // Import controllers

const { PORT = 9000 } = process.env;
const app = express();
const errorHandler = require("./middlewares/error-handler");
const { logger, requestLogger, errorLogger } = require("./middlewares/logger");

connectToDatabase(process.env.MONGODB_URI)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("Failed to connect to MongoDB:", err));

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(morgan("dev")); // Add request logging (optional)

app.use(requestLogger);

// remove after passing review
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Add routes for signing in and signing up
app.post("/signin", login);
app.post("/signup", createUser);
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
app.use("/clothing-items", clothingItemRoutes);
app.use("/items", clothingItemRoutes);

app.use(errorLogger);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

app.use(errors()); // Celebrate error handler

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    logger.info(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
