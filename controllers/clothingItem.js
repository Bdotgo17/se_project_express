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

const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/customErrors");

const getClothingItems = async (req, res, next) => {
  try {
    const clothingItems = await ClothingItem.find();
    return res.status(OK).send(clothingItems);
  } catch (err) {
    if (err.name === "CastError") {
      return next(
        new BadRequestError("Invalid query format for clothing items")
      );
    }
    next(err); // Pass other errors to the centralized handler
  }
};

// POST /items - creates a new clothing item
const createClothingItem = async (req, res, next) => {
  try {
    const { name, weather, imageUrl } = req.body;
    const owner = req.user._id;
    const newItem = await ClothingItem.create({
      name,
      weather,
      imageUrl,
      owner,
    });
    return res.status(CREATED).send(newItem);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid data passed to create a clothing item"));
    }
    next(err); // Pass other errors to the centralized handler
  }
};

// DELETE /items/:itemId - deletes a clothing item by ID
const deleteClothingItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  // Validate the itemId
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID"));
  }

  try {
    const item = await ClothingItem.findById(itemId);

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    if (item.owner.toString() !== userId) {
      return next(new ForbiddenError("You do not have permission to delete this item"));
    }

    await item.deleteOne();
    return res.status(OK).json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting item:", err);

    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    next(err); // Pass other errors to the centralized handler
  }
};

// PUT /items/:itemId/likes — like an item
const likeItem = async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Clothing item not found");
    });
    return res.status(OK).send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    next(err); // Pass other errors to the centralized handler
  }
};

// DELETE /items/:itemId/likes — unlike an item
const dislikeItem = async (req, res, next) => {
  const { itemId } = req.params;

  try {
    const updatedItem = await ClothingItem.findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail(() => {
      throw new NotFoundError("Clothing item not found");
    });
    return res.status(OK).send(updatedItem);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    next(err); // Pass other errors to the centralized handler
  }
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
