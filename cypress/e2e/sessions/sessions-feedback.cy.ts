import { homePage } from "../../pages/home.page";
import { TAGS } from "../../support/constants/tags";

describe("Sessions — Feedback E2E", { tags: [TAGS.SESSIONS_FEEDBACK] }, () => {
  beforeEach(() => {
    homePage.visit();
    homePage.clickStartSimulation();
    homePage.questionnaire.completePath([0, 1]);
    homePage.result.clickOpenFeedback();
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
