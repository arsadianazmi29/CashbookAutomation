describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it("menampilkan data kosong", () => {
    cy.intercept("GET", "**/api/biayas**", {
      statusCode: 200,
      body: {
        totalData: 0,
        results: [],
      },
    }).as("databiaya");
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.wait("@databiaya");
    cy.contains("td", "Tidak ada data").should("be.visible");
  });

  it.only("Badge tidak ditampilkan saat data kosong", () => {
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.intercept("GET", "**/api/biayas/overview**", {
      statusCode: 200,
      body: {},
    }).as("badge");
    cy.reload();
    cy.wait("@badge");
    cy.get(
      ":nth-child(1) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiBadge-root > .MuiBadge-badge",
    ).should("not.visible");
  });

  it("badge muncul ketika ada data", () => {
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/biayas/overview**", (req) => {
      req.reply((res) => {
        res.body.biayaBelumBayar.total = 24;
        return res;
      });
    }).as("badgeada");
    cy.reload();
    cy.wait("@badgeada").then(() => {
      const badgeselector =
        ":nth-child(3) > .MuiPaper-root > .MuiCardContent-root > .css-kdbf65 > .MuiStack-root > .MuiBadge-root > .MuiBadge-badge";
      cy.get(badgeselector).should("be.visible").and("contain", 24);
    });
  });
});
