import { homePage } from "../../pages/home.page";
import { RESULT_LABELS } from "../../support/constants/result-labels";
import { TAGS } from "../../support/constants/tags";
import { clearSessionData } from "../../support/utils/session-hooks-data";

describe("Sessions — Result E2E", { tags: [TAGS.SESSIONS_RESULTS] }, () => {
  beforeEach(() => {
    homePage.visit();
    homePage.startAndSaveSessionId();
  });

  afterEach(() => {
    clearSessionData();
  });

  it(
    "ETHOS-41 Responder questionário até resultado fora do escopo",
    { tags: [TAGS.REGRESSION] },
    () => {
      homePage.questionnaire.completePath(["negative"]);
      homePage.result.shouldBeVisible();
      homePage.result.resultLabel().contains(RESULT_LABELS.outOfScope);
    },
  );

  it(
    "ETHOS-42 Responder questionário até resultado positivo",
    { tags: [TAGS.REGRESSION] },
    () => {
      homePage.questionnaire.completePath([
        "positive",
        "positive",
        "positive",
        "negative",
        "negative",
      ]);
      homePage.result.shouldBeVisible();
      homePage.result.resultLabel().contains(RESULT_LABELS.acceptable);
    },
  );

  it(
    "ETHOS-43 Responder questionário até resultado moderado",
    { tags: [TAGS.REGRESSION] },
    () => {
      homePage.questionnaire.completePath([
        "positive",
        "positive",
        "positive",
        "negative",
        "positive",
      ]);
      homePage.result.shouldBeVisible();
      homePage.result.resultLabel().contains(RESULT_LABELS.moderate);
    },
  );

  it(
    "ETHOS-44 Responder questionário até resultado de alerta",
    { tags: [TAGS.REGRESSION] },
    () => {
      homePage.questionnaire.completePath(["positive", "doubt"]);
      homePage.result.shouldBeVisible();
      homePage.result.resultLabel().contains(RESULT_LABELS.highRisk);
    },
  );
});
