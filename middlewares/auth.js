const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  try {
  const { authorization } = req.headers;

  // Check if the authorization header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  // Extract the token from the header
  const token = authorization.replace("Bearer ", "");

  // Verify the token
  const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the payload to the request object
    req.user = decoded;

    // Call the next middleware
    return next();
  } catch (err) {
    // Return a 401 error if the token is invalid
    return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  }
};

module.exports = auth;