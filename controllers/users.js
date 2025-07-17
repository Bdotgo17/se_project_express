const mongoose = require("mongoose"); // Add this line

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
  CREATED,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config"); // Import the secret key
const ClothingItem = require("../models/clothingItem");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Email and password are required" });
    }

    // Find the user by email and validate the password
    const user = await User.findUserByCredentials(email, password);

    // Create a JWT token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    // Send the token in the response body
    return res.status(200).send({ token });
  } catch (err) {
    console.error("Error during login:", err);

    // Handle authentication errors
    if (err.name === "UnauthorizedError") {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid email or password" });
    }

    // Handle all other errors
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

// GET /users - returns all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(OK).send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

// GET /users/me - returns the current user
const getCurrentUser = async (req, res) => {
  try {
    // Access the user ID from the req.user object (set by the auth middleware)
    const userId = req.user._id;

    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    // Return the current user's data
    return res.status(OK).send(user);
  } catch (err) {
    console.error("Error fetching current user:", err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error occurred on the server" });
  }
};

const updateUser = async (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id; // Get the user ID from the auth middleware

  try {
    // Update the user and enable validation
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true } // Return the updated document and enable validation
    );

    if (!updatedUser) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    return res.status(OK).send(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error occurred on the server" });
  }
};


// POST /users - creates a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    // Remove the password field from the response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Return the user without the password field
    return res.status(CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("Error creating user:", err);

    // Handle duplicate email error
    if (err.code === 11000) {
      return res
        .status(400)
        .send({ message: "User with this email already exists" });
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid data passed" });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "Error creating user" });
  }
};

const getUserItems = async (req, res) => {
  const { userId } = req.params;

  try {
    const items = await ClothingItem.find({ owner: userId });

    if (!items || items.length === 0) {
      return res.status(NOT_FOUND).send({ message: "No items found for this user" });
    }

    return res.status(200).send(items);
  } catch (err) {
    console.error("Error fetching user items:", err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error occurred on the server" });
  }
};

module.exports = { getUsers, getCurrentUser, createUser, login, updateUser, getUserItems };
