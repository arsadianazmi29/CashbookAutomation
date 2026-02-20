describe("halaman pembelian", () => {
  it("Validasi user belum login", () => {
    // session kosong
    cy.clearCookies();
    cy.clearLocalStorage();
    // Coba akses halaman yang butuh login
    cy.visit("https://dev-cashbook.assist.id/admin/purchases");
    cy.url().should("include", "/login");
  });

  it.only("Validasi login user (sudah login)", () => {
    cy.visit("https://dev-cashbook.assist.id/");
    cy.get("#email").type("arsadianazmi323@gmail.com");
    cy.get("#password").type("azmiii29");
    cy.get('[data-testid="login-submit-button"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("https://dev-cashbook.assist.id/admin/purchases");
    cy.url().should("include", "/admin/purchases");
  });
});
