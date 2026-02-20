describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("TC-0029 : Pastikan nomor pembelian yang dibuat selalu unik dan tidak duplikat", () => {
    const data = "PINV/0018";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.get("#nomor").type(data);
    cy.isiinputinventory();
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      'Pembelian gagal ditambahkan, "Nomor pembelian sudah digunakan"'
    );
  });
});
