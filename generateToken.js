const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./utils/config"); // Ensure this matches your app's secret
const { logger } = require("./middlewares/logger");

// Generate a token
const token = jwt.sign(
  { _id: "5d8b8592978f8bd833ca8133", email: "test@example.com" }, // Payload
  JWT_SECRET, // Secret key
  { expiresIn: "1h" } // Token expiration time
);

logger.info(`Generated token: ${token}`);