const express = require("express");
const {
  clothingItemValidation,
  idValidation,
} = require("../middlewares/validation");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const auth = require("../middlewares/auth");

const router = express.Router();

// Route for fetching all clothing items
router.get("/", getClothingItems);

// Apply authentication middleware to the routes below
router.use(auth);

// Route for creating a new clothing item
router.post("/", clothingItemValidation, createClothingItem);

// Route for deleting a clothing item by ID
router.delete("/:itemId", idValidation, deleteClothingItem);

// Route for liking an item
router.put("/:itemId/likes", idValidation, likeItem);

// Route for unliking an item
router.delete("/:itemId/likes", idValidation, dislikeItem);

module.exports = router;
