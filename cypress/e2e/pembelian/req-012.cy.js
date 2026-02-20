describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Populate data otomatis pada form pembelian baru", () => {
    const supplier = "Rayhan Rayandra";
    const produk = "SKU-000001 - GARAM CINA";

    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get("#idSupplier").click();
    cy.get("#idSupplier-listbox").should("contain", supplier);
    cy.get(".css-1scbymt").click();

    cy.get("[id='pembelian.0.tipe_pembelian']").click();
    cy.get('[data-value="Inventory"]').click();
    cy.get("[id='pembelian.0.product_id']").click();
    cy.contains(produk).should("contain", produk);
    cy.get(".css-1scbymt").click();
  });

  it.only("Tidak bisa kirim pembayaran jika invoice sudah lunas", () => {
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get('[data-testid="tab-lunas"]').click();
    cy.get("td button").eq(0).click();
    cy.get(".MuiSelect-select > span").click();
    cy.contains("Kirim Pembayaran")
      .should("be.visible")
      .and("have.class", "Mui-disabled");
  });
});
