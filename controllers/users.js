const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// GET /users - returns all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Error fetching users' });
  }
};

// GET /users/:userId - returns a user by _id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(() => {
      const error = new Error("User not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
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
    const { name, avatar } = req.body;
    const user = await User.create({ name, avatar });
    res.status(201).send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send({ message: "Error creating user" });
  }
};

module.exports = { getUsers, getUser, createUser };
