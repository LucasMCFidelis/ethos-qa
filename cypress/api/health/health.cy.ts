describe("Health API", () => {
  it("should return 200", { tags: ["@regression", "@critical"] }, () => {
    const apiUrl = Cypress.expose("apiUrl");

    cy.request(`${apiUrl}/health`).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
  it("should return 200", { tags: ["@critical"] }, () => {
    const apiUrl = Cypress.expose("apiUrl");

    cy.request(`${apiUrl}/health`).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
