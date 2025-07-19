const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Log the Authorization header for debugging
    console.log("Authorization header:", authorization);

    // Check if the authorization header exists and starts with "Bearer "
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Authorization required" });
    }

    // Extract the token from the header
    const token = authorization.replace("Bearer ", "");

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
    }

    // Ensure the decoded token contains the required fields
    if (!decoded || !decoded._id) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid token payload" });
    }

    // Set req.user with all required fields
    req.user = {
      _id: decoded._id,
      email: decoded.email || null, // Default to null if not provided
      name: decoded.name || null, // Default to null if not provided
    };

    // Log the decoded user for debugging
    console.log("Decoded user:", req.user);

    // Call the next middleware
    return next();
  } catch (err) {
    // Return a 401 error if the token is invalid
    return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  }
};

module.exports = auth;
