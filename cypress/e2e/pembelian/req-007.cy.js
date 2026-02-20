describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Mencari data pembelian berdasarkan nomor invoice", () => {
    const nomorInvoice = "PINV/0002";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get("[placeholder='Cari']").type(nomorInvoice);
    cy.contains("td", nomorInvoice).should("be.visible");
  });

  it.only("Mencari data pembelian berdasarkan nama supplier", () => {
    const supplier = "Rayhan Rayandra";
    cy.intercept("GET", "**/api/pembelian**").as("getPurchases");
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[placeholder="Cari"]').type(supplier);
    cy.wait("@getPurchases");
    cy.get("tbody tr").should("have.length.greaterThan", 0);
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).find("td").eq(2).should("contain.text", supplier);
    });
  });
});
