const express = require("express");
const {
  idValidation,
  userCreationValidation,
  loginValidation,
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
  auth,
  updateUserValidation, // Move validation BEFORE logger
  (req, res, next) => {
    console.log("PATCH /users/me body:", req.body);
    next();
  },
  updateUser
);

// Get items for a user by ID
router.get("/:userId/items", idValidation, getUserItems);

router.patch("*", (req, res) => {
  console.log("Catch-all PATCH route hit:", req.originalUrl, req.body);
  res.status(404).send({ message: "Catch-all PATCH route hit" });
});

module.exports = router;
