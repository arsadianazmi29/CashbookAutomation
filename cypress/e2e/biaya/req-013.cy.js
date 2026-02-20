describe("halaman biaya", () => {
  it("Menambah dan menghapus baris item pada form biaya", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.contains("Baris Baru").click();
    cy.get(".MuiTableBody-root > :nth-child(2) >").should("be.visible");
    cy.get(":nth-child(2) > .css-1dnk9te > .MuiButtonBase-root")
      .click()
      .should("not.exist");
  });
});
