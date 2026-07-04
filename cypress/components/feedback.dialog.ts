import { feedbackSelectors } from "../support/constants/selectors/feedback.selectors";

interface FeedbackData {
  rate: 1 | 2 | 3 | 4 | 5;
  useObjective: number;
  suggestion?: string;
}

export class FeedbackDialog {
  shouldBeVisible() {
    cy.get(feedbackSelectors.dialogContainer).should("be.visible");
  }

  submitButton() {
    return cy.get(feedbackSelectors.submitButton);
  }

  submitButtonShouldBeDisabled() {
    this.submitButton().should("be.disabled");
  }

  submitButtonShouldBeEnabled() {
    this.submitButton().should("not.be.disabled");
  }

  shouldShowSuccess() {
    cy.get(feedbackSelectors.successMessage).should("be.visible");
  }

  selectRate(value: 1 | 2 | 3 | 4 | 5) {
    cy.get(feedbackSelectors.rateButtons)
      .find('[type="button"]')
      .eq(value - 1)
      .click();
  }

  selectUseObjectiveByIndex(index: number) {
    cy.get(feedbackSelectors.useObjective).find("button").eq(index).click();
  }

  fillSuggestion(text: string) {
    cy.get(feedbackSelectors.suggestionInput).type(text);
  }

  clickSubmit() {
    this.submitButton().should("not.be.disabled").click();
  }

  submitFeedback(feedbackData: FeedbackData) {
    this.selectRate(feedbackData.rate);
    this.selectUseObjectiveByIndex(feedbackData.useObjective);
    this.fillSuggestion(feedbackData.suggestion || "");
    this.clickSubmit();
  }
}
