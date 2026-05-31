import {
  SessionStartResponse,
  TrackQuestionResponse,
  TracksListResponse,
} from "../types/api";

import { BaseClient } from "./BaseClient";

export class TracksClient extends BaseClient {
  getTracks(): Cypress.Chainable<Cypress.Response<TracksListResponse>> {
    return cy.request({
      method: "GET",
      url: `${this.baseUrl}/simulation/tracks`,
    });
  }

  getQuestion(
    trackId: string,
    questionId: string,
  ): Cypress.Chainable<Cypress.Response<TrackQuestionResponse>> {
    return cy.request({
      method: "GET",
      url: `${this.baseUrl}/simulation/tracks/${trackId}/questions/${questionId}`,
    });
  }

  startSession(
    trackId: string,
  ): Cypress.Chainable<Cypress.Response<SessionStartResponse>> {
    return cy.request({
      method: "GET",
      url: `${this.baseUrl}/simulation/tracks/${trackId}/start`,
    });
  }
}
