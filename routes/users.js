const express = require("express");
const {
  getUsers,
  getCurrentUser,
  updateUser,
  getUserItems,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

// Route to get all users
router.get("/", auth, getUsers);

// Route to get the current user
router.get("/me", auth, getCurrentUser);

// Route to update the current user's profile
router.patch("/me", auth, updateUser);

// Route to get items for a specific user
router.get("/:userId/items", auth, getUserItems);

module.exports = router;
