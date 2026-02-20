describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("ketika data tidak boleh hit api berkali-kali", () => {
    cy.intercept("POST", "**/api/pembelian**").as("databaru");
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".MuiSkeleton-root").should("not.exist");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.isiinputinventory();
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiButton-contained").should("be.disabled");
    cy.wait("@databaru");
    cy.get("@databaru.all").should("have.length", 1);
  });
});
