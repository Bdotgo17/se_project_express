/* eslint-env jest */
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth"); // Adjust the path based on your project structure
const { JWT_SECRET } = require("../utils/config");

describe("Auth Middleware", () => {
  it("should populate req.user with the decoded token payload", () => {
    const req = {
      headers: {
        authorization: `Bearer ${jwt.sign(
          {
            _id: "5d8b8592978f8bd833ca8133",
            email: "test@example.com",
            name: "Test User",
          },
          JWT_SECRET
        )}`,
      },
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(req.user._id).toBe("5d8b8592978f8bd833ca8133");
    expect(req.user.email).toBe("test@example.com");
    expect(req.user.name).toBe("Test User");
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 if no token is provided", () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: "Authorization required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if the token is invalid", () => {
    const req = {
      headers: {
        authorization: "Bearer invalidtoken",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: "Invalid token",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
