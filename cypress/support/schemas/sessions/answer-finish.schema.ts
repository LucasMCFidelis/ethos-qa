export const answerFinishSchema = {
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
