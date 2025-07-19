/* eslint-env jest */
const jwt = require("jsonwebtoken");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Import your Express app
const { JWT_SECRET } = require("../utils/config");

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect("mongodb://127.0.0.1:27017/test_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect from the test database
  await mongoose.connection.close();
});

describe("Protected Route", () => {
  it("should allow access with a valid token", async () => {
    // Generate a valid JWT with required fields
    const token = jwt.sign(
      {
        _id: "5d8b8592978f8bd833ca8133",
        email: "test@example.com",
        name: "Test User", // Add name
        role: "user", // Add role
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send a request to the protected route with the token
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Access granted");
    expect(response.body).toHaveProperty("userId", "5d8b8592978f8bd833ca8133");
    expect(response.body).toHaveProperty("name", "Test User"); // Assert name
    expect(response.body).toHaveProperty("role", "user"); // Assert role
  });

  it("should deny access without a token", async () => {
    const response = await request(app).get("/protected-route");

    // Assert the response
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Authorization required");
  });

  it("should deny access with an invalid token", async () => {
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", "Bearer invalidtoken");

    // Assert the response
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should deny access with an expired token", async () => {
    // Generate an expired token
    const token = jwt.sign(
      {
        _id: "5d8b8592978f8bd833ca8133",
        email: "test@example.com",
        name: "Test User", // Add name
        role: "user", // Add role
      },
      JWT_SECRET,
      { expiresIn: "-1h" } // Token expired 1 hour ago
    );

    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);

    // Assert the response
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  it("should deny access if the Authorization header is missing", async () => {
    const response = await request(app).get("/protected-route");

    // Assert the response
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Authorization required");
  });
});