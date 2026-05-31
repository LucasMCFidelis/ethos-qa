export const feedbackSchema = {
  type: "object",
  properties: {
    ok: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        sessionId: { type: "string", format: "uuid" },
        rate: { type: "number" },
        useObjective: { type: "string" },
        suggestion: { type: ["string", "null"] },
        createdAt: { type: "string", format: "date-time" },
      },
      required: ["sessionId", "rate", "useObjective", "createdAt"],
    },
  },
  required: ["ok", "data"],
};
