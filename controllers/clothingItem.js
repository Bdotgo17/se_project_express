// filepath: /Users/adam/se_project_express/controllers/clothingItems.js
const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find();
    return res.status(200).send(clothingItems);
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
    const item = await ClothingItem.create({ name, weather, imageUrl, owner });
    return res.status(201).send(item);
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
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    await item.deleteOne();
    return res
      .status(200)
      .send({ message: "Clothing item deleted successfully" });
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

// PUT /items/:itemId/likes — like an item
const likeItem = async (req, res) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } }, // Add user ID to likes array if not already present
      { new: true } // Return the updated document
    ).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(200).send(item);
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
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } }, // Remove user ID from likes array
      { new: true } // Return the updated document
    ).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(200).send(item);
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

const getItemLikes = async (req, res) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId).orFail(() => {
      const error = new Error("Clothing item not found");
      error.statusCode = NOT_FOUND;
      throw error;
    });
    return res.status(200).send(item.likes); // Return the likes array
  } catch (err) {
    console.error(err);
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
  getItemLikes,
};
