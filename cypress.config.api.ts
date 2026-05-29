import { defineConfig } from "cypress";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    specPattern: "cypress/api/**/*.cy.ts",

    setupNodeEvents(on, config) {
      return config;
    },
  },

  expose: {
    apiUrl: process.env.API_URL || "http://localhost:3000",
  },
});