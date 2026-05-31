import { TracksClient } from "../../support/api-clients/TracksClient";
import { TAGS } from "../../support/constants/tags";
import { validateSchema } from "../../support/utils/validate-schema";

describe("Tracks API", { tags: [TAGS.TRACKS] }, () => {
  const tracksClient = new TracksClient();
  
  it(
    "ETHOS-7 Valida listagem das trilhas disponíveis",
    { tags: [TAGS.SMOKE] },
    () => {
      tracksClient.getTracks().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.tracks.length).to.be.greaterThan(0);
      });
    },
  );

  it(
    "ETHOS-8 Busca pergunta existente na trilha",
    { tags: [TAGS.SMOKE] },
    () => {
      let trackId: string;
      const questionId: string = "q1";
      tracksClient.getTracks().then((response) => {
        trackId = response.body.data.tracks[0].id;

        expect(trackId).to.not.equal(null);

        tracksClient.getQuestion(trackId, questionId).then((response) => {
          const responseData = response.body.data;
          expect(response.status).to.eq(200);
          expect(responseData.id).to.eq(questionId);
          expect(responseData.text).to.be.a("string");
          expect(responseData.options).to.be.a("object");
        });
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

      tracksClient.getTracks().then((response) => {
        const responseBody = response.body;
        validateSchema({ data: responseBody, schema, schemaName: "Tracks" });
      });
    },
  );
});
