describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it.only("Menampilkan tabel data teb semua", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/biayas**").as("semua");
    cy.get('[data-testid="tab-semua"]').should("be.visible");
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    cy.wait("@semua");
    cy.get("table tbody tr td:nth-child(5)").each(($td) => {
      expect([
        "Belum Dibayar",
        "Jatuh Tempo",
        "Lunas",
        "Dibayar Sebagian",
        "Void",
      ]).to.include($td.text().trim());
    });
  });

  it("Menampilkan table data teb belum dibayar", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/biayas**").as("belum");
    cy.get('[data-testid="tab-belum-dibayar"]').click();
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    cy.wait("@belum");
    cy.get("table tbody tr td:nth-child(5)").each(($td) => {
      expect(["Belum Dibayar"]).to.include($td.text().trim());
    });
  });

  it("Menampilkan tebel data tab jatuh tempo", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/biayas**").as("jatuhtempo");
    cy.get('[data-testid="tab-jatuh-tempo"]').click();
    cy.get('[data-testid="filter-button-filter-tanggal"]').click();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type("01/01/2026");
    cy.contains("Apply").click();
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    cy.wait("@jatuhtempo");
    cy.get("table tbody tr td:nth-child(5)").each(($td) => {
      expect(["Jatuh Tempo  "]).to.include($td.text().trim());
    });
  });

  it("Menampilkan tabel data tab lunas", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/biayas**").as("lunas");
    cy.get('[data-testid="tab-lunas"]').click();
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    cy.wait("@lunas");
    cy.get("table tbody tr td:nth-child(5)").each(($td) => {
      expect(["Lunas"]).to.include($td.text().trim());
    });
  });

  it("Menampilkan tabel data dibayar sebagian", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/biayas**").as("sebagian");
    cy.get('[data-testid="tab-dibayar-sebagian"]').click();
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    cy.wait("@sebagian");
    cy.get("table tbody tr td:nth-child(5)").each(($td) => {
      expect(["Dibayar Sebagian"]).to.include($td.text().trim());
    });
  });

  it("Menampilkan tabel data tab void", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/biayas**").as("Void");
    cy.get('[data-testid="tab-void"]');
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    cy.wait("@Void");
    cy.get("table tbody tr td:nth-child(5)").each(($td) => {
      expect(["Void"]).to.include($td.text().trim());
    });
  });
});
