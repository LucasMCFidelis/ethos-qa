import { TAGS } from "../../support/constants/tags";
import { validateSchema } from "../../support/utils/validate-schema";
import type { SessionResultResponse } from "../../support/types/api";
import { TracksClient } from "../../support/api-clients/TracksClient";
import { SessionsClient } from "../../support/api-clients/SessionsClient";
import { sessionResultSchema } from "../../support/schemas/sessions/session-result.schema";
import { TRACKS_TEST_DATA } from "../../support/test-data/tracks";
import { SESSION_ANSWERS } from "../../support/test-data/sessions";
import {
  clearSessionData,
  saveSessionId,
} from "../../support/utils/session-hooks-data";

describe("Sessions — Result API", { tags: [TAGS.SESSIONS_RESULTS] }, () => {
  const tracksClient = new TracksClient();
  const sessionsClient = new SessionsClient();

  describe("ETHOS-23", () => {
    let responseObject: Cypress.Response<SessionResultResponse>;

    before(() => {
      tracksClient
        .startSession(TRACKS_TEST_DATA.CONFIDENTIALITY_TRACK_ID)
        .then((startResponse) => {
          const sessionId = startResponse.body.data.sessionId;
          saveSessionId(sessionId);

          return sessionsClient
            .answerQuestion(
              sessionId,
              TRACKS_TEST_DATA.FIRST_QUESTION_ID,
              SESSION_ANSWERS.NO,
            )
            .then((answerResponse) => {
              const finished = answerResponse.body.data.finished;

              expect(
                finished,
                "sessão deve estar finalizada antes de buscar resultado",
              ).to.eq(true);

              return sessionsClient.getResult(sessionId).then((response) => {
                responseObject = response;
              });
            });
        });
    });

    after(() => {
      clearSessionData();
    });

    it(
      "Busca resultado válido de sessão finalizada",
      { tags: [TAGS.SMOKE] },
      () => {
        expect(responseObject.status).to.eq(200);

        const { data } = responseObject.body;

        expect(data.finished).to.eq(true);
      },
    );

    it(
      "Valida schema do response ao buscar resultado",
      { tags: [TAGS.SCHEMA] },
      () => {
        validateSchema({
          data: responseObject.body,
          schema: sessionResultSchema,
          schemaName: "SessionResult",
        });
      },
    );
  });
});
