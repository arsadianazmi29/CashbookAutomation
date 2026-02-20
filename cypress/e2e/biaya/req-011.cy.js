describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("Form berhasil tersimpan jika seluruh input wajib telah terisi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarulunas();
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "berhasil menambahkan biaya baru",
    );
  });

  it("Validasi input wajib diisi pada form biaya baru jika tidak diisi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.contains("Konfirmasi Simpan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Periksa input yang wajib diisi.",
    );
  });
});
