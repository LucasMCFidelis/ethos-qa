import { HealthClient } from "../../support/api-clients/HealthClient";
import { TAGS } from "../../support/constants/tags";
import { validateSchema } from "../../support/utils/validate-schema";

describe("Health API", { tags: [TAGS.HEALTH] }, () => {
  const healthClient = new HealthClient();

  it("ETHOS-5 monitoramento API funcionando", { tags: [TAGS.SMOKE] }, () => {
    healthClient.getHealth().then((response) => {
      const responseBody = response.body;
      expect(response.status).to.eq(200);
      expect(responseBody.status).to.eql("ok");
      expect(responseBody.services.database).to.eql("ok");
    });
  });

  it(
    "ETHOS-31 Valida schema do response do endpoint",
    { tags: [TAGS.SCHEMA] },
    () => {
      const schema = {
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

      healthClient.getHealth().then((response) => {
        const responseBody = response.body;
        validateSchema({ data: responseBody, schema, schemaName: "Health" });
      });
    },
  );
});
