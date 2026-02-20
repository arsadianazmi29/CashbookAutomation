describe("halaman biaya", () => {
  beforeEach(() => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
  });

  it("TC-001 : mengunjungi halaman biaya", () => {
    cy.get('[data-testid="drawer-item-expenses"]').should("be.visible");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.url().should("include", "/admin/expenses");
  });

  it("TC-002 : Breadcrumbs hal biaya dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".MuiBreadcrumbs-ol > :nth-child(1) > .MuiTypography-root")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/dashboard");
  });

  it("TC-003 : Breadcrumbs  biaya baru dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get(":nth-child(3) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/expenses");
  });

  it("TC-004 : Breadcrumbs  Detail biaya  dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get("td button").eq(0).click();
    cy.get(":nth-child(3) > .MuiTypography-root > span")
      .should("be.visible")
      .click();
    cy.url().should("include", "/admin/expenses");
  });

  it("TC-005 : Breadcrumbs  Detail pembayaran dapat diklik dan berfungsi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-lunas"]').click();
    cy.get("td button").eq(0).click();
  });

  it("TC-006 : Menampilkan skeleton loading pada menu bayar", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".MuiSkeleton-root").should("be.visible");
  });

  it("TC-007 : menampilkan data kosong", () => {
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

  it("TC-008 : Tab status bayar menampilkan data sesuaai status", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();

    cy.cekstatus("Belum Dibayar");
    cy.cekstatus("Jatuh Tempo");
    cy.cekstatus("Lunas");
    cy.cekstatus("Dibayar Sebagian");
    cy.cekstatus("Void");
  });

  it("TC-009 : Mencari data bayar berdasarkan nomor Unique ", () => {
    const nomorInvoice = "BINV/0033";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[placeholder="Cari Biaya"]').type(nomorInvoice);
    cy.contains("td", nomorInvoice).should("be.visible");
  });

  it("TC-010 :hasil search sesuai dengan nama pelanggan", () => {
    const namaPelanggan = "Raska Zhidanind Ramadhan";
    cy.intercept("GET", "**/api/biayas**").as("databiaya");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.wait("@databiaya");
    cy.get("input[placeholder='Cari Biaya']").clear().type(namaPelanggan);
    cy.wait("@databiaya");
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    cy.get("table tbody tr td:nth-child(3)").each(($td) => {
      cy.wrap($td).invoke("text").should("contain", namaPelanggan);
    });
  });

  it("TC-011 : Filter tanggal data biaya berdasarkan rentang tanggal", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept(
      "GET",
      "**/api/biayas?search=&status=&startDate=2026-01-20&endDate=2026-01-21&skip=0&limit=10&companyId=b1e0a510**",
    ).as("Tunggu");
    // Klik filter tanggal
    cy.get(".MuiBox-root > .MuiButtonBase-root").click();
    cy.get('[placeholder="DD/MM/YYYY"]').eq(0).clear().type("20012026");
    cy.get('[placeholder="DD/MM/YYYY"]').eq(1).clear().type("21012026");
    cy.contains("Apply").click();

    cy.wait("@Tunggu");

    // Definisikan tanggal range
    const startDate = new Date(2026, 0, 20); // bulan 7 = Agustus (0-based)
    const endDate = new Date(2026, 0, 21);

    // Gunakan should agar Cypress retry sampai data tabel valid
    cy.get("tr td:nth-child(1)").should(($tds) => {
      expect($tds.length, "Data tabel kosong").to.be.greaterThan(0); //expectasi jika data ada

      $tds.each((i, td) => {
        // Cypress ngecek setiap baris tabel satu per satu
        const text = td.innerText.trim();
        const [day, month, year] = text.split("/");
        const cellDate = new Date(
          2000 + parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
        );

        expect(cellDate, `Tanggal ${text} di luar rentang`).to.be.within(
          // cek apakah data dalam rentang tertentu
          startDate,
          endDate,
        );
      });
    });
  });

  it("TC-013 : menampilkan pagination pada tabel biaya", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="pagination-label"]').should("be.visible");
  });

  it("TC-014 : Populate data otomatis pada form biaya baru", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('[id="recipient"]').click();
    cy.get("#recipient-listbox").should("be.visible");
    cy.get('[data-option-index="3"]').click();
    cy.get("#recipient").should("have.value", "Rayhan Rayandra");
  });

  it("TC-015 : Form berhasil tersimpan jika seluruh input wajib telah terisi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarulunas();
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "berhasil menambahkan biaya baru",
    );
  });

  it("TC-016 : Validasi input wajib diisi pada form biaya baru jika tidak diisi", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.contains("Konfirmasi Simpan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Periksa input yang wajib diisi.",
    );
  });

  it("TC-017 : Upload File pada biaya baru", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('input[type="file"]').attachFile("meowww.jpg");
    cy.contains("meowww.jpg").should("exist");
  });

  it("TC-018 : Upload file pada biaya baru melebihi 10 mb", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('input[type="file"]').attachFile("12mb.jpg");
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "File melebihi batas maksimum 10 MB.",
    );
  });

  it("TC-019 : Upload file pada biaya baru dengan format yang tidak sesuai ketentuan", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('input[type="file"]').attachFile("example.json");
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "File tidak valid. Hanya file dengan ekstensi .PDF, .JPG, .JPEG, .PNG yang diperbolehkan.",
    );
  });

  it("TC-020 : Menambahkan catatan", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('[id="note"]').type("qwertyuiopasdfghjklzxcvbnm");
  });

  it("TC-021 : Menambah dan menghapus baris item pada form biaya", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.contains("Baris Baru").click();
    cy.get(".MuiTableBody-root > :nth-child(2) >").should("be.visible");
    cy.get(":nth-child(2) > .css-1dnk9te > .MuiButtonBase-root")
      .click()
      .should("not.exist");
  });

  it("TC-022 : Menambahkan biaya baru dengan status belum dibayar", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarubelumdibayar();
    cy.get('[name="details.0.amount"]').type("12000");
    cy.intercept("POST", "**/api/biayas**").as("databaru");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@databaru", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      const status = response.body.status;
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "have.text",
        "Berhasil Menambahkan Data Biaya Baru.",
      );
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", status);
    });
  });

  it("TC-023 : Menambahkan biaya baru dengan status lunas", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarulunas();
    cy.intercept("POST", "**/api/biayas**").as("databaru");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@databaru", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      const status = response.body.status;
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "have.text",
        "Berhasil Menambahkan Data Biaya Baru.",
      );
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", status);
    });
  });

  it("TC-024 : Mengunjungi detail biaya ", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("td button").eq(0).click();
    cy.url().should("include", "/admin/expenses/detail");
  });

  it("TC-025 : Mengunjungi detail kontak pelanggan", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get("td button").eq(1).click();
    cy.get('[data-testid="admin-layout-page-title"] > span').should(
      "contain.text",
      "Detail Kontak",
    );
  });

  it("TC-026 : Membatalkan menambah data biaya baru", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.contains("Batalkan").should("be.visible").click();
    cy.url().should("include", "/admin/expenses");
  });

  it("TC-027 : kalkulasi nilai akhir sisa tagihan, melibatkan PPN,  jumlah, dan potongan", () => {
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

  it("TC-027 : Kirim pembayaran sebagian", () => {
    const jumlah = "10000";
    const bayar = "5000";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarubelumdibayar();
    cy.get('[name="details.0.amount"]').type(jumlah);
    cy.intercept("POST", "**/api/biayas**").as("sebagian");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@sebagian", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", transaction).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.get('[data-value="terimaPembayaran"]').scrollIntoView().click();
      cy.get('[id="metode"]').click();
      cy.get('[data-value="tunai"]').click();
      cy.get('[data-testid="input-nomor_akun"]').click();
      cy.get('[data-option-index="0"]').click();
      cy.get('[name="sub_total"]').type(bayar);
      cy.contains("Buat Pembayaran").click();
      cy.contains("Lanjutkan").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Pembayaran berhasil ditambahkan",
      );
      cy.get('[data-testid="tab-dibayar-sebagian"]').click();
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", "Dibayar Sebagian");
    });
  });

  it("TC-028 : Kirim pembayaran lunas", () => {
    const jumlah = "10000";
    const bayar = "10000";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarubelumdibayar();
    cy.get('[name="details.0.amount"]').type(jumlah);
    cy.intercept("POST", "**/api/biayas**").as("lunas");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@lunas", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", transaction).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.get('[data-value="terimaPembayaran"]').scrollIntoView().click();
      cy.get('[id="metode"]').click();
      cy.get('[data-value="tunai"]').click();
      cy.get('[data-testid="input-nomor_akun"]').click();
      cy.get('[data-option-index="0"]').click();
      cy.get('[name="sub_total"]').type(bayar);
      cy.contains("Buat Pembayaran").click();
      cy.contains("Lanjutkan").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Pembayaran berhasil ditambahkan",
      );
      cy.get('[data-testid="tab-lunas"]').click();
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", "Lunas");
    });
  });

  it("TC-029 : Void", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarubelumdibayar();
    cy.intercept("POST", "**/api/biayas**").as("void");
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@void", { timeout: 10000 }).then(({ response }) => {
      const transaction = response.body.transaction_number;
      cy.get('[data-testid="tab-belum-dibayar"]').click();
      cy.contains("td", transaction).should("be.visible").click();
      cy.contains("Pilih Tindakan").click();
      cy.get('[data-value="void"]').scrollIntoView().click();
      cy.contains("Konfirmasi").click();
      cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
        "contain.text",
        "Biaya berhasil di void",
      );
      cy.get('[data-testid="tab-void"]').click();
      cy.contains("td", transaction)
        .closest("tr")
        .find("td")
        .eq(4)
        .should("contain.text", "Void");
    });
  });

  it("TC-030 : lihat lampiran pada detail biaya", () => {
    const lampiran = "BINV/0042";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[placeholder="Cari Biaya"]').type(lampiran);
    cy.contains("td", lampiran).click();
    cy.get(".css-1n5khr6 > .MuiButtonBase-root").click();
    cy.get(".MuiPaper-root > img").should("be.visible");
  });

  it("TC-031 : Menampilkan catatan pada detail biaya", () => {
    const catatan = "BINV/0131";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[placeholder="Cari Biaya"]').type(catatan);
    cy.contains("td", catatan).click();
    cy.get(".css-unbmco").should("be.visible");
  });

  it("TC-032 : user belum login", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.url().should("include", "/login");
  });

  it("TC-033 : user sudah login", () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("https://dev-cashbook.assist.id/");
    cy.url().should("include", "/auth/login");
    cy.get("#email").type("arsadianazmi323@gmail.com");
    cy.get("#password").type("azmiii29");
    cy.get('[data-testid="login-submit-button"]').click();
    cy.url().should("include", "/admin/dashboard");
    cy.visit("https://dev-cashbook.assist.id/admin/expenses");
    cy.url().should("include", "/admin/expenses");
  });

  it("TC-034 : nomor pelanggan tidak duplikat", () => {
    const pelanggan = "BINV/0079";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.get('[id="transaction_number"]').type(pelanggan);
    cy.biayabarulunas();
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      'Gagal menyimpan data biaya, "Nomor invoice BINV/0079 sudah ada. "',
    );
  });

  it("TC-035 : Nomor transaksi tidak boleh duplikat", () => {
    const noPelanggan = "BINV/0118";
    const noTransaksi = "PBINV/0033";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get('[placeholder="Cari Biaya"]').type(noPelanggan);
    cy.contains("td", noPelanggan).click();
    cy.get(".MuiSelect-select > span").click();
    cy.get('[data-value="terimaPembayaran"]').scrollIntoView().click();
    cy.get('[id="nomor_transaksi"]').type(noTransaksi);
    cy.get('[id="metode"]').click();
    cy.get('[data-value="tunai"]').click();
    cy.get('[data-testid="input-nomor_akun"]').click();
    cy.get('[data-option-index="0"]').click();
    cy.contains("Buat Pembayaran").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "contain.text",
      "Gagal menambahkan pembayaran",
    );
  });

  it("TC-036 : Sistem menolak Pemotongan pada biaya baru  jika diisi 0", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarulunas();
    cy.get('[name="is_discount"]').click();
    cy.get('[data-testid="expenses-summary-discount-value"]').should(
      "have.value",
      "0",
    );
    cy.contains("Konfirmasi Simpan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Periksa input yang wajib diisi.",
    );
    cy.get(".css-axw7ok").should(
      "contain.text",
      "Nilai diskon harus lebih dari 0",
    );
  });

  it("TC-037 : Sistem menolak Pemotongan pada pembayaran  jika diisi 0", () => {
    const noPelanggan = "BINV/0118";
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.alltime();
    cy.get('[placeholder="Cari Biaya"]').type(noPelanggan);
    cy.contains("td", noPelanggan).click();
    cy.get(".MuiSelect-select > span").click();
    cy.get('[data-value="terimaPembayaran"]').scrollIntoView().click();
    cy.get('[id="metode"]').click();
    cy.get('[data-value="tunai"]').click();
    cy.get('[data-testid="input-nomor_akun"]').click();
    cy.get('[data-option-index="0"]').click();
    cy.get('[name="isPemotongan"]').click();
    cy.get('[name="potongan_value"]').should("have.value", "0");
    cy.contains("Buat Pembayaran").click();
    cy.contains("Lanjutkan").click();
    cy.get(".MuiSnackbar-root > .MuiPaper-root").should(
      "have.text",
      "Mohon periksa kembali form",
    );
    cy.contains("Nilai potongan harus lebih dari 0").should("be.visible");
  });

  it("TC-038 : Badge tidak ditampilkan saat data kosong", () => {
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

  it("TC-039 : badge muncul ketika ada data", () => {
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

  it("TC-040 : Menampilkan card data biaya bulan ini", () => {
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
          expect(actual).to.eq(nominal);
        });
    });
  });

  it("TC-041 : Menampilkan card data Biaya 30 Hari Terakhir", () => {
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
          expect(actual).to.eq(nominal);
        });
    });
  });

  it("TC-042 : Menampilkan card data Biaya Belum Dibayar", () => {
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
          expect(actual).to.eq(nominal);
        });
    });
  });

  it.only("TC-043 : Status Jatuh Tempo sehari sebelum termin habis", () => {
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
    cy.wait("@databaru", { timeout: 15000 }).then(({ response }) => {
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
      // Ambil baris tabel berdasarkan nomor invoice
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

  it("TC-044 : batal menambah pembayaran", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-belum-dibayar"]').click();
    cy.get("td button").eq(0).click();
    cy.contains("Pilih Tindakan").click();
    cy.get('[data-value="terimaPembayaran"]').click();
    cy.scrollTo("bottom");
    cy.contains("Batalkan").should("be.visible").click();
    cy.url().should("include", "/admin/expenses/detail");
  });

  it("TC-045 : batalkan void", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.get('[data-testid="tab-belum-dibayar"]').click();
    cy.get("td button").eq(0).click();
    cy.get(".MuiBox-root > .MuiInputBase-root > .MuiSelect-select").click();
    cy.get('[data-value="void"]').click();
    cy.contains("Batalkan").should("be.visible").click();
    cy.url().should("include", "/admin/expenses/detail");
  });

  it("TC-046 : ketika data tidak boleh hit api berkali-kali", () => {
    cy.login("arsadianazmi323@gmail.com", "azmiii29");
    cy.intercept("POST", "**/api/biayas**").as("databaru");
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.contains("Pilih Tindakan").click();
    cy.contains("Biaya Baru").click();
    cy.biayabarulunas();
    cy.contains("Konfirmasi Simpan").click();
    cy.contains("Lanjutkan").click();
    cy.wait("@databaru");
    cy.get("@databaru.all").should("have.length", 1);
  });

  it("TC-047 : Jatuh Tempo otomatis berubah sesuai Syarat Pembayaran (Termin)", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".MuiSkeleton-root").should("not.exist");
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

  it("TC-048 : Menampilkan tabel data tab semua ", () => {
    cy.get('[data-testid="drawer-item-expenses"]', { timeout: 10000 }).click();
    cy.get(".qcw-trigger-btn > .svelte-7gdhvy").click();
    cy.intercept("GET", "**/api/biayas**").as("semua");
    cy.get('[data-testid="tab-semua"]').should("be.visible");
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
    cy.wait("@semua");
    cy.get("table tbody tr td:nth-child(5)").each(($td) => {
      expect([
        "Lunas",
        "Belum Dibayar",
        "Jatuh Tempo",
        "Dibayar Sebagian",
        "Void",
      ]).to.include($td.text().trim());
    });
  });

  it("TC-049 : Menampilkan tabel data tab belum dibayar", () => {
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

  it("TC-050 : Menampilkan tabel data tab jatuh tempo ", () => {
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
      expect(["Jatuh Tempo"]).to.include($td.text().trim());
    });
  });

  it("TC-051 : Menampilkan table data tab lunas ", () => {
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

  it("TC-052 : Menamapilkan tabel data tab dibayar sebagian", () => {
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

  it("TC-053 : Menamapilkan tabel data tab void", () => {
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

  it("", () => {});
});
