import { HealthResponse } from "../types/api";

import { BaseClient } from "./BaseClient";

export class HealthClient extends BaseClient {
  getHealth(): Cypress.Chainable<Cypress.Response<HealthResponse>> {
    return cy.request({
      method: "GET",
      url: `${this.baseUrl}/health`,
    });
  }
}
