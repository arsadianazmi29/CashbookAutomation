describe("halaman biaya", () => {
  it("Menampilkan skeleton loading pada menu bayar", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".MuiSkeleton-root").should("be.visible");
  });
});
