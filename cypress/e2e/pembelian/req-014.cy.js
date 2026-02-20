describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Set harga barang", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    const harga = "12500";
    cy.get("[name='pembelian.0.price']").type(harga);
    cy.get("[name='pembelian.0.price']")
      .invoke("val")
      .should((v) => {
        expect(v).to.match(/^Rp (\d{1,3})(\.\d{3})+$/);
      });
  });
});
