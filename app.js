const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes"); // Import centralized routes
const clothingItemRoutes = require("./routes/clothingItem"); // Import clothing item routes
const userRoutes = require("./routes/users"); // Import the users routes
const { NOT_FOUND } = require("./utils/errors");
const auth = require("./middlewares/auth");
const { login, createUser } = require("./controllers/users"); // Import controllers

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the application if the database connection fails
  });

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Example protected route
app.get("/protected-route", auth, (req, res) => {
  res.send({ message: "Access granted", userId: req.user._id });
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
