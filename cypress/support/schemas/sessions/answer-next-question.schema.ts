export const answerNextQuestionSchema = {
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
