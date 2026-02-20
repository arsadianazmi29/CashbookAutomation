describe("halaman biaya", () => {
  it("Tab status bayar menampilkan data sesuaai status", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();

    cy.cekstatus("Belum Dibayar");
    cy.cekstatus("Jatuh Tempo");
    cy.cekstatus("Lunas");
    cy.cekstatus("Dibayar Sebagian");
    cy.cekstatus("Void");
  });
});
