import { HealthClient } from "../../support/api-clients/HealthClient";
import { TAGS } from "../../support/constants/tags";
import { healthSchema } from "../../support/schemas/health/health.schema";
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
      healthClient.getHealth().then((response) => {
        const responseBody = response.body;
        validateSchema({
          data: responseBody,
          schema: healthSchema,
          schemaName: "Health",
        });
      });
    },
  );
});
