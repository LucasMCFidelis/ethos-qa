import {
  AnswerFinishResponse,
  AnswerNextQuestionResponse,
  DeleteSessionResponse,
  FeedbackPayload,
  FeedbackResponse,
  SavedAnswerResponse,
  SessionResultResponse,
} from "../types/api";

import { BaseClient } from "./BaseClient";

export class SessionsClient extends BaseClient {
  answerQuestion(
    sessionId: string,
    questionId: string,
    answer: string,
  ): Cypress.Chainable<
    Cypress.Response<AnswerNextQuestionResponse | AnswerFinishResponse>
  > {
    return cy.request({
      method: "POST",
      url: `${this.baseUrl}/simulation/sessions/${sessionId}/answer`,
      body: { questionId, answer },
    });
  }

  getSavedAnswer(
    sessionId: string,
    questionId: string,
  ): Cypress.Chainable<Cypress.Response<SavedAnswerResponse>> {
    return cy.request({
      method: "GET",
      url: `${this.baseUrl}/simulation/sessions/${sessionId}/answer/${questionId}`,
    });
  }

  getResult(
    sessionId: string,
  ): Cypress.Chainable<Cypress.Response<SessionResultResponse>> {
    return cy.request({
      method: "GET",
      url: `${this.baseUrl}/simulation/sessions/${sessionId}/result`,
    });
  }

  submitFeedback(
    sessionId: string,
    payload: FeedbackPayload,
  ): Cypress.Chainable<Cypress.Response<FeedbackResponse>> {
    return cy.request({
      method: "POST",
      url: `${this.baseUrl}/simulation/sessions/${sessionId}/feedback`,
      body: payload,
    });
  }

  deleteSession(
    sessionId: string,
  ): Cypress.Chainable<Cypress.Response<DeleteSessionResponse>> {
    return cy.request({
      method: "DELETE",
      url: `${this.baseUrl}/simulation/sessions/${sessionId}`,
    });
  }
}
