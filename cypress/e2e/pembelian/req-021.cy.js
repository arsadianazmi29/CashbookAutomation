describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("kirim pembayaran dibayar sebagian", () => {
    const price = "20000";
    const bayar = "12000";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('[name="pembelian.0.price"]').type(price);
    cy.intercept("POST", "**/api/pembelian**").as("tambahdata");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@tambahdata", { timeout: 10000 }).then(({ response }) => {
      const nomor = response.body.nomor;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", nomor).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.contains("Kirim Pembayaran").click();
      cy.inputkirimpembayaran();
      cy.get('[name="sub_total"]').type(bayar);
      cy.contains("Buat Pembayaran").click();
      cy.contains("Lanjutkan").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Pembayaran berhasil ditambahkan"
      );
      cy.get('[data-testid="tab-jatuh-tempo"]').click();
      cy.contains("td", nomor).should("be.visible");
      cy.get('[data-testid="tab-dibayar-sebagian"]').click();
      cy.contains("td", nomor).should("be.visible");
    });
  });

  it("Kirim Pembayaran Lunas", () => {
    const harga = "35000";
    const bayar = "35000";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('[name="pembelian.0.price"]').type(harga);
    cy.intercept("POST", "**/api/pembelian**").as("lunas");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@lunas", { timeout: 10000 }).then(({ response }) => {
      const nomor = response.body.nomor;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", nomor).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.contains("Kirim Pembayaran").clik();
      cy.inputkirimpembayaran();
      cy.get('[name="sub_total"]').type(bayar);
      cy.contains("Buat Pembayaran").click();
      cy.contains("Lanjutkan").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Pembayaran berhasil ditambahkan"
      );
      cy.get('[data-testid="tab-lunas"]').click();
      cy.contains("td", nomor).should("be.visible");
    });
  });

  it("Void pembayaran", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('[name="pembelian.0.price"]').type("12000");
    cy.intercept("POST", "**/api/pembelian**").as("void");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@void", { timeout: 10000 }).then(({ response }) => {
      const nomor = response.body.nomor;
      cy.contains("td", nomor).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.contains("Void").click();
      cy.get("Konfirmasi").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "have.text",
        "Pembelian berhasil divoid"
      );
      cy.get('[data-testid="tab-void"]').click();
      cy.contains("td", nomor).should("be.visible");
    });
  });

  it.only("kirim pembayaran tidak boleh melebihi sisa tagihan", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept(
      "GET",
      "**/api/pembelian/82d76510-f066-11f0-ad5a-0f7b22098864?**"
    ).as("getDetailPembelian");
    cy.contains("td", "PINV/0320").click();
    cy.wait("@getDetailPembelian").then((res) => {
      const data = res.response.body;
      expect(data.nomor).to.eq("PINV/0320");
      const sisaTagihan = Number(data.sisa_tagihan);
      expect(sisaTagihan).to.be.greaterThan(0);
      cy.contains("Pilih Tindakan").click();
      cy.contains("Kirim Pembayaran").click();
      cy.inputkirimpembayaran();
      const bayarLebih = sisaTagihan + 3000;
      cy.get('[name="sub_total"]').clear().type(bayarLebih);
      cy.get('[name="sub_total"]')
        .invoke("val")
        .then((value) => {
          const actual = Number(value.replace(/[^0-9]/g, ""));
          expect(actual).to.eq(sisaTagihan);
        });
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Jumlah bayar tidak boleh melebihi sisa tagihan"
      );
    });
  });
});
