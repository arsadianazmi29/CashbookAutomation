describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("jika harga aset (0)", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get("#idSupplier").click();
    cy.get(".css-1scbymt").click();
    cy.get("#address").type("Jalan Pasar Minggu");
    cy.get("[id='pembelian.0.tipe_pembelian']").click();
    cy.get('[data-value="Aset"]').click();
    cy.get("[name='pembelian.0.product_name']").type("Mobil");
    cy.get("[id='pembelian.0.akun_pembelian_id']").click();
    cy.get('[data-value="ec83102f-201e-450d-8ab5-898a23b39ce9"]').click();
    cy.contains("Rp 0").should("be.visible");
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should("be.visible");
    cy.get(".MuiAlert-message").should(
      "have.text",
      "Mohon periksa kembali form"
    );
    cy.get(".MuiTableBody-root > :nth-child(1) > :nth-child(8)").should(
      "contain",
      "Harga aset harus lebih dari 0"
    );
  });

  it.only("potongan pembayaran harus lebih dari (0)", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-belum-dibayar"]').click();
    cy.get("td button").eq(0).click();
    cy.contains("Pilih Tindakan").click();
    cy.get('[data-value="payment"]').click();
    cy.inputkirimpembayaran();
    cy.get('[name="isPemotongan"]').click();
    cy.get('[name="potongan_value"]').should("be.visible").clear().type("0");
    cy.get('[id="potongan_nomor_akun"]').click();
    cy.get('[data-option-index="0"]').click();
    cy.contains("Buat Pembayaran").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "contain.text",
      "Mohon periksa kembali form"
    );
    cy.get(".css-4kffyu").should(
      "contain.text",
      "Nilai potongan harus lebih dari 0"
    );
  });
});
