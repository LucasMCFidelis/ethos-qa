import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || "http://localhost:8080",
    supportFile: "cypress/support/e2e.ts",
  },
  expose: {
    apiUrl: process.env.API_URL || "http://localhost:3000",
  },
});
