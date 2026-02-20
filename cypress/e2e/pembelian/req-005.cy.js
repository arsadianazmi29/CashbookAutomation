describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("badge tidak muncul jika data kosong", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/pembelian/overvie**", {
      statusCode: 200,
      body: {},
    }).as("badge");
    cy.reload();
    cy.wait("@badge");
    cy.get(
      ":nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiBadge-root > .MuiBadge-badge",
    ).should("not.visible");
  });

  it("badge muncul jika ada data", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/pembelian/overvie**", (req) => {
      req.reply((res) => {
        res.body.belumDibayar.total = 20;
        return res;
      });
    }).as("badgeada");
    cy.reload();
    cy.wait("@badgeada").then(() => {
      const badgeselector =
        ":nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiBadge-root > .MuiBadge-badge";
      cy.get(badgeselector).should("be.visible").and("contain", 20);
    });
  });

  it("Menampilkan card data belum dibayar", () => {
    cy.intercept("GET", "**/api/pembelian/overview?**").as("belumdibayar");
    cy.visit("https://dev-cashbook.assist.id/admin/purchases");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.wait("@belumdibayar", { timeout: 10000 }).then(({ response }) => {
      const total = response.body.belumDibayar.total;
      const nominal = response.body.belumDibayar.nominal;
      cy.get(
        ":nth-child(1 ) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiBadge-root > .MuiBadge-badge",
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
      cy.get(":nth-child(1) > .MuiPaper-root > .MuiCardContent-root").should(
        "be.visible",
      );
    });
  });

  it("Menampilkan card data Telat Dibayar", () => {
    cy.intercept("GET", "**/api/pembelian/overview?**").as("telatdibayar");
    cy.visit("https://dev-cashbook.assist.id/admin/purchases");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.wait("@telatdibayar", { timeout: 10000 }).then(({ response }) => {
      const total = response.body.telatBayar.total;
      const nominal = response.body.telatBayar.nominal;
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
      cy.get(":nth-child(2) > .MuiPaper-root > .MuiCardContent-root").should(
        "be.visible",
      );
    });
  });

  it("Menampilkan card data ", () => {
    cy.intercept("GET", "**/api/pembelian/overview?**").as("telatdibayar");
    cy.visit("https://dev-cashbook.assist.id/admin/purchases");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.wait("@telatdibayar", { timeout: 10000 }).then(({ response }) => {
      const total = response.body.pelunasanDiterima.total;
      const nominal = response.body.pelunasanDiterima.nominal;
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
      cy.get(":nth-child(3) > .MuiPaper-root > .MuiCardContent-root").should(
        "be.visible",
      );
    });
  });
});
