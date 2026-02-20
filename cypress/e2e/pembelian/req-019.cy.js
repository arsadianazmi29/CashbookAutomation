describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("Menambahkan pembelian baru", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get("[ name='pembelian.0.price']").type("10000");
    cy.get("[ name='pembelian.0.discount']").type("8");
    // cy.get(".MuiButton-contained").click();
    // cy.get('[data-testid="alert-dialog-submit-button"]').click();
    // cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
    //   "have.text",
    //   "Pembelian berhasil ditambahkan"
    // );
  });
});
