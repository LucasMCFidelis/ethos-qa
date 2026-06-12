import { FeedbackDialog } from "../components/feedback.dialog";
import { QuestionnaireSection } from "../components/questionnaire.section";
import { ResultSection } from "../components/result.section";
import { homeSelectors } from "../support/constants/selectors/home.selectors";

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
}

export const homePage = new HomePage();
