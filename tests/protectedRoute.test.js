/* eslint-env jest */
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../app"); // Import your Express app
const { JWT_SECRET } = require("../utils/config");

describe("Protected Route", () => {
  it("should allow access with a valid token", async () => {
    // Generate a valid JWT with required fields
    const token = jwt.sign(
      { _id: "5d8b8592978f8bd833ca8133", email: "test@example.com", name: "Test User" },
      JWT_SECRET
    );

    // Send a request to the protected route with the token
    const response = await request(app)
      .get("/protected-route")
      .set("Authorization", `Bearer ${token}`);

    // Assert the response
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Access granted");
    expect(response.body).toHaveProperty("userId", "5d8b8592978f8bd833ca8133");
  });

  it("should deny access without a token", async () => {
    const response = await request(app).get("/protected-route");

    // Assert the response
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Authorization required");
  });
});