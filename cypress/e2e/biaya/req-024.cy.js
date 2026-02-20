describe("halaman biaya", () => {
  it("Status Jatuh Tempo sehari sebelum termin habis", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    const today = new Date();
    const transaksiDate = new Date();
    transaksiDate.setDate(today.getDate() - 30);
    const formatFullDate = (date) => {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yyyy = date.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };
    const tglTransaksi = formatFullDate(transaksiDate);
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarubelumdibayar();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type(tglTransaksi);
    cy.intercept("POST", "**/api/biayas**").as("databaru");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@databaru", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      const dueDate = new Date(response.body.due_date);
      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const dateObj = new Date(dateStr);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = String(dateObj.getFullYear()).padStart(4, "0").slice(2);
        return `${day}/${month}/${year}`;
      };
      cy.log(transaction);
      cy.log(formatDate(dueDate));
      cy.alltime();
      cy.contains(transaction, { timeout: 15000 }).should("be.visible");
      cy.get("table tbody tr")
        .contains("td", transaction)
        .parents("tr")
        .within(() => {
          cy.get("td").eq(1).should("contain.text", transaction);
          cy.get("td").eq(3).should("contain.text", formatDate(dueDate));
          cy.get("td").eq(4).should("contain.text", "Jatuh Tempo");
        });
    });
  });
});
