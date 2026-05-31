export const tracksSchema = {
  type: "object",
  description: "string",
  properties: {
    ok: { type: "boolean" },
    data: {
      type: "object",
      properties: {
        tracks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              description: { type: "string" },
            },
            required: ["id", "title", "description"],
          },
        },
      },
      required: ["tracks"],
    },
  },
  required: ["ok", "data"],
};
