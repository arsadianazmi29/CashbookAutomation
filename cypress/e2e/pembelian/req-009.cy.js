describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("menampilkan pagination pada tabel pembelian", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.scrollTo("bottom");
    cy.get(".MuiPaper-elevation > .MuiStack-root").should("be.visible");
    cy.get(".MuiPagination-ul li").should("be.visible");
  });
});
