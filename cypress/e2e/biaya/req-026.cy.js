describe("halaman biaya", () => {
  it.only("Jatuh Tempo otomatis berubah sesuai Syarat Pembayaran (Termin)", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('[id="expense_from"]').click();
    cy.get('[data-option-index="1"]').click();
    cy.get('[name="is_pay_later"]').click();
    cy.get('[id="recipient"]').click();
    cy.get('[data-option-index="0"]').click();
    cy.get('[id="payment_method"]').click();
    cy.get('[data-option-index="0"]').click();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type("10022026");
    cy.get('[id="payment_terms"]').click();
    cy.get('[data-option-index="1"]').click();
    cy.get('[placeholder="DD/MM/YYYY"]')
      .eq(1)
      .should("have.value", "12/03/2026");
  });
});
