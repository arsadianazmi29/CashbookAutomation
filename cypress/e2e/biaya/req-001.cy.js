describe("halaman biaya", () => {
  it("mengunjungi halaman biaya", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-expenses"]').should("be.visible");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.url().should("include", "/admin/expenses");
  });
});
