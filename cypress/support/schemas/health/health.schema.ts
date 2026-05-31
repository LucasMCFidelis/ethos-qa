export const healthSchema = {
  description: "string",
  type: "object",
  properties: {
    status: { type: "string", enum: ["ok", "degraded"] },
    timestamp: { type: "string", format: "date-time" },
    services: {
      type: "object",
      properties: {
        database: { type: "string", enum: ["ok", "unreachable"] },
      },
    },
  },
};
