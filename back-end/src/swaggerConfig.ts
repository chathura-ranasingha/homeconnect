import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my Node.js TypeScript app",
    },
    servers: [
      {
        url: "http://localhost:3001", // Change based on your environment
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to your API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Function to set up Swagger in an Express app
 * @param app Express application instance
 */
export function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📄 Swagger Docs available at: http://localhost:5000/api-docs");
}
