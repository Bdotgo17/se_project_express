const connectToDatabase = require("../db");
const mongoose = require("mongoose");

jest.mock("mongoose", () => ({
  connect: jest.fn(() => Promise.resolve()),
}));

describe("Database Connection", () => {
  it("should connect to the database successfully", async () => {
    await expect(connectToDatabase()).resolves.not.toThrow();
    expect(mongoose.connect).toHaveBeenCalledWith(
      "mongodb://127.0.0.1:27017/wtwr_db",
      expect.any(Object)
    );
  });
});
