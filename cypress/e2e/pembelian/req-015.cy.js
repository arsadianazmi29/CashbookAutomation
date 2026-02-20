describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get(".MuiSkeleton-root").should("not.exist");
  });
  it("Upload file pada pembelian baru", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.isiinputinventory();
    cy.get('input[type="file"]').attachFile("meowww.jpg");
  });

  it("Upload File lampiran lebih dari 10 mb", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.isiinputinventory();
    cy.get('input[type="file"]').attachFile("12mb.jpg");
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "File melebihi batas maksimum 10 MB."
    );
  });

  it.only("upload file lampiran selain format :PDF,JPG,JPEG,PNG", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get(".css-aidtzz > .MuiButtonBase-root").click();
    cy.isiinputinventory();
    cy.get('input[type="file"]').attachFile("example.json");
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "File tidak valid. Hanya file dengan ekstensi .PDF, .JPG, .JPEG, .PNG yang diperbolehkan."
    );
  });
});
