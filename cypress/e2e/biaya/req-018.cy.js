describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("Kirim pembayaran sebagian", () => {
    const jumlah = "10000";
    const bayar = "5000";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarubelumdibayar();
    cy.get('[name="details.0.amount"]').type(jumlah);
    cy.intercept("POST", "**/api/biayas**").as("sebagian");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@sebagian", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", transaction).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.get('[data-value="terimaPembayaran"]').scrollIntoView().click();
      cy.get('[id="metode"]').click();
      cy.get('[data-value="tunai"]').click();
      cy.get('[data-testid="input-nomor_akun"]').click();
      cy.get('[data-option-index="0"]').click();
      cy.get('[name="sub_total"]').type(bayar);
      cy.contains("Buat Pembayaran").click();
      cy.contains("Lanjutkan").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Pembayaran berhasil ditambahkan",
      );
      cy.get('[data-testid="tab-dibayar-sebagian"]').click();
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", "Dibayar Sebagian");
    });
  });

  it("Kirim pembayaran lunas", () => {
    const jumlah = "10000";
    const bayar = "10000";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarubelumdibayar();
    cy.get('[name="details.0.amount"]').type(jumlah);
    cy.intercept("POST", "**/api/biayas**").as("lunas");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@lunas", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", transaction).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.get('[data-value="terimaPembayaran"]').scrollIntoView().click();
      cy.get('[id="metode"]').click();
      cy.get('[data-value="tunai"]').click();
      cy.get('[data-testid="input-nomor_akun"]').click();
      cy.get('[data-option-index="0"]').click();
      cy.get('[name="sub_total"]').type(bayar);
      cy.contains("Buat Pembayaran").click();
      cy.contains("Lanjutkan").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Pembayaran berhasil ditambahkan",
      );
      cy.get('[data-testid="tab-lunas"]').click();
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", "Lunas");
    });
  });

  it.only("Void", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarubelumdibayar();
    cy.intercept("POST", "**/api/biayas**").as("void");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@void", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", transaction).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.get('[data-value="void"]').scrollIntoView().click();
      cy.contains("Konfirmasi").click();

      cy.get('[data-testid="tab-void"]').click();
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", "Void");
    });
  });
});
