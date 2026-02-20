describe("halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });
  it.only("Perhitungan harga akhir, termasuk diskon,harga termasuk pajak, pajak, dan pemotongan", () => {
    const qty = 2;
    const harga = 12000;
    const diskon = 2;
    const potongan = 5000;

    const subtotal = qty * harga;
    const totalDiskon = subtotal * (diskon / 100);
    const totalAkhir = subtotal - totalDiskon - potongan;
    function totalrupiah(num) {
      return "Rp " + new Intl.NumberFormat("id-ID").format(num);
    }
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get("#idSupplier").click();
    cy.get(".css-1scbymt").click();
    cy.get("#address").type("Jalan Pasar Minggu");
    cy.get("[id='pembelian.0.tipe_pembelian']").click();
    cy.get('[data-value="Inventory"]').click();
    cy.get("[id='pembelian.0.product_id']").click();
    cy.get(".css-1scbymt").click();
    cy.get("[id='pembelian.0.gudang_id']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[name='pembelian.0.quantity']").clear().type(qty);
    cy.get("[id='pembelian.0.akun_pembelian_id']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[ name='pembelian.0.price']").clear().type(harga);
    cy.get("[name='isDiscountAll']").click();
    cy.get("#discountAllType").click();
    cy.get('[data-value="percentage"]').click();
    cy.get("[name='discountAllValue']").type(diskon);
    cy.get("[name='isPemotongan']").click();
    cy.get("#discountPemotonganType").click();
    cy.get('[data-value="fix"]').click();
    cy.get("[name='discountPemotonganValue']").type(potongan);
    cy.get(":nth-child(9) > :nth-child(2)").should(
      "have.text",
      totalrupiah(totalAkhir)
    );
  });

  it("Perhitungan Total Bayar dengan Potongan  saat Kirim Pembayaran", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('[name="pembelian.0.price"]').clear({ force: true }).type(10000);
    cy.intercept("GET", "**/api/pembelian**").as("tambahdata");
    cy.wait("@tambahdata", { timeout: 10000 }).then(({ response }) => {
      const nomor = response.body.nomor;
      const harga = response.body.sisa_tagihan;
      const bayar = 20000;
      const potonganPersen = 5;
      const nilaiPotongan = (bayar * potonganPersen) / 100;
      const totalBayar = Math.floor((bayar - nilaiPotongan) / 1000) * 1000;
      const totalTagihan = harga - bayar;
      function totalrupiah(num) {
        return "Rp " + new Intl.NumberFormat("id-ID").format(num);
      }
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", nomor).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.contains("Kirim Pembayaran").click();
      cy.inputkirimpembayaran();
      cy.get('[name="sub_total"]').type(bayar);
      cy.get('[name="isPemotongan"]').click();
      cy.get('[name="potongan_value"]').type(potonganPersen);
      cy.get("#potongan_nomor_akun").click();
      cy.get('[data-option-index="0"]').click();
      cy.get(":nth-child(5) > :nth-child(2)").should(
        "have.text",
        totalrupiah(totalBayar)
      );
      cy.get(":nth-child(7) > :nth-child(2)").should(
        "have.text",
        totalrupiah(totalTagihan)
      );
    });
  });

  it("Perhitungan Total Bayar dengan Potongan  saat Kirim Pembayaran", () => {
    cy.intercept(
      "GET",
      "**/api/pembelian/e52e6dd0-ed05-11f0-8a65-9d07d01cbcb3?**"
    ).as("detail");

    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("[placeholder='Cari']").type("PINV/0305");
    cy.contains("td", "PINV/0305").click();
    cy.wait("@detail", { timeout: 10000 }).then(({ response }) => {
      const sisaAwal = response.body.total_item_price;

      const bayar = 20000;
      const potonganPersen = 5;
      const potongan = (bayar * potonganPersen) / 100;
      const totalBayar = bayar - potongan;
      const sisaAkhir = sisaAwal - bayar;
      function rupiah(num) {
        return "Rp " + new Intl.NumberFormat("id-ID").format(num);
      }
      cy.contains("Pilih Tindakan").click();
      cy.contains("Kirim Pembayaran").click();
      cy.get('[name="sub_total"]').clear().type(bayar);
      cy.get('[name="isPemotongan"]').click();
      cy.get('[name="potongan_value"]').clear().type(potonganPersen);

      cy.get(":nth-child(5) > :nth-child(2)").should(
        "contain",
        rupiah(totalBayar)
      );
      cy.get(":nth-child(7) > :nth-child(2)").should(
        "contain",
        rupiah(sisaAkhir)
      );
    });
  });
});
