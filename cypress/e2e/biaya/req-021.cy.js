describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("nomor pelanggan tidak duplikat", () => {
    const pelanggan = "BINV/0079";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('[id="transaction_number"]').type(pelanggan);
    cy.biayabarulunas();
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      'Gagal menyimpan data biaya, "Nomor invoice BINV/0079 sudah ada. "',
    );
  });

  it.only("Nomor transaksi tidak boleh duplikat", () => {
    const noPelanggan = "BINV/0118";
    const noTransaksi = "PBINV/0033";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get('[placeholder="Cari Biaya"]').type(noPelanggan);
    cy.contains("td", noPelanggan).click();
    cy.get(".MuiSelect-select > span").click();
    cy.get('[data-value="terimaPembayaran"]').scrollIntoView().click();
    cy.get('[id="nomor_transaksi"]').type(noTransaksi);
    cy.get('[id="metode"]').click();
    cy.get('[data-value="tunai"]').click();
    cy.get('[data-testid="input-nomor_akun"]').click();
    cy.get('[data-option-index="0"]').click();
    cy.contains("Buat Pembayaran").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "contain.text",
      "Gagal menambahkan pembayaran",
    );
  });
});
