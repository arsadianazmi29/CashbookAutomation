describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Menampilkan pesan “Tidak ada data", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".css-20tnkx > .MuiFormControl-root > .MuiInputBase-root")
      .click()
      .type("lala");
    cy.get(
      ".MuiTableBody-root > .MuiTableRow-root > .MuiTableCell-root"
    ).should("have.text", "Tidak ada data");
  });

  it("intercept di pembelian", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.intercept("GET", "**/api/pembelian**", {
      statusCode: 200,
      body: {
        totalData: 0,
        results: [],
      },
    }).as("dataPembelian");
    cy.reload();
    cy.wait("@dataPembelian");
    cy.get("td").should("have.text", "Tidak ada data");
  });
});
