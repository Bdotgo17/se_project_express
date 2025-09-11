const express = require("express");
const {
  idValidation,
  updateUserValidation,
} = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  updateUser,
  getUserItems,
} = require("../controllers/users");

const router = express.Router();

// Route to get the current user
router.get("/me", auth, getCurrentUser);

// Route to update the current user's profile
router.patch(
  "/me",
  auth, // <--- Add this!
  (req, res, next) => {
    console.log("PATCH /users/me body:", req.body);
    next();
  },
  updateUserValidation,
  updateUser
);

// Get items for a user by ID
router.get("/:userId/items", idValidation, getUserItems);

module.exports = router;
