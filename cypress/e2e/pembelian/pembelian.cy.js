describe("Mengunjungi halaman pembelian", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("TC-0001 : mengunjungi halaman pembelian", () => {
    cy.get('[data-testid="drawer-item-purchases"]').should("be.visible");
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.url().should("include", "/admin/purchases");
  });

  it("TC-0002 : Menampilkan skeleton saat data fetch", () => {
    cy.get(".MuiSkeleton-root").should("be.visible");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
  });

  it("TC-0003 : Menampilkan pesan tidak ada data", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.intercept("GET", "**/api/pembelian**", {
      statusCode: 200,
      body: {
        totalData: 0,
        results: [],
      },
    }).as("dataPembelian");
    cy.reload();
    cy.wait("@dataPembelian");
    cy.get("td").should("have.text", "Tidak ada data");
  });

  it("TC-0004 : Breadcrumbs hal pembelian dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.url().should("include", "/admin/purchases");
    cy.get(".MuiBreadcrumbs-ol").should("be.visible");
    cy.get(".MuiBreadcrumbs-ol > :nth-child(1) > .MuiTypography-root").click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("TC-0005 : Breadcrumbs hal pembelian baru dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.url().should("include", "/admin/purchases/create");
    cy.get(":nth-child(3) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/purchases");
  });

  it("TC-0006 : Breadcrumbs detail pembelian dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("td button").eq(0).click();
    cy.url().should("include", "/admin/purchases/detail");
    cy.get(":nth-child(3) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/purchases");
  });

  it("TC-0007 : Breadcrumbs detail pembayaran dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-dibayar-sebagian"]').click();
    cy.get("td button").eq(0).click();
    cy.get("td button").eq(0).click();
    cy.url().should("include", "/admin/purchases/detail/payment");
    cy.get(":nth-child(5) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/purchases/detail");
  });

  it("TC-0008 : Menampilkan card data belum dibayar", () => {
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

  it("TC-0009 : Menampilkan card data Telat Dibayar", () => {
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

  it("TC-0010 : Menampilkan card data ", () => {
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

  it("TC-0011 : Tab status pembelian berfungsi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.cekstatus("Belum Dibayar");
    cy.cekstatus("Jatuh Tempo");
    cy.cekstatus("Lunas");
    cy.cekstatus("Dibayar Sebagian");
    cy.cekstatus("Void");
  });

  it("TC-0012 : Mencari data pembelian berdasarkan data invoice", () => {
    const dataSample = "PINV/0002";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get("[placeholder='Cari']").type(dataSample);
    cy.get(".MuiTableBody-root > .MuiTableRow-root > :nth-child(2)").should(
      "contains.text",
      dataSample,
    );
  });

  it("TC-0013 : Mencari data pembelian berdasarkan nama supplier", () => {
    const supplier = "Rayhan Rayandra";
    cy.intercept("GET", "**/api/pembelian**").as("getPurchases");
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[placeholder="Cari"]').type(supplier);
    cy.wait("@getPurchases");
    cy.get("tbody tr").should("have.length.greaterThan", 0);
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row)
        .find("td")
        .eq(2) // kolom ke-5
        .should("contain.text", supplier);
    });
  });

  it("TC-0014 : Filter Tanggal Penjualan Dengan Rentang Waktu Tertentu", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.intercept(
      "GET",
      "**/api/pembelian?keyword=&status=&startDate=2025-11-20&endDate=2025-11-21&skip=0&limit=10&**",
    ).as("Tunggu");

    // Klik filter tanggal
    cy.get(".MuiBox-root > .MuiButtonBase-root").click();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type("20112025");
    cy.get('[placeholder="DD/MM/YYYY"]').eq(1).clear().type("21112025");
    cy.get(".MuiGrid2-container > .MuiButton-contained").click();

    cy.wait("@Tunggu");

    // Definisikan tanggal range
    const startDate = new Date(2025, 10, 20); // bulan 7 = Agustus (0-based)
    const endDate = new Date(2025, 10, 21);

    // Gunakan should agar Cypress retry sampai data tabel valid
    cy.get("tr td:nth-child(1)").should(($tds) => {
      expect($tds.length, "Data tabel kosong").to.be.greaterThan(0);

      $tds.each((i, td) => {
        const text = td.innerText.trim();
        const [day, month, year] = text.split("/");
        const cellDate = new Date(
          2000 + parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
        );

        expect(cellDate, `Tanggal ${text} di luar rentang`).to.be.within(
          startDate,
          endDate,
        );
      });
    });
  });

  it("TC-0015 : menampilkan pagination pada tabel pembelian", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.scrollTo("bottom");
    cy.get(".MuiPaper-elevation > .MuiStack-root").should("be.visible");
    cy.get(".MuiPagination-ul li").should("be.visible");
  });

  it("TC-0016 : jika harga aset (0)", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get("#idSupplier").click();
    cy.get(".css-1scbymt").click();
    cy.get("#address").type("Jalan Pasar Minggu");
    cy.get("[id='pembelian.0.tipe_pembelian']").click();
    cy.get('[data-value="Aset"]').click();
    cy.get("#pembelian\\.0\\.product_name").type("Mobil");
    cy.get("#pembelian\\.0\\.akun_pembelian_id").click();
    cy.get('[data-value="ec83102f-201e-450d-8ab5-898a23b39ce9"]').click();
    cy.contains("Rp 0").should("be.visible");
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should("be.visible");
    cy.get(".MuiAlert-message").should(
      "have.text",
      "Mohon periksa kembali form",
    );
    cy.get(".MuiTableBody-root > :nth-child(1) > :nth-child(8)").should(
      "contain",
      "Harga aset harus lebih dari 0",
    );
  });

  // it("TC-0017 : Kesesuaian Penulisan Label dan Placeholder", () => {});

  it("TC-0018 : Populate data otomatis pada form pembelian baru", () => {
    const supplier = "Rayhan Rayandra";
    const produk = "SKU-000001 - GARAM CINA";

    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();

    cy.get("#idSupplier").click();
    cy.get("#idSupplier-listbox").should("contain", supplier);
    cy.get(".css-1scbymt").click();
    cy.contains("Pembelian Baru").click();
    cy.get("[id='pembelian.0.tipe_pembelian']").click();
    cy.get('[data-value="Inventory"]').click();
    cy.get("[id='pembelian.0.product_id']").click();
    cy.contains(produk).should("contain", produk);
    cy.get(".css-1scbymt").click();
  });

  it("TC-0019 : Validasi input wajib diisi pada form pembelian baru", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Pembelian berhasil ditambahkan",
    );
  });

  it("TC-0020 : Validasi input wajib diisi pada form pembelian baru jika tidak diisi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get(".MuiButton-contained").first().click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should("be.visible");
    cy.get(".MuiAlert-message").should(
      "have.text",
      "Mohon periksa kembali form",
    );
  });

  it("TC-0021 : Set harga barang", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn").click();
    cy.contains("Pembelian Baru").click();
    const harga = "12500";
    cy.get("[name='pembelian.0.price']").type(harga);
    cy.get("[name='pembelian.0.price']")
      .invoke("val")
      .should((v) => {
        expect(v).to.match(/^Rp (\d{1,3})(\.\d{3})+$/);
      });
  });

  it("TC-0022 : Upload file pada pembelian baru", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('input[type="file"]').attachFile("meowww.jpg");
    cy.contains("meowww.jpg").should("exist");
  });

  it("TC-0023 : Value jumlah harga per item berdasarkan Qty & Diskon", () => {
    const qty = 2;
    const harga = 12000;
    const diskon = 5;

    const subtotal = qty * harga;
    const totalDiskon = subtotal * (diskon / 100);
    const totalAkhir = subtotal - totalDiskon;
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
    cy.get("[name='pembelian.0.quantity']").type(qty);
    cy.get("[id='pembelian.0.unit']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[id='pembelian.0.akun_pembelian_id']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[ name='pembelian.0.price']").type(harga);
    cy.get("[ name='pembelian.0.discount']").type(diskon);
    cy.get("[ name='pembelian.0.total']").should(
      "have.value",
      totalrupiah(totalAkhir),
    );
  });

  it.only("TC-0024 : Jatuh Tempo otomatis berubah sesuai Syarat Pembayaran (Termin)", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".MuiSkeleton-root").should("not.exist");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type("24112025");
    cy.get("#paymentTerms").click();
    cy.get('[data-value="[object Object]"]').click();
    cy.get('[placeholder="DD/MM/YYYY"]')
      .eq(1)
      .should("have.value", "24/12/2025");
  });

  it("TC-0025: Menambah dan menghapus baris item pada form pembelian baru", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.contains("Baris Baru").click();
    cy.get(".MuiTableBody-root > :nth-child(2) >").should("be.visible");
    cy.get(":nth-child(2) > .css-1dnk9te > .MuiButtonBase-root")
      .click()
      .should("not.exist");
  });

  it("TC-0026 : Perhitungan harga akhir, termasuk diskon,harga termasuk pajak, pajak, dan pemotongan", () => {
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
    cy.get("[name='pembelian.0.quantity']").type(qty);
    cy.get("[id='pembelian.0.unit']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[id='pembelian.0.akun_pembelian_id']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[ name='pembelian.0.price']").type(harga);
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
      totalrupiah(totalAkhir),
    );
  });

  it("TC-0027 : Menambahkan pembelian baru", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get("[ name='pembelian.0.price']").type("10000");
    cy.get("[ name='pembelian.0.discount']").type("8");
    // cy.get(".MuiButton-contained").click();
    // cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Pembelian berhasil ditambahkan",
    );
  });

  it("TC-0028 : Melihat detail nomor pembelian", () => {
    const detail = "PINV/0016";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get(".MuiGrid2-root > .MuiButton-contained").click();
    cy.get(".css-20tnkx > .MuiFormControl-root > .MuiInputBase-root").type(
      detail,
    );
    cy.contains("td", detail).click();
    cy.url().should("include", "/admin/purchases/detail");
  });

  it("TC-0029 : view detail kontak supplier", () => {
    const kontak = "Rayhan Rayandra";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get(".MuiGrid2-root > .MuiButton-contained").click();
    cy.get(".css-20tnkx > .MuiFormControl-root > .MuiInputBase-root").type(
      kontak,
    );
    cy.get(
      ":nth-child(1) > :nth-child(3) > span > a > .MuiButtonBase-root",
    ).click();
    cy.get(
      ":nth-child(2) > .MuiCardContent-root > .MuiGrid2-container > :nth-child(1) > .MuiList-root > :nth-child(1) > .MuiListItemText-root > .MuiTypography-body2",
    ).should("have.text", kontak);
    cy.url().should("include", "/admin/contacts");
  });

  it("TC-0030 : kirim pembayaran dibayar sebagian", () => {
    const price = "20000";
    const bayar = "12000";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('[name="pembelian.0.price"]').type(price);
    cy.intercept("POST", "**/api/pembelian**").as("tambahdata");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@tambahdata", { timeout: 10000 }).then(({ response }) => {
      const nomor = response.body.nomor;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", nomor).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.contains("Kirim Pembayaran").click();
      cy.inputkirimpembayaran();
      cy.get('[name="sub_total"]').type(bayar);
      cy.contains("Buat Pembayaran").click();
      cy.contains("Lanjutkan").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Pembayaran berhasil ditambahkan",
      );
      cy.get('[data-testid="tab-jatuh-tempo"]').click();
      cy.contains("td", nomor).should("be.visible");
      cy.get('[data-testid="tab-dibayar-sebagian"]').click();
      cy.contains("td", nomor).should("be.visible");
    });
  });

  it("TC-0031 : Kirim Pembayaran Lunas", () => {
    const harga = "35000";
    const bayar = "35000";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('[name="pembelian.0.price"]').type(harga);
    cy.intercept("POST", "**/api/pembelian**").as("lunas");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@lunas", { timeout: 10000 }).then(({ response }) => {
      const nomor = response.body.nomor;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", nomor).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.contains("Kirim Pembayaran").clik();
      cy.inputkirimpembayaran();
      cy.get('[name="sub_total"]').type(bayar);
      cy.contains("Buat Pembayaran").click();
      cy.contains("Lanjutkan").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Pembayaran berhasil ditambahkan",
      );
      cy.get('[data-testid="tab-lunas"]').click();
      cy.contains("td", nomor).should("be.visible");
    });
  });

  it("TC-0032 : Void pembayaran", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('[name="pembelian.0.price"]').type("12000");
    cy.intercept("POST", "**/api/pembelian**").as("void");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@void", { timeout: 10000 }).then(({ response }) => {
      const nomor = response.body.nomor;
      cy.contains("td", nomor).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.contains("Void").click();
      cy.get("Konfirmasi").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "have.text",
        "Pembelian berhasil divoid",
      );
      cy.get('[data-testid="tab-void"]').click();
      cy.contains("td", nomor).should("be.visible");
    });
  });

  it("TC-0033 : Lihat lampiran pada detail pembelian", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get(".MuiGrid2-root > .MuiButton-contained").click();
    cy.get(".css-20tnkx > .MuiFormControl-root > .MuiInputBase-root").type(
      "PINV/0013",
    );
    cy.contains("td", "PINV/0013").click();
    cy.url().should("include", "/admin/purchases/detail");
    cy.get(
      ".css-18ouwo4 > .MuiCardContent-root > .MuiGrid2-container > :nth-child(2) > .MuiList-root > .MuiListItem-root > .MuiListItemText-root > .MuiTypography-body2",
    ).should("be.visible");
    cy.get(".MuiTypography-body2 > img").click();
  });

  it("TC-0034 : Validasi user belum login", () => {
    // Pastikan session kosong
    cy.clearCookies();
    cy.clearLocalStorage();
    // Coba akses halaman yang butuh login
    cy.visit("https://dev-cashbook.assist.id/admin/purchases");
    cy.url().should("include", "/login");
  });

  it("TC-0035 : Validasi login user (sudah login)", () => {
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click().should("not.visible");
    cy.get('[data-testid="appbar-profile-button"]').click();
    cy.get('[data-testid="appbar-menu-item-logout"]').click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.visit("https://dev-cashbook.assist.id/");
    cy.url().should("include", "/auth/login");
    cy.get("#email").type("arsadianazmi323@gmail.com");
    cy.get("#password").type("azmiii29");
    cy.get('[data-testid="login-submit-button"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("https://dev-cashbook.assist.id/admin/purchases");
    cy.url().should("include", "/admin/purchases");
  });

  it("TC-036 : Pastikan nomor pembelian yang dibuat selalu unik dan tidak duplikat", () => {
    const data = "PINV/0018";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get("#nomor").type(data);
    cy.isiinputinventory();
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      'Pembelian gagal ditambahkan, "Nomor pembelian sudah digunakan"',
    );
  });

  it("TC-0037 : Membatalkan pengisan form pembelian baru dan menampilkan konfirmasi pembatalan", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get(".css-1jszewn > .MuiButton-text").click();

    // tidak ada konfirmasi pembatalan
    cy.url().should("include", "/admin/purchases");
  });

  it("TC-0038 : Jatuh tempo saat sehari sebelum termin habis", () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // bulan mulai dari 0
    const yyyy = today.getFullYear();
    const tglSkrg = `${dd}/${mm}/${yyyy}`;

    cy.get(".MuiSkeleton-root").should("not.exist");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.contains("Pembelian Baru").click();
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

  it("TC-0039 :ketika data tidak boleh hit api berkali-kali", () => {
    cy.intercept("POST", "**/api/pembelian**").as("databaru");
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".MuiSkeleton-root").should("not.exist");
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiButton-contained").should("be.disabled");
    cy.wait("@databaru");
    cy.get("@databaru.all").should("have.length", 1);
  });

  it("TC-0040 : Menampilkan catatan pada detail pembelian", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("[placeholder='Cari']").type("PINV/0102");
    cy.contains("td", "PINV/0102").click();
    cy.url().should("include", "/admin/purchases/detail");
    cy.get(
      ".css-18ouwo4 > .MuiCardContent-root > .MuiGrid2-container > :nth-child(1) > .MuiList-root",
    ).should("be.visible");
  });

  it("TC-0041 : Upload File lampiran lebih dari 10 mb", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('input[type="file"]').attachFile("12mb.jpg");
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "File melebihi batas maksimum 10 MB.",
    );
  });

  it("TC-0042 : upload file lampiran selain format :PDF,JPG,JPEG,PNG", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get('input[type="file"]').attachFile("example.json");
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "File tidak valid. Hanya file dengan ekstensi .PDF, .JPG, .JPEG, .PNG yang diperbolehkan.",
    );
  });

  it("TC-0043 : badge tidak muncul jika data kosong", () => {
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

  it("TC-0044 : badge muncul jika ada data", () => {
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

  it("TC-0045 :  field wajib pada header form pembelian baru tidak diisi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get("#idSupplier").should("have.value", "");
    cy.get("#address").should("have.value", "");
    cy.get("[id='pembelian.0.tipe_pembelian']").click();
    cy.get('[data-value="Inventory"]').click();
    cy.get("[id='pembelian.0.product_id']").click();
    cy.get(".css-1scbymt").click();
    cy.get("[id='pembelian.0.gudang_id']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[name='pembelian.0.quantity']").type("2");
    cy.get("[id='pembelian.0.unit']").click();
    cy.get(".css-90sfc3").click();
    cy.get("[id='pembelian.0.akun_pembelian_id']").click();
    cy.get(".css-90sfc3").click();
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should("be.visible");
    cy.get(".MuiAlert-message").should(
      "contain.text",
      "Mohon periksa kembali form",
    );
    cy.get("#idSupplier-helper-text").should(
      "contain.text",
      "Nama harus diisi",
    );
    cy.get("#address-helper-text").should(
      "contain.text",
      "Alamat Penagihan harus diisi",
    );
  });

  it("TC-0046: ketika  field wajib pada detail item pembelian tidak diisi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get("#idSupplier").click();
    cy.get(".css-1scbymt").click();
    cy.get("#address").type("Jalan Pasar Minggu");
    cy.get("[id='pembelian.0.tipe_pembelian']").click();
    cy.get('[data-value="Inventory"]').click();
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should("be.visible");
    cy.get(".MuiAlert-message").should(
      "contain.text",
      "Mohon periksa kembali form",
    );
    cy.get("[id='pembelian.0.product_id-helper-text']").should(
      "contain.text",
      "Nama Produk harus diisi",
    );
    cy.get(
      ":nth-child(3) > .MuiFormControl-fullWidth > .MuiTypography-root",
    ).should("contain.text", "Gudang harus diisi");
    cy.get(
      ":nth-child(6) > .MuiFormControl-fullWidth > .MuiTypography-root",
    ).should("contain.text", "Satuan harus diisi");
    cy.get(
      ":nth-child(7) > .MuiFormControl-fullWidth > .MuiTypography-root",
    ).should("contain.text", "Akun Pembelian harus diisi");
  });

  // it("TC-0047 : Alamat penagihan tidak boleh berisi spasi saja", () => {});

  it("TC-0048 : kirim pembayaran tidak boeh melebihi total tagihan", () => {
    const sisaTagihan = 93500;
    function toRupiah(num) {
      return "Rp " + new Intl.NumberFormat("id-ID").format(num);
    }

    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 20000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get(".MuiGrid2-root > .MuiButton-contained").click();
    cy.get("[placeholder='Cari']").type("PINV/0034");
    cy.contains("td", "PINV/0034").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Kirim Pembayaran").click();
    cy.get("#metode").click();
    cy.get('[data-value="Tunai"]').click();
    cy.get('[data-testid="input-nomor_akun"] > .MuiInputBase-root').click();
    cy.get('[data-option-index="0"]').click();
    cy.contains(`Total Tagihan: ${toRupiah(sisaTagihan)}`).should("be.visible");
    cy.get("[name='sub_total']").clear().type("122000");
    cy.get("[name='sub_total']", { timeout: 5000 })
      .should("exist")
      .invoke("val")
      .then((val) => {
        expect(val).to.eq(toRupiah(sisaTagihan));
        cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
          "contain.text",
          "Jumlah bayar tidak boleh melebihi sisa tagihan",
        );
      });
  });

  // it("TC-0049 : produk aset berisi spasi", () => {});

  it("TC-0050 : menambahkan catatan pada pembeliian baru", () => {
    const catatan =
      "Pembelian ini dilakukan untuk memenuhi kebutuhan stok gudang utama menjelang akhir bulan. Barang akan digunakan untuk proyek internal dan distribusi ke beberapa cabang.";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 20000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.isiinputinventory();
    cy.get("[name='pembelian.0.price']").type("120000");
    cy.get("#notes").type(catatan);
    cy.intercept("POST", "**/api/pembelian**").as("createPurchase");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@createPurchase").then(({ response }) => {
      const nomorInvoice = response.body.nomor;
      cy.contains("td", nomorInvoice).click();
    });
    cy.url().should("include", "/admin/purchases/detail");
    cy.contains(catatan).should("exist");
  });

  it("TC-0051 : mengunjungi detail pembayaran ", () => {
    const pembayaran = "PINV/0249";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 20000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-dibayar-sebagian"]').click();
    cy.contains("td", pembayaran).click();
    cy.contains("td", "PPINV/0074").click();
    cy.url().should("include", "/admin/purchases/detail/payment");
    cy.get('[data-testid="admin-layout-page-title"] > span').should(
      "contain.text",
      "Detail Pembayaran",
    );
  });

  it("TC-0052  : Sistem menolak pembayaran dengan nomor transaksi duplikat", () => {
    const nomorInvoice = "PINV/0249";
    const nomorTransaksi = "PPINV/0074";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("[placeholder='Cari']").type(nomorInvoice);
    cy.contains("td", nomorInvoice).click();
    cy.contains("Pilih Tindakan").click();
    cy.get('[data-value="payment"]').click();
    cy.get("#nomor_transaksi").type(nomorTransaksi);
    cy.get("#metode").click();
    cy.get('[data-value="Tunai"]').click();
    cy.get('[data-testid="input-nomor_akun"] > .MuiInputBase-root').click();
    cy.get('[data-option-index="0"]').click();
    cy.get(".MuiButton-contained").click();
    cy.get('[data-testid="alert-dialog-submit-button"]').click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "contain.text",
      'Gagal menambahkan pembayaran, "Invoice number PPINV/0074 already exists.."',
    );
  });

  it("TC-0053 : Mengisi nomor pembelian secara manual", () => {
    const nomor = "AAJ1";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 20000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pembelian Baru").click();
    cy.get("#nomor").type(nomor);
    cy.isiinputinventory();
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.contains("td", nomor).should("be.visible");
  });

  it("TC-0054 : 'Ketika Metode Bayar & Setor Ke' tidak di isi", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 20000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("[placeholder='Cari']").type("PINV/0267");
    cy.contains("td", "PINV/0267").click();
    cy.contains("Pilih Tindakan").click();
    cy.get('[data-value="payment"]').click("topLeft");
    cy.get("#metode").should("have.value", "");
    cy.get("#nomor_akun").should("have.value", "");
    cy.contains("Buat Pembayaran").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "contain.text",
      "Mohon periksa kembali form",
    );
    cy.get(".MuiFormControl-fullWidth > .MuiTypography-root").should(
      "contain.text",
      "Metode Bayar harus diisi",
    );
    cy.get("#nomor_akun-helper-text").should(
      "contain.text",
      "Pilih Akun harus diisi",
    );
  });

  it("TC-0055 : Upload file pada kirim pembayaran", () => {
    const noInvoice = "PINV/0267";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 20000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get("[placeholder='Cari']").type(noInvoice);
    cy.contains("td", noInvoice).click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Kirim Pembayaran").click({ force: true });
    cy.get("#metode").click();
    cy.get('[data-value="Tunai"]').click();
    cy.get("#nomor_akun").click();
    cy.get('[data-option-index="0"]').click();
    cy.get('input[type="file"]').attachFile("cute.jpg");
    cy.contains("cute.jpg").should("exist");
  });

  // it('TC-0056 : Validasi pemotongan persen pada pembelian baru setelah disimpan', () => { // });

  it("TC-0057 : Perhitungan Total Bayar dengan Potongan  saat Kirim Pembayaran", () => {
    cy.intercept(
      "GET",
      "**/api/pembelian/e52e6dd0-ed05-11f0-8a65-9d07d01cbcb3?**",
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
        rupiah(totalBayar),
      );
      cy.get(":nth-child(7) > :nth-child(2)").should(
        "contain",
        rupiah(sisaAkhir),
      );
    });
  });

  // BLUM MANUAL
  it("TC-0058 : Lihat lampiran riwayat pembayaran ", () => {
    const noInvoice = "PINV/0267";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 20000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get("[placeholder='Cari']").type(noInvoice);
    cy.contains("td", noInvoice).click();
    cy.get("td button").eq(2).click();
    cy.get(".MuiPaper-root > img").should("be.visible");
  });

  it("TC-0059 : Menambahkan catatan pada pembayaran", () => {
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 20000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("td button").eq(0).click();
    cy.contains("Pilih Tindakan").click();
    cy.get('[data-value="payment"]').click();
    cy.inputkirimpembayaran();
    cy.get('[id="catatan"]').type(
      "euhfehureuwhfhierehshdyeyreyryduuryryueyruewuyruywyrfhdgyfgydfyyrryryyryyryryrry",
    );
    cy.get('[name="catatan"]').should("be.visible");
  });

  it("TC-0060 : menampilkan catatan pembayaran pada detail pembelian", () => {
    const nomor = "PINV/0320";
    cy.get('[data-testid="drawer-item-purchases"]', { timeout: 20000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("[placeholder='Cari']").type(nomor);
    cy.contains(nomor).click();
    cy.url().should("include", "/admin/purchases/detail");
    cy.get(".MuiTableBody-root > :nth-child(2) > :nth-child(3)").should(
      "be.visible",
      "",
    );
  });
});
