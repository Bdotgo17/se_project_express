const express = require("express");
const router = express.Router();

// Example route for items
router.get("/", (req, res) => {
  res.send({ message: "Items route is working" });
});

module.exports = router;