const mongoose = require("mongoose"); // Add this line

const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
  CREATED,
} = require("../utils/errors");

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

// GET /users/:userId - returns a user by ID
const getUser = async (req, res) => {
  const { userId } = req.params;

  // Validate the userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId).orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(OK).send(user);
  } catch (err) {
    console.error("Error fetching user:", err);

    // Handle CastError for invalid ObjectId
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
    }

    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: "User not found" });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

// POST /users - creates a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

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

module.exports = { getUsers, getUser, createUser };
