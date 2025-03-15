import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { AppDataSource } from "../ormconfig";

const JWT_SECRET =
  process.env.JWT_SECRET || "g4z8Gh9p1$3b#Rj7P!vX2F8kZ%YwLzNmTeQoA7kS@Mw"; // Use environment variable

export const authenticate = async (req: any, res: any, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer Token
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    // Fetch user from DB
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Attach user data to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
