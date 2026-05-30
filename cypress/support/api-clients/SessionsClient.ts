import {
  AnswerFinishResponse,
  AnswerNextQuestionResponse,
  DeleteSessionResponse,
  FeedbackResponse,
  SavedAnswerResponse,
  SessionResult,
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

  getResult(sessionId: string): Cypress.Chainable<
    Cypress.Response<{
      ok: boolean;
      data: SessionResult;
    }>
  > {
    throw new Error("Not implemented");
  }

  submitFeedback(
    sessionId: string,
    payload: object,
  ): Cypress.Chainable<Cypress.Response<FeedbackResponse>> {
    throw new Error("Not implemented");
  }

  deleteSession(
    sessionId: string,
  ): Cypress.Chainable<Cypress.Response<DeleteSessionResponse>> {
    throw new Error("Not implemented");
  }
}
