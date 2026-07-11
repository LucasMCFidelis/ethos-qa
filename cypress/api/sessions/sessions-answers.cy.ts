import { TAGS } from "../../support/constants/tags";
import { validateSchema } from "../../support/utils/validate-schema";
import type {
  SessionStartResponse,
  AnswerNextQuestionResponse,
  AnswerFinishResponse,
  SavedAnswerResponse,
} from "../../support/types/api";
import { TracksClient } from "../../support/api-clients/TracksClient";
import { SessionsClient } from "../../support/api-clients/SessionsClient";
import { answerFinishSchema } from "../../support/schemas/sessions/answer-finish.schema";
import { answerNextQuestionSchema } from "../../support/schemas/sessions/answer-next-question.schema";
import { savedAnswerSchema } from "../../support/schemas/sessions/saved-answer.schema";
import { sessionStartSchema } from "../../support/schemas/sessions/session-start.schema";
import { TRACKS_TEST_DATA } from "../../support/test-data/tracks";
import { SESSION_ANSWERS } from "../../support/test-data/sessions";
import {
  clearSessionData,
  saveSessionId,
} from "../../support/utils/session-hooks-data";

describe("Sessions — Answers API", { tags: [TAGS.SESSIONS_ANSWERS] }, () => {
  const tracksClient = new TracksClient();
  const sessionsClient = new SessionsClient();

  describe("ETHOS-13", () => {
    let responseObject: Cypress.Response<SessionStartResponse>;

    before(() => {
      tracksClient
        .startSession(TRACKS_TEST_DATA.CONFIDENTIALITY_TRACK_ID)
        .then((response) => {
          responseObject = response;
          saveSessionId(response.body.data.sessionId);
        });
    });

    after(() => {
      clearSessionData();
    });

    it(
      "Inicia sessão em trilha existente e retorna primeira pergunta",
      { tags: [TAGS.SMOKE] },
      () => {
        expect(responseObject.status).to.eq(201);

        const data = responseObject.body.data;

        expect(data.sessionId).to.match(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
        );
        expect(data.finished).to.eq(false);
        expect(data.maxQuestions).to.be.above(0);
        expect(data.question.id).to.equal(TRACKS_TEST_DATA.FIRST_QUESTION_ID);
      },
    );

    it(
      "Valida schema do response ao iniciar sessão",
      { tags: [TAGS.SCHEMA] },
      () => {
        validateSchema({
          data: responseObject.body,
          schema: sessionStartSchema,
          schemaName: "SessionStart",
        });
      },
    );
  });

  describe("ETHOS-15", () => {
    let responseObject: Cypress.Response<AnswerNextQuestionResponse>;

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
              SESSION_ANSWERS.YES,
            )
            .then((response) => {
              responseObject =
                response as Cypress.Response<AnswerNextQuestionResponse>;
            });
        });
    });

    after(() => {
      clearSessionData();
    });

    it(
      "Envio de resposta válida retorna próxima pergunta",
      { tags: [TAGS.SMOKE] },
      () => {
        expect(responseObject.status).to.eq(200);

        const data = responseObject.body.data;

        expect(data.finished).to.eq(false);
        expect(data.question?.id).to.not.equal(
          TRACKS_TEST_DATA.FIRST_QUESTION_ID,
        );
        expect(responseObject.body).to.not.have.property("result");
      },
    );

    it(
      "Valida schema do response ao enviar resposta",
      { tags: [TAGS.SCHEMA] },
      () => {
        validateSchema({
          data: responseObject.body,
          schema: answerNextQuestionSchema,
          schemaName: "AnswerNextQuestion",
        });
      },
    );
  });

  describe("ETHOS-16", () => {
    let responseObject: Cypress.Response<AnswerFinishResponse>;

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
            .then((response) => {
              responseObject =
                response as Cypress.Response<AnswerFinishResponse>;
            });
        });
    });

    after(() => {
      clearSessionData();
    });

    it(
      "Envio de resposta válida retorna resultado final",
      { tags: [TAGS.SMOKE] },
      () => {
        expect(responseObject.status).to.eq(200);

        const data = responseObject.body.data;

        expect(data.finished).to.eq(true);
        expect(responseObject.body).to.not.have.property("question");
      },
    );

    it(
      "Valida schema do response ao finalizar sessão",
      { tags: [TAGS.SCHEMA] },
      () => {
        validateSchema({
          data: responseObject.body,
          schema: answerFinishSchema,
          schemaName: "AnswerFinish",
        });
      },
    );
  });

  describe("ETHOS-20", () => {
    let responseObject: Cypress.Response<SavedAnswerResponse>;

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
              SESSION_ANSWERS.YES,
            )
            .then(() =>
              sessionsClient
                .getSavedAnswer(sessionId, TRACKS_TEST_DATA.FIRST_QUESTION_ID)
                .then((response) => {
                  responseObject = response;
                }),
            );
        });
    });

    after(() => {
      clearSessionData();
    });

    it(
      "Busca resposta válida salva em uma sessão",
      { tags: [TAGS.SMOKE] },
      () => {
        expect(responseObject.status).to.eq(200);

        const data = responseObject.body.data;

        expect(data.finished).to.eq(false);
        expect(data.question.id).to.equal(TRACKS_TEST_DATA.FIRST_QUESTION_ID);
        expect(data.question.options).to.include(data.savedResponse);
      },
    );

    it(
      "Valida schema do response ao buscar resposta salva",
      { tags: [TAGS.SCHEMA] },
      () => {
        validateSchema({
          data: responseObject.body,
          schema: savedAnswerSchema,
          schemaName: "SavedAnswer",
        });
      },
    );
  });
});
