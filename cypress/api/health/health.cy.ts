describe("Health API", () => {
  it("should return 200", () => {
    const apiUrl = Cypress.expose("apiUrl");

    cy.request(`${apiUrl}/health`).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});