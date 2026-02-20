describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Breadcrumbs hal pembelian dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.url().should("include", "/admin/purchases");
    cy.get(".MuiBreadcrumbs-ol").should("be.visible");
    cy.get(".MuiBreadcrumbs-ol > :nth-child(1) > .MuiTypography-root").click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("Breadcrumbs hal pembelian baru dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.url().should("include", "/admin/purchases/create");
    cy.get(":nth-child(3) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/purchases");
  });

  it("Breadcrumbs detail pembelian dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("td button").eq(0).click();
    cy.url().should("include", "/admin/purchases/detail");
    cy.get(":nth-child(3) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/purchases");
  });

  it("Breadcrumbs detail pembayaran dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-dibayar-sebagian"]').click();
    cy.get("td button").eq(0).click();
    cy.get("td button").eq(0).click();
    cy.url().should("include", "/admin/purchases/detail/payment");
    cy.get(":nth-child(5) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/purchases/detail");
  });
});
