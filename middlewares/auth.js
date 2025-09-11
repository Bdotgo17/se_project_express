const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors"); // <-- Import your custom error
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Ignore requests to /favicon.ico
    if (req.path === "/favicon.ico") {
      return next();
    }

    // Check if the authorization header exists and starts with "Bearer "
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new UnauthorizedError("Authorization required"));
    }

    // Extract the token from the header
    const token = authorization.replace("Bearer ", "");

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return next(new UnauthorizedError("Invalid token"));
    }

    // Ensure the decoded token contains the required fields
    if (!decoded || !decoded._id) {
      return next(new UnauthorizedError("Invalid token payload"));
    }

    // Set req.user with all required fields
    req.user = {
      _id: decoded._id,
      email: decoded.email || null, // Default to null if not provided
      name: decoded.name || null, // Default to null if not provided
      role: decoded.role || "user", // Default to "user" if not provided
    };

    return next();
  } catch (err) {
    return next(new UnauthorizedError("Authorization required"));
  }
};

module.exports = auth;
