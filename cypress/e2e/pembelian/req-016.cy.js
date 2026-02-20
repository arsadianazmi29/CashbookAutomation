describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Value jumlah harga per item berdasarkan Qty & Diskon", () => {
    const qty = 2;
    const harga = 12000;
    const diskon = 5;

    const subtotal = qty * harga;
    const totalDiskon = subtotal * (diskon / 100);
    const totalAkhir = subtotal - totalDiskon;
    function totalrupiah(num) {
      return "Rp " + new Intl.NumberFormat("id-ID").format(num);
    }
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.get("#idSupplier").click();
    cy.get(".css-1scbymt").click();
    cy.get("#address").type("Jalan Pasar Minggu");
    cy.get("[id='pembelian.0.tipe_pembelian']").click();
    cy.get('[data-value="Inventory"]').click();
    cy.get("[id='pembelian.0.product_id']").click();
    cy.get(".css-1scbymt").click();
    cy.get("[id='pembelian.0.gudang_id']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[name='pembelian.0.quantity']").type(qty);
    cy.get("[id='pembelian.0.unit']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[id='pembelian.0.akun_pembelian_id']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[ name='pembelian.0.price']").type(harga);
    cy.get("[ name='pembelian.0.discount']").type(diskon);
    cy.get("[ name='pembelian.0.total']").should(
      "have.value",
      totalrupiah(totalAkhir),
    );
  });
  //
  it.only("Jatuh Tempo otomatis berubah sesuai Syarat Pembayaran (Termin)", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".MuiSkeleton-root").should("not.exist");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type("24112025");
    cy.get("#paymentTerms").click();
    cy.get("#_r_2r_ > :nth-child(3)").click();
    cy.get('[placeholder="DD/MM/YYYY"]')
      .eq(1)
      .should("have.value", "24/12/2025");
  });
});
