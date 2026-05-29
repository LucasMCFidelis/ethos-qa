import { defineConfig } from "cypress";
import { plugin as cypressGrepPlugin } from "@cypress/grep/plugin";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    specPattern: "cypress/api/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",

    setupNodeEvents(on, config) {
      cypressGrepPlugin(config);
      return config;
    },
  },

  expose: {
    apiUrl: process.env.API_URL || "http://localhost:3000",
  },
});
