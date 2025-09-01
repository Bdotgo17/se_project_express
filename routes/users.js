
const express = require("express");
const {
  userCreationValidation,
  loginValidation,
  idValidation,
} = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const {
  createUser,
  login,
  getCurrentUser,
  updateUser,
  getUserItems,
} = require("../controllers/users");

const router = express.Router();

// User signup
router.post('/signup', userCreationValidation, createUser);

// User login
router.post('/signin', loginValidation, login);

// Route to get the current user
router.get("/me", auth, getCurrentUser);

// Route to update the current user's profile
router.patch("/me", auth, userCreationValidation, updateUser);

// Get items for a user by ID
router.get('/:userId/items', idValidation, getUserItems);

module.exports = router;
