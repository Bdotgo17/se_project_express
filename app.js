const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // Logging library (optional)
const connectToDatabase = require("./db"); // Import the database connection function
const auth = require("./middlewares/auth");
const routes = require("./routes"); // Import centralized routes
const clothingItemRoutes = require("./routes/clothingItem"); // Import clothing item routes
const userRoutes = require("./routes/users"); // Import the users routes
const { NOT_FOUND } = require("./utils/errors");
const { login, createUser } = require("./controllers/users"); // Import controllers
require("dotenv").config();

const { PORT = 3001 } = process.env;
const app = express();

// Connect to MongoDB
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/wtwr_db";
connectToDatabase(uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the application if the database connection fails
  });

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(morgan("dev")); // Add request logging (optional)

// Example protected route
app.get("/protected-route", auth, (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.send({ message: "Access granted", userId: req.user._id });
});

// Add a health check endpoint
app.get("/health", (req, res) => {
  res.send({ status: "OK" });
});

// Add routes for signing in and signing up
app.post("/signin", login);
app.post("/signup", createUser);

// Connect the users routes
app.use(auth); // Apply the auth middleware to all routes below this line
app.use("/users", userRoutes);
app.use("/clothing-items", clothingItemRoutes);

// Centralized routes
app.use("/", routes);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Centralized error-handling middleware
app.use((err, req, res) => {
  console.error(err.stack); // Log the error stack trace
  res
    .status(err.status || 500)
    .send({ message: err.message || "Internal Server Error" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
