export const sessionResultSchema = {
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
            action_type: { type: "string" },
            level: { type: "string" },
            actions: { type: "array" },
          },
          required: [
            "key",
            "label",
            "description",
            "action_type",
            "level",
            "actions",
          ],
        },
      },
      required: ["finished", "result"],
    },
  },
  required: ["ok", "data"],
};
