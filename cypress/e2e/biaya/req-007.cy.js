describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
  });
  it("Filter tanggal data biaya berdasarkan rentang tanggal", () => {
    cy.intercept(
      "GET",
      "**/api/biayas?search=&status=&startDate=2026-01-20&endDate=2026-01-21&skip=0&limit=10&companyId=b1e0a510**",
    ).as("Tunggu");
    // Klik filter tanggal
    cy.get(".MuiBox-root > .MuiButtonBase-root").click();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type("20012026");
    cy.get('[placeholder="DD/MM/YYYY"]').eq(1).clear().type("21012026");
    cy.contains("Apply").click();

    cy.wait("@Tunggu");

    // Definisikan tanggal range
    const startDate = new Date(2026, 0, 20); // bulan 7 = Agustus (0-based)
    const endDate = new Date(2026, 0, 21);

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
          parseInt(day),
        );

        expect(cellDate, `Tanggal ${text} di luar rentang`).to.be.within(
          // cek apakah data dalam rentang tertentu
          startDate,
          endDate,
        );
      });
    });
  });
});
