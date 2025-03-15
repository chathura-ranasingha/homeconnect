import { Request, Response } from "express";
import { AuthController } from "../../src/controllers/AuthController";
import { AppDataSource } from "../../src/ormconfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../src/ormconfig", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("AuthController - login", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockUserRepository: any;

  beforeEach(() => {
    req = { body: { username: "testuser", password: "password123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUserRepository = {
      findOne: jest.fn(),
    };

    (AppDataSource.getRepository as jest.Mock).mockReturnValue(
      mockUserRepository
    );

    jest.clearAllMocks();
  });

  it("should return a token and user data on successful login", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      password: "hashedpassword",
      role: "admin",
    };

    mockUserRepository.findOne.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mocked-jwt-token");

    await AuthController.login(req as Request, res as Response);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      token: "mocked-jwt-token",
      user: { id: 1, username: "testuser", role: "admin" },
    });
  });

  it("should return 401 if user is not found", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    await AuthController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid username or password",
    });
  });

  it("should return 500 if an error occurs", async () => {
    mockUserRepository.findOne.mockRejectedValue(new Error("Database error"));

    await AuthController.login(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
