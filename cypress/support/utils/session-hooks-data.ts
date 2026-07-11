import { SessionsClient } from "../api-clients/SessionsClient";

let sessionId: string | undefined;

export function saveSessionId(id: string): void {
  sessionId = id;
}

export function getSessionId(): string {
  if (!sessionId) {
    throw new Error("Session ID is not defined.");
  }
  return sessionId;
}

export function clearSessionData(): Cypress.Chainable {
  if (!sessionId) {
    cy.log("⚠️ Nenhuma sessão ativa — cleanup ignorado.");
    return cy.wrap(null, { log: false });
  }

  const sessionsClient = new SessionsClient();
  const idToClear = sessionId;
  sessionId = undefined;

  return sessionsClient.deleteSession(idToClear).then((response) => {
    if (response.status >= 400 && response.status !== 404) {
      cy.log(
        `⚠️ Falha ao limpar sessão ${idToClear}: status ${response.status}`,
      );
    }
  });
}
