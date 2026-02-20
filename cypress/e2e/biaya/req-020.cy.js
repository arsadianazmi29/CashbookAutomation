describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("user belum login", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.url().should("include", "/login");
  });

  it.only("user sudah login", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("https://dev-cashbook.assist.id/");
    cy.url().should("include", "/auth/login");
    cy.get("#email").type("arsadianazmi323@gmail.com");
    cy.get("#password").type("azmiii29");
    cy.get('[data-testid="login-submit-button"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.url().should("include", "/admin/expenses");
  });
});
