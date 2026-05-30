import { HealthResponse } from "../types/api";

import { BaseClient } from "./BaseClient";

export class HealthClient extends BaseClient {
  getHealth(): Cypress.Chainable<Cypress.Response<HealthResponse>> {
    throw new Error("Not implemented");
  }
}
