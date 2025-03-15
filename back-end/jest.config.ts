import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest", // For TypeScript
  testEnvironment: "node",
  moduleFileExtensions: ["js", "ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

export default config;
