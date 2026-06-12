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

  it(
    "ETHOS-42 Responder questionário até resultado positivo",
    { tags: [TAGS.REGRESSION] },
    () => {
      homePage.questionnaire.completePath([0, 0, 0, 1, 1]);
      homePage.result.shouldBeVisible();
      homePage.result.resultLabel().contains(RESULT_LABELS.acceptable);
    },
  );

  it(
    "ETHOS-43 Responder questionário até resultado moderado",
    { tags: [TAGS.REGRESSION] },
    () => {
      homePage.questionnaire.completePath([0, 0, 0, 1, 0]);
      homePage.result.shouldBeVisible();
      homePage.result.resultLabel().contains(RESULT_LABELS.moderate);
    },
  );

  it(
    "ETHOS-44 Responder questionário até resultado de alerta",
    { tags: [TAGS.REGRESSION] },
    () => {
      homePage.questionnaire.completePath([0, 1]);
      homePage.result.shouldBeVisible();
      homePage.result.resultLabel().contains(RESULT_LABELS.highRisk);
    },
  );
});
