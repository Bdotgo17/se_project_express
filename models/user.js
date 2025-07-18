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
    minlength: 8, // Optional: Enforce a minimum password length
    select: false, // Prevent the password from being returned in queries by default
  },
  avatar: {
    type: String,
    required: false,
  },
});

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function preSaveHook(next) {
  if (!this.isModified("password")) {
    return next(); // Skip hashing if the password hasn't changed
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err); // Pass the error to the next middleware
  }
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
