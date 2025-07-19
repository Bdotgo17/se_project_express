/* global jest, describe, it, expect */

const mongoose = require("mongoose");

const connectToDatabase = () =>
  mongoose.connect("mongodb://localhost:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

jest.mock("mongoose", () => ({
  connect: jest.fn(() => Promise.resolve()),
  connection: {
    close: jest.fn(() => Promise.resolve()),
  },
}));

describe("Database Connection", () => {
  it("should connect to the database successfully", async () => {
    await expect(connectToDatabase()).resolves.not.toThrow();
    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://localhost:27017/wtwr_db", // Ensure consistency here
      expect.any(Object)
    );
  });

  it("should close the database connection successfully", async () => {
    await mongoose.connection.close();
    expect(mongoose.connection.close).toHaveBeenCalled();
  });
});

module.exports = connectToDatabase;
