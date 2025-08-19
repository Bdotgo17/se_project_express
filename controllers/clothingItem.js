const mongoose = require("mongoose");

const ClothingItem = require("../models/clothingItem");

const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  OK,
  CREATED,
  FORBIDDEN,
} = require("../utils/errors");

const getClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find();
    return res.status(OK).send(clothingItems);
  } catch (err) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

// POST /items - creates a new clothing item
const createClothingItem = async (req, res) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id; // Use the user ID from the middleware
    const newItem = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(CREATED).send(newItem);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST)
        .send({ message: "Invalid data passed to create a clothing item" });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

// DELETE /items/:itemId - deletes a clothing item by ID
const deleteClothingItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id; // Get the logged-in user's ID from the auth middleware

  // Validate the itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
  }

  try {
    // Find the item by ID
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    // Check if the logged-in user is the owner of the item
    if (item.owner.toString() !== userId) {
      return res
        .status(FORBIDDEN)
        .json({ message: "You do not have permission to delete this item" });
    }

    // If the user is the owner, delete the item
    await item.deleteOne();
    return res.status(OK).json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);

    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).json({ message: "Invalid item ID" });
    }

    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// PUT /items/:itemId/likes — like an item
const likeItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } }, // Add user ID to likes array if not already present
      { new: true } // Return the updated document
    ).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(OK).send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }
    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: "Clothing item not found" });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

// DELETE /items/:itemId/likes — unlike an item
const dislikeItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } }, // Remove user ID from likes array
      { new: true } // Return the updated document
    ).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(OK).send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
    }
    if (err.statusCode === NOT_FOUND) {
      return res.status(NOT_FOUND).send({ message: "Clothing item not found" });
    }
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server" });
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
