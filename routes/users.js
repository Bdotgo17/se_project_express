const express = require("express");
const { getUsers, getCurrentUser, updateUser } = require("../controllers/users");

const router = express.Router();

// Route to get all users
router.get("/", getUsers);

// Route to get the current user
router.get("/me", getCurrentUser);

// Route to update the current user's profile
router.patch("/me", updateUser);

module.exports = router;