const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
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
      const err = new Error("Authorization required");
      err.status = UNAUTHORIZED;
      return next(err);
    }

    // Extract the token from the header
    const token = authorization.replace("Bearer ", "");

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      const error = new Error("Invalid token");
      error.status = UNAUTHORIZED;
      return next(error);
    }

    // Ensure the decoded token contains the required fields
    if (!decoded || !decoded._id) {
      const err = new Error("Invalid token payload");
      err.status = UNAUTHORIZED;
      return next(err);
    }

    // Set req.user with all required fields
    req.user = {
      _id: decoded._id,
      email: decoded.email || null, // Default to null if not provided
      name: decoded.name || null, // Default to null if not provided
      role: decoded.role || "user", // Default to "user" if not provided
    };

    // Call the next middleware
    return next();
  } catch (err) {
    err.status = UNAUTHORIZED;
    return next(err);
  }
};

module.exports = auth;
