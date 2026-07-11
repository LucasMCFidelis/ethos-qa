import { homePage } from "../../pages/home.page";
import { TAGS } from "../../support/constants/tags";
import { clearSessionData } from "../../support/utils/session-hooks-data";

describe("Sessions — Feedback E2E", { tags: [TAGS.SESSIONS_FEEDBACK] }, () => {
  beforeEach(() => {
    homePage.visit();
    homePage.startAndSaveSessionId();
    homePage.questionnaire.completePath([0, 1]);
    homePage.result.clickOpenFeedback();
  });

  afterEach(() => {
    clearSessionData();
  });

  it(
    "ETHOS-49 Enviar feedback sobre o resultado da simulação",
    { tags: [TAGS.REGRESSION] },
    () => {
      homePage.feedback.shouldBeVisible();
      homePage.feedback.submitFeedback({
        rate: 4,
        useObjective: 0,
        suggestion: "Teste",
      });
      homePage.feedback.shouldShowSuccess();
    },
  );
});
