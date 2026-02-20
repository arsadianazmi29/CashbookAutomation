describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Lihat lampiran pada detail pembelian", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".MuiBox-root > .MuiButtonBase-root").click();
    cy.alltime();
    cy.get(".MuiGrid2-root > .MuiButton-contained").click();
    cy.get(".css-20tnkx > .MuiFormControl-root > .MuiInputBase-root").type(
      "PINV/0013"
    );
    cy.contains("td", "PINV/0013").click();
    cy.url().should("include", "/admin/purchases/detail");
    cy.get(
      ".css-18ouwo4 > .MuiCardContent-root > .MuiGrid2-container > :nth-child(2) > .MuiList-root > .MuiListItem-root > .MuiListItemText-root > .MuiTypography-body2"
    ).should("be.visible");
    cy.get(".MuiTypography-body2 > img").click();
  });
});
