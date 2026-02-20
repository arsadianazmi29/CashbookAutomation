describe("halaman pembelian", () => {
  it("Tab status pembelian berfungsi", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();

    cy.cekstatus("Belum Dibayar");
    cy.cekstatus("Jatuh Tempo");
    cy.cekstatus("Lunas");
    cy.cekstatus("Dibayar Sebagian");
    cy.cekstatus("Void");
  });
});
