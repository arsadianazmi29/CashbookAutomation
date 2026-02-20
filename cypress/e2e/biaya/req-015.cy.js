describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Mengunjungi detail biaya ", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("td button").eq(0).click();
    cy.url().should("include", "/admin/expenses/detail");
  });

  it("Mengunjungi detail kontak pelanggan", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("td button").eq(1).click();
    cy.get('[data-testid="admin-layout-page-title"] > span').should(
      "contain.text",
      "Detail Kontak",
    );
  });
});
