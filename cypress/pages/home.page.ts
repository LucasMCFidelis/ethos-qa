import { FeedbackDialog } from "../components/feedback.dialog";
import { QuestionnaireSection } from "../components/questionnaire.section";
import { ResultSection } from "../components/result.section";
import { homeSelectors } from "../support/constants/selectors/home.selectors";
import { saveSessionId } from "../support/utils/session-hooks-data";

class HomePage {
  public readonly questionnaire: QuestionnaireSection;
  public readonly result: ResultSection;
  public readonly feedback: FeedbackDialog;

  constructor() {
    this.questionnaire = new QuestionnaireSection();
    this.result = new ResultSection();
    this.feedback = new FeedbackDialog();
  }

  visit() {
    cy.visit("/");
  }

  heroButtonCTA() {
    return cy.get(homeSelectors.heroButtonCTA);
  }

  clickStartSimulation() {
    this.heroButtonCTA().click();
  }

  startAndSaveSessionId() {
    cy.intercept("GET", "**/simulation/tracks/*/start").as("sessionStarted");
    this.clickStartSimulation();
    cy.wait("@sessionStarted").then((interception) => {
      if (interception.response) {
        const sessionId = interception.response.body.data.sessionId;
        saveSessionId(sessionId);
      }
    });
  }
}

export const homePage = new HomePage();
