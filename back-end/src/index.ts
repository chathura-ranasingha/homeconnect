import "reflect-metadata";
import express, { Request, Response } from "express";
import { AppDataSource } from "./ormconfig";
import leadRoutes from "./routes/leadRoute"; // Import the lead routes
import authRoutes from "./routes/authRoute";
import { setupSwagger } from "./swaggerConfig"; // ✅ Import Swagger

const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => console.error("Database connection error:", error));

app.get("/landing", (req: Request, res: Response): void => {
  res.send("Welcome to the Real Estate CRM API");
});

app.use("/api/leads", leadRoutes);
app.use("/api/login", authRoutes);

// Setup Swagger
setupSwagger(app);
console.log(`📄 Swagger Docs available at: http://localhost:${port}/api-docs`);

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on("SIGTERM", () => {
  console.log("Closing server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("Closing server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
