describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("lihat lampiran pada detail biaya", () => {
    const lampiran = "BINV/0042";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[placeholder="Cari Biaya"]').type(lampiran);
    cy.contains("td", lampiran).click();
    cy.get(".css-1n5khr6 > .MuiButtonBase-root").click();
    cy.get(".MuiPaper-root > img").should("be.visible");
  });

  it.only("Menampilkan catatan pada detail biaya", () => {
    const catatan = "BINV/0131";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[placeholder="Cari Biaya"]').type(catatan);
    cy.contains("td", catatan).click();
    cy.get(".css-unbmco").should("be.visible");
  });
});
