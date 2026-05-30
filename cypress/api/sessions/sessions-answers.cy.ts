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

const TRACK_ID = "confidencialidade";
const FIRST_QUESTION_ID = "q1";
const VALID_ANSWER_SIM = "sim";
const VALID_ANSWER_NAO = "nao";

const sessionStartSchema = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        sessionId: { type: "string", format: "uuid" },
        finished: { type: "boolean" },
        maxQuestions: { type: "number" },
        question: {
          type: "object",
          properties: {
            id: { type: "string" },
            text: { type: "string" },
            options: { type: "array", items: { type: "string" } },
          },
          required: ["id", "text", "options"],
        },
      },
      required: ["sessionId", "finished", "maxQuestions", "question"],
    },
  },
  required: ["ok", "data"],
};

const answerNextQuestionSchema = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        finished: { type: "boolean" },
        question: {
          type: "object",
          properties: {
            id: { type: "string" },
            text: { type: "string" },
            options: { type: "array", items: { type: "string" } },
          },
          required: ["id", "text", "options"],
        },
      },
      required: ["finished", "question"],
    },
  },
  required: ["ok", "data"],
};

const answerFinishSchema = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        finished: { type: "boolean" },
        result: {
          type: "object",
          properties: {
            key: { type: "string" },
            label: { type: "string" },
            description: { type: "string" },
            actions: { type: "array" },
          },
          required: ["key", "label", "description", "actions"],
        },
      },
      required: ["finished", "result"],
    },
  },
  required: ["ok", "data"],
};

const savedAnswerSchema = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        finished: { type: "boolean" },
        question: {
          type: "object",
          properties: {
            id: { type: "string" },
            text: { type: "string" },
            options: { type: "array", items: { type: "string" } },
          },
          required: ["id", "text", "options"],
        },
        savedResponse: { type: "string" },
      },
      required: ["finished", "question", "savedResponse"],
    },
  },
  required: ["ok", "data"],
};

describe("Sessions — Answers API", { tags: [TAGS.SESSIONS_ANSWERS] }, () => {
  const tracksClient = new TracksClient();
  const sessionsClient = new SessionsClient();

  describe("ETHOS-13", () => {
    let responseObject: Cypress.Response<SessionStartResponse>;

    before(() => {
      tracksClient.startSession(TRACK_ID).then((response) => {
        responseObject = response;
      });
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
        expect(data.question.id).to.equal(FIRST_QUESTION_ID);
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
      tracksClient.startSession(TRACK_ID).then((startResponse) => {
        const sessionId = startResponse.body.data.sessionId;

        return sessionsClient
          .answerQuestion(sessionId, FIRST_QUESTION_ID, VALID_ANSWER_SIM)
          .then((response) => {
            responseObject =
              response as Cypress.Response<AnswerNextQuestionResponse>;
          });
      });
    });

    it(
      "Envio de resposta válida retorna próxima pergunta",
      { tags: [TAGS.SMOKE] },
      () => {
        expect(responseObject.status).to.eq(200);

        const data = responseObject.body.data;

        expect(data.finished).to.eq(false);
        expect(data.question?.id).to.not.equal(FIRST_QUESTION_ID);
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
      tracksClient.startSession(TRACK_ID).then((startResponse) => {
        const sessionId = startResponse.body.data.sessionId;

        return sessionsClient
          .answerQuestion(sessionId, FIRST_QUESTION_ID, VALID_ANSWER_NAO)
          .then((response) => {
            responseObject = response as Cypress.Response<AnswerFinishResponse>;
          });
      });
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
      tracksClient.startSession(TRACK_ID).then((startResponse) => {
        const sessionId = startResponse.body.data.sessionId;

        return sessionsClient
          .answerQuestion(sessionId, FIRST_QUESTION_ID, VALID_ANSWER_SIM)
          .then(() =>
            sessionsClient
              .getSavedAnswer(sessionId, FIRST_QUESTION_ID)
              .then((response) => {
                responseObject = response;
              }),
          );
      });
    });

    it(
      "Busca resposta válida salva em uma sessão",
      { tags: [TAGS.SMOKE] },
      () => {
        expect(responseObject.status).to.eq(200);

        const data = responseObject.body.data;

        expect(data.finished).to.eq(false);
        expect(data.question.id).to.equal(FIRST_QUESTION_ID);
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
