describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("Menambah dan menghapus baris item pada form pembelian baru", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.contains("Baris Baru").click();
    cy.get(".MuiTableBody-root > :nth-child(2) >").should("be.visible");
    cy.get(":nth-child(2) > .css-1dnk9te > .MuiButtonBase-root")
      .click()
      .should("not.exist");
  });
});
