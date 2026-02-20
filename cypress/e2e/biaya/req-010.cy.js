describe("halaman biaya", () => {
  it("Populate data otomatis pada form biaya baru", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('[id="recipient"]').click();
    cy.get("#recipient-listbox").should("be.visible");
    cy.get('[data-option-index="3"]').click();
    cy.get("#recipient").should("have.value", "Rayhan Rayandra");
  });
});
