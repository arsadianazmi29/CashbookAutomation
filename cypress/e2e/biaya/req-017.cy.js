describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("kalkulasi nilai akhir sisa tagihan, melibatkan PPN,  jumlah, dan potongan", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    const ppnPersen = 11;
    const jumlah = 22000;
    const subtotal = jumlah;
    const nilaiPPN = (subtotal * ppnPersen) / 100;
    const total = subtotal + nilaiPPN;
    const potonganPersen = 5;
    const potongan = (total * potonganPersen) / 100;
    const sisaTagihan = Math.round(total - potongan);
    const totalrupiah = (num) =>
      "Rp " + new Intl.NumberFormat("id-ID").format(num);

    cy.biayabarulunas();
    cy.get('[id="details.0.tax_id"]').click();
    cy.get('[data-value="8d6cdf20-c904-11f0-b3a6-cbe1aeec8c06"]').click();
    cy.get('[name="details.0.amount"]').type(jumlah);
    cy.get('[name="is_discount"]').click();
    cy.get('[data-testid="expenses-summary-discount-value"]').type(
      potonganPersen,
    );
    cy.get('[data-testid="expenses-summary-rest-bill"]')
      .invoke("text")
      .then((text) => {
        const actual = text.replace(/\s/g, "").trim();
        const expected = totalrupiah(sisaTagihan).replace(/\s/g, "");
        expect(actual).to.eq(expected);
      });
  });
});
