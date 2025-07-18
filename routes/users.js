const express = require("express");
const auth = require("../middlewares/auth");
const {
  getUsers,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

const router = express.Router();

// Route to get all users
router.get("/", auth, getUsers);

// Route to get the current user
router.get("/me", auth, getCurrentUser);

// Route to update the current user's profile
router.patch("/me", auth, updateUser);

module.exports = router;
