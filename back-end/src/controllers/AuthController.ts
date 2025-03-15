import jwt from "jsonwebtoken";
import { AppDataSource } from "../ormconfig";
import { User } from "../entities/User";

const JWT_SECRET =
  process.env.JWT_SECRET || "g4z8Gh9p1$3b#Rj7P!vX2F8kZ%YwLzNmTeQoA7kS@Mw";

export class AuthController {
  static async login(req: any, res: any): Promise<any> {
    const { username, password } = req.body;

    try {
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({
        where: { username, password },
      });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        token,
        user: { id: user.id, username: user.username, role: user.role },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
