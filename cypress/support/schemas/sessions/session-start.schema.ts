export const sessionStartSchema = {
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