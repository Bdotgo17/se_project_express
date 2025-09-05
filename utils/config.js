require("dotenv").config(); // Load environment variables from .env file

const { JWT_SECRET = "super-strong-secret" } = process.env;

module.exports = { JWT_SECRET };