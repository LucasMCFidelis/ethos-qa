export const questionnaireSelectors = {
  container: '[data-test="questionnaire-container"]',
  progressText: '[data-test="questionnaire-progress-text"]',
  questionText: '[data-test="questionnaire-question-text"]',
  answerOptions: '[data-test="questionnaire-answer-option"]',
  nextButton: '[data-test="questionnaire-button-next"]',
  closeButton: '[data-test="questionnaire-button-close"]',
  answerOptionByIndex: (index: number) =>
    `[data-test="questionnaire-answer-option"][data-test-index="${index}"]`,
  answerOptionByValue: (value: string) =>
    `[data-test="questionnaire-answer-option"][data-test-value="${value}"]`,
};
