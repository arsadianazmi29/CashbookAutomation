describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Mencari data bayar berdasarkan nomor Unique ", () => {
    const nomorInvoice = "BINV/0033";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[placeholder="Cari Biaya"]').type(nomorInvoice);
    cy.contains("td", nomorInvoice).should("be.visible");
  });

  it.only("hasil search sesuai dengan nama pelanggan", () => {
    const namaPelanggan = "Raska Zhidanind Ramadhan";
    cy.intercept("GET", "**/api/biayas**").as("databiaya");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("input[placeholder='Cari Biaya']").clear().type(namaPelanggan);
    cy.wait("@databiaya");
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    cy.get("table tbody tr td:nth-child(3)").each(($td) => {
      cy.wrap($td).invoke("text").should("contain", namaPelanggan);
    });
  });
});
