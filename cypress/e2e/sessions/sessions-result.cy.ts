import { homePage } from "../../pages/home.page";
import { RESULT_LABELS } from "../../support/constants/result-labels";
import { TAGS } from "../../support/constants/tags";

describe("Sessions — Result E2E", { tags: [TAGS.SESSIONS_RESULTS] }, () => {
  beforeEach(() => {
    homePage.visit();
    homePage.clickStartSimulation();
  });

  it(
    "ETHOS-41 Responder questionário até resultado fora do escopo",
    { tags: [TAGS.REGRESSION] },
    () => {
      homePage.questionnaire.completePath([1]);
      homePage.result.shouldBeVisible();
      homePage.result.resultLabel().contains(RESULT_LABELS.outOfScope);
    },
  );
});
