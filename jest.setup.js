// Jest setup file
/**
 * @jest-environment node
 */

const { afterAll } = require("@jest/globals");
const mongoose = require("mongoose");

// Mock the database connection
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose"); // Use the real mongoose for Schema
  return {
    ...actualMongoose,
    connect: jest.fn(() => Promise.resolve()),
    connection: {
      close: jest.fn(() => Promise.resolve()), // Mock the close method
    },
  };
});

// Close the MongoDB connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

// Mock process.exit to prevent Jest from exiting during tests
jest.spyOn(process, "exit").mockImplementation(() => {
  throw new Error("process.exit was called");
});