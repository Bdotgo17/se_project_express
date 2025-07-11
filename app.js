const express = require("express");
const mongoose = require("mongoose");
const clothingItemRoutes = require("./routes/clothingItem"); // Import clothing item routes

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the application if the database connection fails
  });

app.use(express.json());

// Temporary authorization middleware
app.use((req, res, next) => {
  req.user = {
    _id: "686da17fea375d6b292decb8", // Replace with the _id of the test user you created
  };
  next();
});

// Connect clothing item routes
app.use("/", clothingItemRoutes);

app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
