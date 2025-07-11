const express = require("express");
const { getUsers, getUser, createUser } = require("../controllers/users");

const router = express.Router();

// Route for fetching all users
router.get("/", getUsers);

// Route for fetching a user by ID
router.get("/:userId", getUser);

// Route for creating a new user
router.post("/", createUser);

module.exports = router;
