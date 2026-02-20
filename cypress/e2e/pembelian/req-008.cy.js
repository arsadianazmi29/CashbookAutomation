describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
  });
  it("Filter Tanggal Penjualan Dengan Rentang Waktu Tertentu", () => {
    cy.intercept(
      "GET",
      "**/api/pembelian?keyword=&status=&startDate=2025-11-20&endDate=2025-11-21&skip=0&limit=10&**"
    ).as("Tunggu");

    // Klik filter tanggal
    cy.get(".MuiBox-root > .MuiButtonBase-root").click();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type("20112025");
    cy.get('[placeholder="DD/MM/YYYY"]').eq(1).clear().type("21112025");
    cy.get(".MuiGrid2-container > .MuiButton-contained").click();

    cy.wait("@Tunggu");

    // Definisikan tanggal range
    const startDate = new Date(2025, 10, 20); // bulan 7 = Agustus (0-based)
    const endDate = new Date(2025, 10, 21);

    // Gunakan should agar Cypress retry sampai data tabel valid
    cy.get("tr td:nth-child(1)").should(($tds) => {
      expect($tds.length, "Data tabel kosong").to.be.greaterThan(0); //expectasi jika data ada

      $tds.each((i, td) => {
        // Cypress ngecek setiap baris tabel satu per satu
        const text = td.innerText.trim();
        const [day, month, year] = text.split("/");
        const cellDate = new Date(
          2000 + parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );

        expect(cellDate, `Tanggal ${text} di luar rentang`).to.be.within(
          // cek apakah data dalam rentang tertentu
          startDate,
          endDate
        );
      });
    });
  });
});
