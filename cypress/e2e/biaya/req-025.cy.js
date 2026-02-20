describe("halaman biaya", () => {
  it("ketika data tidak boleh hit api berkali-kali", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.intercept("POST", "**/api/biayas**").as("databaru");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarulunas();
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@databaru");
    cy.get("@databaru.all").should("have.length", 1);
  });
});
