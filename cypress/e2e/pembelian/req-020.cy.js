describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
  });

  it.only("Melihat detail nomor pembelian", () => {
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get(".MuiGrid2-root > .MuiButton-contained").click();
    cy.get("[placeholder='Cari']").type("PINV/0016");
    cy.contains("td", "PINV/0016").click();
    cy.url().should("include", "/admin/purchases/detail");
  });

  it("view detail kontak supplier", () => {
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get(".MuiGrid2-root > .MuiButton-contained").click();
    cy.get("[placeholder='Cari']").type("Rayhan Rayandra");
    cy.get(
      ":nth-child(1) > :nth-child(3) > span > a > .MuiButtonBase-root"
    ).click();
    cy.get(
      ":nth-child(2) > .MuiCardContent-root > .MuiGrid2-container > :nth-child(1) > .MuiList-root > :nth-child(1) > .MuiListItemText-root > .MuiTypography-body2"
    ).should("have.text", "Rayhan Rayandra");
    cy.url().should("include", "/admin/contacts");
  });
});
