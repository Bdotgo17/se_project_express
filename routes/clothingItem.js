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
router.get("/", getClothingItems);

// Route for creating a new clothing item
router.post("/", createClothingItem);

// Route for deleting a clothing item by ID
router.delete("/:itemId", deleteClothingItem);
// Route for liking an item
router.put("/:itemId/likes", likeItem);

// Route for unliking an item
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
