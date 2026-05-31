import { TAGS } from "../../support/constants/tags";
import { validateSchema } from "../../support/utils/validate-schema";
import type {
  FeedbackPayload,
  FeedbackResponse,
} from "../../support/types/api";
import { TracksClient } from "../../support/api-clients/TracksClient";
import { SessionsClient } from "../../support/api-clients/SessionsClient";
import { feedbackSchema } from "../../support/schemas/sessions/feedback.schema";
import { TRACKS_TEST_DATA } from "../../support/test-data/tracks";
import { SESSION_ANSWERS } from "../../support/test-data/sessions";

describe("Sessions — Feedback API", { tags: [TAGS.SESSIONS_FEEDBACK] }, () => {
  const tracksClient = new TracksClient();
  const sessionsClient = new SessionsClient();

  function setupFeedback(
    payload: FeedbackPayload,
  ): Cypress.Chainable<Cypress.Response<FeedbackResponse>> {
    return tracksClient
      .startSession(TRACKS_TEST_DATA.CONFIDENTIALITY_TRACK_ID)
      .then((startResponse) => {
        const sessionId = startResponse.body.data.sessionId;

        return sessionsClient
          .answerQuestion(
            sessionId,
            TRACKS_TEST_DATA.FIRST_QUESTION_ID,
            SESSION_ANSWERS.NO,
          )
          .then((answerResponse) => {
            expect(
              answerResponse.body.data.finished,
              "sessão deve estar finalizada antes de enviar feedback",
            ).to.eq(true);

            return sessionsClient.submitFeedback(sessionId, payload);
          });
      });
  }

  describe("ETHOS-25", () => {
    let responseObject: Cypress.Response<FeedbackResponse>;
    const DATA_RATE = 5;
    const DATA_OBJECTIVE = "Entender dilemas éticos em telemedicina";
    const DATA_SUGGESTION = "teste";

    before(() => {
      setupFeedback({
        rate: DATA_RATE,
        useObjective: DATA_OBJECTIVE,
        suggestion: DATA_SUGGESTION,
      }).then((response) => {
        responseObject = response;
      });
    });

    it(
      "Envio de feedback válido com todos os campos preenchidos",
      { tags: [TAGS.SMOKE] },
      () => {
        expect(responseObject.status).to.eq(200);

        const { data } = responseObject.body;

        expect(data.rate).to.eq(DATA_RATE);
        expect(data.useObjective).to.eq(DATA_OBJECTIVE);
        expect(data.suggestion).to.be.eq(DATA_SUGGESTION);
        expect(new Date(data.createdAt).toString()).to.not.eq("Invalid Date");
      },
    );

    it(
      "Valida schema do response ao enviar feedback completo",
      { tags: [TAGS.SCHEMA] },
      () => {
        validateSchema({
          data: responseObject.body,
          schema: feedbackSchema,
          schemaName: "Feedback",
        });
      },
    );
  });

  describe("ETHOS-26", () => {
    let responseObject: Cypress.Response<FeedbackResponse>;
    const DATA_RATE = 4;
    const DATA_OBJECTIVE = "Teste";

    before(() => {
      setupFeedback({
        rate: DATA_RATE,
        useObjective: DATA_OBJECTIVE,
        // suggestion ausente intencionalmente
      }).then((response) => {
        responseObject = response;
      });
    });

    it(
      "Envio de feedback preenchido apenas com campos obrigatórios",
      { tags: [TAGS.SMOKE] },
      () => {
        expect(responseObject.status).to.eq(200);

        const { data } = responseObject.body;

        expect(data.rate).to.eq(DATA_RATE);
        expect(data.useObjective).to.eq(DATA_OBJECTIVE);
        expect(data).not.have.property("suggestion");
        expect(new Date(data.createdAt).toString()).to.not.eq("Invalid Date");
      },
    );

    it(
      "Valida schema do response ao enviar feedback com campos obrigatórios",
      { tags: [TAGS.SCHEMA] },
      () => {
        validateSchema({
          data: responseObject.body,
          schema: feedbackSchema,
          schemaName: "Feedback",
        });
      },
    );
  });
});
