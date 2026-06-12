import { questionnaireSelectors } from "../support/constants/selectors/questionnaire.selectors";

export class QuestionnaireSection {
  shouldBeVisible() {
    cy.get(questionnaireSelectors.container).should("be.visible");
  }

  shouldShowProgress(current: number, total: number) {
    cy.get(questionnaireSelectors.progressText).should(
      "contain.text",
      `${current} de ${total}`,
    );
  }

  shouldShowQuestion() {
    cy.get(questionnaireSelectors.questionText).should("be.visible");
  }

  shouldShowAnswerOptions() {
    cy.get(questionnaireSelectors.answerOptions).should("have.length.above", 0);
  }

  shouldHaveSelectedAnswer(index: number) {
    cy.get(questionnaireSelectors.answerOptionByIndex(index)).should(
      "have.attr",
      "aria-pressed",
      "true",
    );
  }

  nextButton() {
    return cy.get(questionnaireSelectors.nextButton);
  }

  nextButtonShouldBeDisabled() {
    this.nextButton().should("be.disabled");
  }

  nextButtonShouldBeEnabled() {
    this.nextButton().should("not.be.disabled");
  }

  selectAnswerByIndex(index: number) {
    cy.get(questionnaireSelectors.answerOptionByIndex(index)).click();
  }

  clickNext() {
    this.nextButtonShouldBeEnabled();
    this.nextButton().click();
  }

  clickClose() {
    cy.get(questionnaireSelectors.closeButton).click();
  }

  answerAndNext(answerIndex: number) {
    this.selectAnswerByIndex(answerIndex);
    this.clickNext();
  }

  completePath(answerIndices: number[]) {
    answerIndices.forEach((index, step) => {
      this.selectAnswerByIndex(index);
      if (step < answerIndices.length - 1) {
        this.clickNext();
      }
    });
    this.clickNext();
  }
}
