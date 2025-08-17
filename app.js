const express = require("express");
const cors = require("cors");
const morgan = require("morgan"); // Logging library (optional)
const connectToDatabase = require("./db"); // Import the database connection function
const clothingItemRoutes = require("./routes/clothingItem");
const auth = require("./middlewares/auth");
const routes = require("./routes"); // Import centralized routes
const { NOT_FOUND } = require("./utils/errors");
const { login, createUser } = require("./controllers/users"); // Import controllers
require("dotenv").config();

const { PORT = 9000 } = process.env;
const app = express();
const Item = require("./models/Items"); // Adjust the path if necessary

// Connect to MongoDB
connectToDatabase(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(morgan("dev")); // Add request logging (optional)

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

// Centralized routes
app.use("/", routes);

app.use("/clothing-items", clothingItemRoutes);

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

app.get("/user-data", (req, res) => {
  res.json({ id: 1, name: "John Doe" });
});

app.get("/", (req, res) => {
  res.send({ message: "Welcome to the API!" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

app.put("/items/:id/likes", auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the item by ID and update its likes array
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } }, // Add the user's ID to the likes array if it doesn't already exist
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return res.status(404).send({ message: "Item not found" });
    }

    return res.status(200).send(updatedItem);
  } catch (err) {
    console.error("Error adding like:", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

app.delete("/items/:id/likes", auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Find the item by ID and update its likes array
    const updatedItem = await Item.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } }, // Remove the user's ID from the likes array
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return res.status(404).send({ message: "Item not found" });
    }

    return res.status(200).send(updatedItem);
  } catch (err) {
    console.error("Error removing like:", err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/clothing-items", async (req, res) => {
  try {
    const clothingItems = await Item.find(); // Fetch all items from the database
    res.status(200).send(clothingItems);
  } catch (err) {
    console.error("Error fetching clothing items:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).send(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.get("/test", (req, res) => {
  res.send({ message: "Server is running" });
});

module.exports = app;
