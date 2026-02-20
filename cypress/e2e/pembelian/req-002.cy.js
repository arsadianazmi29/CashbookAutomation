describe("REQ-002 - Skeleton loading saat fetch data", () => {
  it("Menampilkan skeleton saat data fetch", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get(".MuiSkeleton-root").should("be.visible");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
  });
});
