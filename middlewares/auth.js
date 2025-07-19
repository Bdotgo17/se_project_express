const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Check if the authorization header exists and starts with "Bearer "
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Authorization required" });
    }

    // Extract the token from the header
    const token = authorization.replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure the decoded token contains the required fields
    if (!decoded || !decoded._id) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid token payload" });
    }

    req.user = {
      _id: decoded._id,
      email: decoded.email, // Ensure all required fields are set
      name: decoded.name,
    };

    // Call the next middleware
    return next();
  } catch (err) {
    // Return a 401 error if the token is invalid
    return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  }
};

module.exports = auth;
