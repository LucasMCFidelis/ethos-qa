import { homePage } from "../../pages/home.page";
import { TAGS } from "../../support/constants/tags";

describe("Sessions — Answers E2E", { tags: [TAGS.SESSIONS_ANSWERS] }, () => {
  beforeEach(() => {
    homePage.visit();
    homePage.clickStartSimulation();
  });

  it("ETHOS-33 Iniciar simulação com sucesso", { tags: [TAGS.SMOKE] }, () => {
    homePage.questionnaire.shouldBeVisible();
  });
});
