describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Upload File pada biaya baru", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('input[type="file"]').attachFile("meowww.jpg");
    cy.contains("meowww.jpg").should("exist");
  });

  it("Upload file pada biaya baru melebihi 10 mb", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('input[type="file"]').attachFile("12mb.jpg");
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "File melebihi batas maksimum 10 MB.",
    );
  });

  it("Upload file pada biaya baru dengan format yang tidak sesuai ketentuan", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('input[type="file"]').attachFile("example.json");
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "File tidak valid. Hanya file dengan ekstensi .PDF, .JPG, .JPEG, .PNG yang diperbolehkan.",
    );
  });

  it.only("Menambahkan catatan", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('[id="note"]').type("qwertyuiopasdfghjklzxcvbnm");
  });
});
