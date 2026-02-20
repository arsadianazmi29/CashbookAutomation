describe("halaman biaya", () => {
  it("menampilkan pagination pada tabel biaya", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="pagination-label"]').should("be.visible");
  });
});
