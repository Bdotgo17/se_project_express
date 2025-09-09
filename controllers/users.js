const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { OK, CREATED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config"); // Import the secret key
const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../utils/BadRequestError");
const UnauthorizedError = require("../utils/UnauthorizedError");
const NotFoundError = require("../utils/NotFoundError");
const ConflictError = require("../utils/ConflictError");
const { logger } = require("../middlewares/logger");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new BadRequestError("Email and password are required"));
    }

    // Find the user by email and validate the password
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send the token in the response body
    return res.status(200).send({ token });
  } catch (err) {
    logger.error(`Error during login: ${err}`);

    // Handle authentication errors
    if (err.name === "UnauthorizedError") {
      return next(new UnauthorizedError("Invalid email or password"));
    }
    return next(err); // Pass other errors to centralized handler
  }
};

// GET /users/me - returns the current user
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    return res.status(OK).send(user);
  } catch (err) {
    logger.error(`Error fetching current user: ${err}`);
    return next(err); // Pass error to centralized handler
  }
};

const updateUser = async (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new NotFoundError("User not found"));
    }

    return res.status(OK).send(updatedUser);
  } catch (err) {
    logger.error(`Error updating user: ${err}`);

    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data passed"));
    }
    return next(err); // Pass other errors to centralized handler
  }
};

// POST /users - creates a new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    // Remove the password field from the response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Return the user without the password field
    return res.status(CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    logger.error(`Error creating user: ${err}`);

    // Handle duplicate email error
    if (err.code === 11000) {
      return next(new ConflictError("User with this email already exists"));
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data passed"));
    }

    return next(err); // Pass other errors to centralized handler
  }
};

const getUserItems = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const items = await ClothingItem.find({ owner: userId });

    if (!items || items.length === 0) {
      return next(new NotFoundError("No items found for this user"));
    }

    return res.status(OK).send(items);
  } catch (err) {
    logger.error(`Error fetching user items: ${err}`);
    return next(err); // Pass error to centralized handler
  }
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUser,
  getUserItems,
};
