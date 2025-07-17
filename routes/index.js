const express = require("express");
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItem");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/clothing-items", clothingItemRoutes);

module.exports = router;
