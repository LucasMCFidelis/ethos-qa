import { TAGS } from "../../support/constants/tags";
import { getApiUrl } from "../../support/utils/get-api-url";
import { validateSchema } from "../../support/utils/validate-schema";

describe("Tracks API", { tags: [TAGS.TRACKS] }, () => {
  it(
    "ETHOS-7 Valida listagem das trilhas disponíveis",
    { tags: [TAGS.SMOKE] },
    () => {
      const apiUrl = getApiUrl();

      cy.request(`${apiUrl}/simulation/tracks`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.tracks.length).to.be.greaterThan(0);
      });
    },
  );

  it(
    "ETHOS-32 Valida schema do response da listagem de trilhas",
    { tags: [TAGS.SCHEMA] },
    () => {
      const schema = {
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

      const apiUrl = getApiUrl();

      cy.request(`${apiUrl}/simulation/tracks`).then((response) => {
        const responseBody = response.body;
        validateSchema({ data: responseBody, schema, schemaName: "Tracks" });
      });
    },
  );
});
