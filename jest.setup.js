// Jest setup file
/**
 * @jest-environment node
 */

// Ensure Jest globals are available
const { afterAll } = require("@jest/globals");
const mongoose = require("mongoose");

afterAll(async () => {
  await mongoose.connection.close(); // Close the MongoDB connection
});




