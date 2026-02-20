describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Membatalkan menambah data biaya baru", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.contains("Batalkan").should("be.visible").click();
    cy.url().should("include", "/admin/expenses");
  });

  it("batal menambah pembayaran", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-belum-dibayar"]').click();
    cy.get("td button").eq(0).click();
    cy.contains("Pilih Tindakan").click();
    cy.get('[data-value="terimaPembayaran"]').click();
    cy.scrollTo("bottom");
    cy.contains("Batalkan").should("be.visible").click();
    cy.url().should("include", "/admin/expenses/detail");
  });

  it.only("batalkan void", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-belum-dibayar"]').click();
    cy.get("td button").eq(0).click();
    cy.get(".MuiBox-root > .MuiInputBase-root > .MuiSelect-select").click();
    cy.get('[data-value="void"]').click();
    cy.contains("Batalkan").should("be.visible").click();
    cy.url().should("include", "/admin/expenses/detail");
  });
});
