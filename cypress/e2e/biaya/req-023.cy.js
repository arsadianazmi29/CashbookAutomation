describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("Menampilkan card data biaya bulan ini", () => {
    cy.intercept("GET", "**/api/biayas/overview**").as("bulanini");
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.wait("@bulanini", { timeout: 10000 }).then(({ response }) => {
      const total = response.body.biayaBulanIni.total;
      const nominal = response.body.biayaBulanIni.nominal;
      cy.get(
        ":nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiBadge-root > .MuiBadge-badge",
      )
        .invoke("text")
        .then((text) => {
          const badgeText = text.trim();

          if (total > 99) {
            expect(badgeText).to.eq("99+");
          } else {
            expect(badgeText).to.eq(String(total));
          }
        });
      cy.get(
        ":nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiTypography-h5",
      )
        .invoke("text")
        .then((text) => {
          const actual = Number(text.replace(/[^\d]/g, ""));
          const expected = Math.round(nominal);
          expect(actual).to.eq(expected);
        });
    });
  });

  it("Menampilkan card data Biaya 30 Hari Terakhir", () => {
    cy.intercept("GET", "**/api/biayas/overview**").as("biaya");
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.wait("@biaya", { timeout: 10000 }).then(({ response }) => {
      const total = response.body.biaya30HariTerakhir.total;
      const nominal = response.body.biaya30HariTerakhir.nominal;
      cy.get(
        ":nth-child(2) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiBadge-root > .MuiBadge-badge",
      )
        .invoke("text")
        .then((text) => {
          const badgeText = text.trim();

          if (total > 99) {
            expect(badgeText).to.eq("99+");
          } else {
            expect(badgeText).to.eq(String(total));
          }
        });
      cy.get(
        ":nth-child(2) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiTypography-h5",
      )
        .invoke("text")
        .then((text) => {
          const actual = Number(text.replace(/[^\d]/g, ""));
          const expected = Math.round(nominal);
          expect(actual).to.eq(expected);
        });
    });
  });

  it.only("Menampilkan card data Biaya Belum Dibayar", () => {
    cy.intercept("GET", "**/api/biayas/overview**").as("belumdibayar");
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.wait("@belumdibayar", { timeout: 10000 }).then(({ response }) => {
      const total = response.body.biayaBelumBayar.total;
      const nominal = response.body.biayaBelumBayar.nominal;
      cy.get(
        ":nth-child(3) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiBadge-root > .MuiBadge-badge",
      )
        .invoke("text")
        .then((text) => {
          const badgeText = text.trim();

          if (total > 99) {
            expect(badgeText).to.eq("99+");
          } else {
            expect(badgeText).to.eq(String(total));
          }
        });
      cy.get(
        ":nth-child(3) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiTypography-h5",
      )
        .invoke("text")
        .then((text) => {
          const actual = Number(text.replace(/[^\d]/g, ""));
          const expected = Math.round(nominal);
          expect(actual).to.eq(expected);
        });
    });
  });
});
