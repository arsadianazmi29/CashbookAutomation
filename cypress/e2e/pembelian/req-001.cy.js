describe("halaman pembelian", () => {
  it("mengunjungi halaman pembelian", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-purchases"]').should("be.visible");
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.url().should("include", "/admin/purchases");
  });
});
