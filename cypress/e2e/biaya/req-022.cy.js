describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("Sistem menolak Pemotongan pada biaya baru  jika diisi 0", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarulunas();
    cy.get('[name="is_discount"]').click();
    cy.get('[data-testid="expenses-summary-discount-value"]').should(
      "have.value",
      "0",
    );
    cy.contains("Konfirmasi Simpan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Periksa input yang wajib diisi.",
    );
    cy.get(".css-axw7ok").should(
      "contain.text",
      "Nilai diskon harus lebih dari 0",
    );
  });

  it.only("Sistem menolak Pemotongan pada pembayaran  jika diisi 0", () => {
    const noPelanggan = "BINV/0118";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get('[placeholder="Cari Biaya"]').type(noPelanggan);
    cy.contains("td", noPelanggan).click();
    cy.get(".MuiSelect-select > span").click();
    cy.get('[data-value="terimaPembayaran"]').scrollIntoView().click();
    cy.get('[id="metode"]').click();
    cy.get('[data-value="tunai"]').click();
    cy.get('[data-testid="input-nomor_akun"]').click();
    cy.get('[data-option-index="0"]').click();
    cy.get('[name="isPemotongan"]').click();
    cy.get('[name="potongan_value"]').should("have.value", "0");
    cy.contains("Buat Pembayaran").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Mohon periksa kembali form",
    );
    cy.contains("Nilai potongan harus lebih dari 0").should("be.visible");
  });
});
