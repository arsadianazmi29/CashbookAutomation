describe("halaman login", () => {
  //  beforeEach(() => {
  //   cy.visit("https://uat-cashbook.assist.id/");
  //   cy.get("#email").type("arsadianazmi323@gmail.com");
  //   cy.get("#password").type("azmiii29");
  //   cy.get('[data-testid="login-submit-button"]').click();
  // cy.login("arsadianazmi323@gmail.com", "azmiii29");
  // });

  it("login", () => {});

  it("login akun gagal", () => {
    cy.get("#email").type("azmiiii@gmail.com");
    cy.get("#password").type("12345678");
    cy.get('["data-testid="login-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should("be.visible");
  });

  it.only("login berhasil", () => {
    cy.get("#email").type("arsadianazmi323@gmail.com");
    cy.get("#password").type("azmiii29");
    cy.get('[data-testid="login-submit-button"]').click();
  });

  it("logout", () => {});
});

// perintah untuk memanggil API tanpa lewat ui
describe("Login via request api", () => {
  beforeEach("login via api", () => {
    cy.request({
      method: "POST",
      url: "https://api-uat-cashbook.assist.id/api/login",
      body: {
        email: "arsadianazmi323@gmail.com", // hardcode email
        password: "azmiii29", // hardcode password
      },
    }).then((response) => {
      expect(response.status).to.eq(200);

      const token = response.body.token;

      cy.setCookie("token", token);
      window.localStorage.setItem("token", token);
    });
    cy.visit(" https://api-dev-cashbook.assist.id/");
  });

  it("tes", () => {});

  it("intercept di penjualan", () => {
    cy.get('[data-testid="drawer-item-sales"]').click();
    cy.intercept("GET", "**/api/penjualan**", {
      statusCode: 200,
      body: {
        totalData: 0,
        results: [],
      },
    }).as("dataPenjualan");
    cy.reload();
    cy.wait("@dataPenjualan");
    cy.get("td").should("have.text", "Tidak ada data");
  });

  it("TC-0002 Validasi Isi Tabel Penjualan Berdasarkan Data API Asli", () => {
    // Helper format tanggal
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const dateObj = new Date(dateStr);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = String(dateObj.getFullYear()).padStart(4, "0").slice(2); // <-- ini kuncinya
      return `${day}/${month}/${year}`;
    };
    // Spy API penjualan tanpa memanipulasi
    cy.get("#_r_8_").click();
    cy.get(
      '[data-testid="listCompany-item-ab78f6b2-afdd-11f0-9aae-9bbc0c8b2cba"]'
    ).click();
    cy.get('[data-testid="drawer-item-sales"]').click();
    cy.intercept("GET", "**/api/penjualan**").as("getPenjualan");
    // Filter tanggal awal jadi 01/01/0001 supaya semua data keluar
    cy.get(".MuiBox-root > .MuiButtonBase-root").click();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type("01010001");
    cy.wait(3000);
    cy.get(".MuiGrid2-container > .MuiButton-contained").click();
    // Tunggu request API asli
    cy.wait("@getPenjualan", { timeout: 20000 }).then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      const apiData = response.body.results;

      // Pastikan jumlah row tabel sama dengan data API
      cy.get("table tbody tr").should("have.length", apiData.length);

      cy.get("table tbody tr").each(($row, index) => {
        const rowData = apiData[index];
        if (!rowData) return;

        const clean = (el) => Cypress.$(el).text().replace(/\s+/g, " ").trim();

        expect(clean($row.find("td").eq(0))).to.eq(
          formatDate(rowData.tanggal_transaksi)
        );

        expect(clean($row.find("td").eq(1))).to.eq(rowData.nomor);

        expect(clean($row.find("td").eq(2))).to.eq(
          rowData.customer?.nama || ""
        );

        expect(clean($row.find("td").eq(3))).to.eq(
          formatDate(rowData.tanggal_jatuh_tempo)
        );

        expect(clean($row.find("td").eq(4))).to.eq(rowData.status);

        expect(clean($row.find("td").eq(5))).to.eq(
          `Rp ${rowData.sisa_tagihan.toLocaleString("id-ID")}`
        );

        expect(clean($row.find("td").eq(6))).to.eq(
          `Rp ${rowData.total.toLocaleString("id-ID")}`
        );

        expect(clean($row.find("td").eq(7))).to.eq(`${rowData.created_name}`);
      });
    });
  });
});
