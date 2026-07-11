import { homePage } from "../../pages/home.page";
import { TAGS } from "../../support/constants/tags";
import { clearSessionData } from "../../support/utils/session-hooks-data";

describe("Sessions — Answers E2E", { tags: [TAGS.SESSIONS_ANSWERS] }, () => {
  beforeEach(() => {
    homePage.visit();
    homePage.startAndSaveSessionId();
  });

  afterEach(() => {
    clearSessionData();
  });

  it("ETHOS-33 Iniciar simulação com sucesso", { tags: [TAGS.SMOKE] }, () => {
    homePage.questionnaire.shouldBeVisible();
  });
});
