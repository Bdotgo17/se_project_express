const express = require("express");
const itemRoutes = require("./items");
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItem");

const router = express.Router();

router.use("/items", itemRoutes);
router.use("/users", userRoutes);
router.use("/clothing-items", clothingItemRoutes);

module.exports = router;
