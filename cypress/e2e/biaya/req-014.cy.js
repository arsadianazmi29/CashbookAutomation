describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("Menambahkan biaya baru dengan status belum dibayar", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarubelumdibayar();
    cy.get('[name="details.0.amount"]').type("12000");
    cy.intercept("POST", "**/api/biayas**").as("databaru");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@databaru", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      const status = response.body.status;
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "have.text",
        "Berhasil Menambahkan Data Biaya Baru.",
      );
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", status);
    });
  });

  it.only("Menambahkan biaya baru dengan status lunas", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarulunas();
    cy.intercept("POST", "**/api/biayas**").as("databaru");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@databaru", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      const status = response.body.status;
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "have.text",
        "Berhasil Menambahkan Data Biaya Baru.",
      );
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", status);
    });
  });
});
