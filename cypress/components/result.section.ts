import { resultSelectors } from "../support/constants/selectors/result.selectors";

export class ResultSection {
  shouldBeVisible() {
    cy.get(resultSelectors.container).should("be.visible");
  }

  shouldShowLabel() {
    cy.get(resultSelectors.label)
      .should("be.visible")
      .and("not.be.empty");
  }

  shouldShowDescription() {
    cy.get(resultSelectors.description)
      .should("be.visible")
      .and("not.be.empty");
  }

  shouldShowActionsList() {
    cy.get(resultSelectors.actionsList)
      .should("be.visible")
      .find("li")
      .should("have.length.above", 0);
  }

  shouldNotShowActionsList() {
    cy.get(resultSelectors.actionsList).should("not.exist");
  }

  clickRestart() {
    cy.get(resultSelectors.restartButton).click();
  }

  clickOpenFeedback() {
    cy.get(resultSelectors.openFeedbackButton).click();
  }
}
