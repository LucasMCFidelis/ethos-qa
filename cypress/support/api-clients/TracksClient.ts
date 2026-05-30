import {
  SessionStartResponse,
  TrackQuestionResponse,
  TracksListResponse,
} from "../types/api";

import { BaseClient } from "./BaseClient";

export class TracksClient extends BaseClient {
  getTracks(): Cypress.Chainable<Cypress.Response<TracksListResponse>> {
    throw new Error("Not implemented");
  }

  getQuestion(
    trackId: string,
    questionId: string,
  ): Cypress.Chainable<Cypress.Response<TrackQuestionResponse>> {
    throw new Error("Not implemented");
  }

  startSession(
    trackId: string,
  ): Cypress.Chainable<Cypress.Response<SessionStartResponse>> {
    return cy.request(`${this.baseUrl}/simulation/tracks/${trackId}/start`);
  }
}
