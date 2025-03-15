import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
config(); // Load environment variables from .env

import { Lead } from "./entities/Lead";
import { Property } from "./entities/Property";
import { Reservation } from "./entities/Reservation";
import { User } from "./entities/User";

import { Sale } from "./entities/Sale";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_DATABASE || "homeconnect",
  synchronize: true, // Auto-creates tables (disable in production)
  logging: true,
  entities: [Lead, Property, Reservation, User, Sale],
  migrations: [],
  subscribers: [],
});

// Initialize the database connection
AppDataSource.initialize()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((error) => console.error("❌ Database connection error:", error));
