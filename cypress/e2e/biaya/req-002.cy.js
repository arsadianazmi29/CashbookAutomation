describe("Breadcrumbs hal biaya ", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Breadcrumbs hal biaya dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".MuiBreadcrumbs-ol > :nth-child(1) > .MuiTypography-root")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("Breadcrumbs  biaya baru dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get(":nth-child(3) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/expenses");
  });

  it("Breadcrumbs  Detail biaya  dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get("td button").eq(0).click();
    cy.get(":nth-child(3) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/expenses");
  });

  it("Breadcrumbs  Detail pembayaran dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-lunas"]').click();
    cy.get("td button").eq(0).click();
  });
});
