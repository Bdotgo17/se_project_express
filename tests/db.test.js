/* global jest, describe, it, expect */

const mongoose = require("mongoose");
const connectToDatabase = require("../db");

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
      "mongodb://127.0.0.1:27017/wtwr_db",
      expect.any(Object)
    );
  });

  it("should close the database connection successfully", async () => {
    await mongoose.connection.close();
    expect(mongoose.connection.close).toHaveBeenCalled();
  });
});