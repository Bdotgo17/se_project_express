const express = require("express");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const router = express.Router();

// Route for fetching all clothing items
router.get("/items", getClothingItems);

// Route for creating a new clothing item
router.post("/items", createClothingItem);

// Route for deleting a clothing item by ID
router.delete("/items/:itemId", deleteClothingItem);
// Route for liking an item
router.put("/items/:itemId/likes", likeItem);

// Route for unliking an item
router.delete("/items/:itemId/likes", dislikeItem);

module.exports = router;
