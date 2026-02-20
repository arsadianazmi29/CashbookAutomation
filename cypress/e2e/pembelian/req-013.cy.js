describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Validasi input wajib diisi pada form pembelian baru", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.isiinputinventory();
    // cy.get(".MuiButton-contained").click();
    // cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Pembelian berhasil ditambahkan"
    );
  });

  it.only("Validasi input wajib diisi pada form pembelian baru jika tidak diisi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should("be.visible");
    cy.get(".MuiAlert-message").should(
      "have.text",
      "Mohon periksa kembali form"
    );
  });
});
