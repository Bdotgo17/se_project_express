// filepath: /Users/adam/se_project_express/models/user.js
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure the email is unique
    validate: {
      validator: (value) => validator.isEmail(value), // Use validator to check email format
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true, // Password is required
    minlength: 8, // Optional: Enforce a minimum password length
    select: false, // Prevent the password from being returned in queries by default
  },
});

module.exports = mongoose.model("User", userSchema);
