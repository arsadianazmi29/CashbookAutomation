describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Membatalkan pengisan form pembelian baru dan menampilkan konfirmasi pembatalan", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.isiinputinventory();
    cy.get(".css-1jszewn > .MuiButton-text").click();

    // tidak ada konfirmasi pembatalan
    cy.url().should("include", "/admin/purchases");
  });
});
