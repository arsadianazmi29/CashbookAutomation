describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("Jatuh tempo saat sehari sebelum termin habis", () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // bulan mulai dari 0
    const yyyy = today.getFullYear();
    const tglSkrg = `${dd}/${mm}/${yyyy}`;

    cy.get(".MuiSkeleton-root").should("not.exist");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.visit("https://dev-cashbook.assist.id/admin/purchases/create");
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type(tglSkrg);
    cy.isiinputinventory();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(1).should("have.value", tglSkrg);
    cy.intercept("POST", "**/api/pembelian**").as("databaru");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@databaru", { timeout: 10000 }).then(({ response }) => {
      const noinvoice = response.body.nomor;
      const jatuhtempo = response.body.tanggal_jatuh_tempo;
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const dateObj = new Date(dateStr);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = String(dateObj.getFullYear()).padStart(4, "0").slice(2); // <-- ini kuncinya
        return `${day}/${month}/${year}`;
      };
      cy.log(noinvoice);
      cy.log(formatDate(jatuhtempo));
      cy.contains(noinvoice, { timeout: 15000 }).should("be.visible");
      // Ambil baris tabel berdasarkan nomor invoice
      cy.get("table tbody tr")
        .contains("td", noinvoice)
        .parents("tr")
        .within(() => {
          cy.get("td").eq(1).should("contain.text", noinvoice);
          cy.get("td").eq(3).should("contain.text", formatDate(jatuhtempo));
          cy.get("td").eq(4).should("contain.text", "Jatuh Tempo");
        });
    });
  });
});
