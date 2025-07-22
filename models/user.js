// filepath: /Users/adam/se_project_express/models/user.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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
    select: false, // Prevent the password from being returned in queries by default
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "You must enter a valid URL",
    },
  },
});

// Custom method to find user by credentials
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password"); // Explicitly select the password field
  if (!user) {
    const error = new Error("Invalid email or password");
    error.name = "UnauthorizedError";
    throw error;
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const error = new Error("Invalid email or password");
    error.name = "UnauthorizedError";
    throw error;
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
