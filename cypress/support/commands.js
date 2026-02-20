// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "cypress-file-upload";

Cypress.Commands.add("login", (email, password) => {
  cy.request({
    method: "POST",
    url: "https://api-dev-cashbook.assist.id/api/login",
    body: {
      email: `${email}`, // hardcode email
      password: `${password}`, // hardcode password
    },
  }).then((response) => {
    expect(response.status).to.eq(200);

    const token = response.body.token;

    cy.setCookie("token", token);
    window.localStorage.setItem("token", token);
  });
  cy.visit("https://dev-cashbook.assist.id/");
});

Cypress.Commands.add("cekstatus", (status) => {
  // tab
  cy.get(".MuiTabs-list").contains(status).click();
  cy.get(".MuiTabs-list > .Mui-selected").should("have.text", status);
  cy.get(".MuiSkeleton-root").should("not.exist");
  cy.get("body").then(($body) => {
    if ($body.text().includes("Tidak ada data")) {
      // kalo ad teks "tidak ada data"
      // TIDAK ADA DATA
      cy.log("Tidak ada data");
      cy.contains("Tidak ada data").should("be.visible");
    } else {
      // ADA DATA
      cy.log("Ada data, cek status tiap baris");

      cy.get("table tbody tr").each(($row) => {
        cy.wrap($row)
          .find("td")
          .eq(4) // kolom ke-5
          .should("contain.text", status);
      });
    }
  });
});

Cypress.Commands.add("alltime", () => {
  cy.get(".MuiBox-root > .MuiButtonBase-root").click();
  cy.get("[placeholder='DD/MM/YYYY']").eq(0).clear().type("01010002");
  cy.get(".MuiGrid2-root > .MuiButton-contained").click();
});

Cypress.Commands.add("isiinputinventory", () => {
  cy.get("#idSupplier").click();
  cy.get(".css-1scbymt").click();
  cy.get("#address").type("Jalan Pasar Minggu");
  cy.get("[id='pembelian.0.tipe_pembelian']").click();
  cy.get('[data-value="Inventory"]').click();
  cy.get("[id='pembelian.0.product_id']").click();
  cy.get(".css-1scbymt").click();
  cy.get("[id='pembelian.0.gudang_id']").click();
  cy.get(".css-90sfc3").click();
  // cy.get("[name='pembelian.0.quantity']").type("");
  // cy.get("[id='pembelian.0.unit']").click();
  // cy.get(".css-90sfc3").click();
  cy.get("[id='pembelian.0.akun_pembelian_id']").click();
  cy.get(".css-90sfc3").click();
});

Cypress.Commands.add("inputkirimpembayaran", () => {
  cy.get('[id="metode"]').click();
  cy.get('[data-value="Tunai"]').click();
  cy.get('[data-testid="input-nomor_akun"]').click();
  cy.get('[data-option-index="0"]').click();
});

Cypress.Commands.add("biayabarulunas", () => {
  cy.get('[id="expense_from"]').click();
  cy.get('[data-option-index="0"]').click();
  cy.get('[id="recipient"]').click();
  cy.get('[data-option-index="3"]').click();
  cy.get('[id="payment_method"]').click();
  cy.get('[data-option-index="0"]').click();
  cy.get('[id="details.0.account"]').click();
  cy.get('[data-option-index="0"]').click();
});

Cypress.Commands.add("biayabarubelumdibayar", () => {
  cy.get('[id="expense_from"]').click();
  cy.get('[data-option-index="1"]').click();
  cy.get('[name="is_pay_later"]').click();
  cy.get('[id="recipient"]').click();
  cy.get('[data-option-index="0"]').click();
  cy.get('[id="payment_method"]').click();
  cy.get('[data-option-index="0"]').click();
  cy.get('[id="payment_terms"]').click();
  cy.get('[data-option-index="0"]').click();
  cy.get('[id="details.0.account"]').click();
  cy.get('[data-option-index="0"]').click();
});
