// js/stok-app.js

new Vue({
  el: "#stok-app",
  data: function () {
    const d = window.dataBahanAjar || {};
    return {
      upbjjList: d.upbjjList || [],
      kategoriList: d.kategoriList || [],
      stok: (d.stok || []).map(item => Object.assign({}, item)),
      filters: {
        selectedUpbjj: "",
        selectedKategori: "",
        onlyBelowSafety: false,
        onlyEmpty: false,
        sortField: "judul",
        sortDir: "asc"
      },
      newStock: {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: null,
        qty: null,
        safety: null,
        catatanHTML: ""
      },
      formErrors: [],
      lastSaveMessage: "",
      filterInfoMessage: "Belum ada filter yang diterapkan.",
      qtyHintMessage: ""
    };
  },
  computed: {
    filteredAndSortedStok: function () {
      // computed agar tidak recompute manual tiap filter diubah
      let result = this.stok;

      if (this.filters.selectedUpbjj) {
        result = result.filter(
          item => item.upbjj === this.filters.selectedUpbjj
        );
      }

      if (this.filters.selectedKategori) {
        result = result.filter(
          item => item.kategori === this.filters.selectedKategori
        );
      }

      if (this.filters.onlyBelowSafety) {
        result = result.filter(item => item.qty < item.safety);
      }

      if (this.filters.onlyEmpty) {
        result = result.filter(item => item.qty === 0);
      }

      // sort
      const field = this.filters.sortField;
      const dir = this.filters.sortDir === "asc" ? 1 : -1;

      result = result.slice().sort((a, b) => {
        let va = a[field];
        let vb = b[field];

        if (typeof va === "string") {
          va = va.toLowerCase();
          vb = vb.toLowerCase();
        }

        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });

      return result;
    }
  },
  watch: {
    "filters.selectedUpbjj": function (newVal) {
      // watcher 1: reset kategori jika upbjj berubah
      this.filters.selectedKategori = "";
      if (newVal) {
        this.filterInfoMessage =
          "Filter UT-Daerah: " +
          newVal +
          ". Pilih kategori untuk mempersempit hasil.";
      } else {
        this.filterInfoMessage = "Belum ada filter yang diterapkan.";
      }
    },
    "newStock.qty": function (newQty) {
      // watcher 2: memberi hint jika qty terlalu kecil
      if (newQty === null || newQty === undefined) {
        this.qtyHintMessage = "";
        return;
      }
      if (newQty === 0) {
        this.qtyHintMessage =
          "Qty = 0, pertimbangkan stok awal yang cukup agar tidak langsung kosong.";
      } else if (newQty < (this.newStock.safety || 0)) {
        this.qtyHintMessage =
          "Qty lebih kecil dari safety stock. Sistem akan menandai sebagai 'Menipis'.";
      } else {
        this.qtyHintMessage = "Qty sudah lebih besar atau sama dengan safety stock.";
      }
    }
  },
  methods: {
    formatRupiah: function (angka) {
      if (angka == null) return "";
      return (
        "Rp " +
        angka
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      );
    },
    statusClass: function (item) {
      if (item.qty === 0) {
        return "badge-danger";
      } else if (item.qty < item.safety) {
        return "badge-warning";
      } else {
        return "badge-safe";
      }
    },
    statusText: function (item) {
      if (item.qty === 0) return "Kosong";
      if (item.qty < item.safety) return "Menipis";
      return "Aman";
    },
    resetFilters: function () {
      this.filters.selectedUpbjj = "";
      this.filters.selectedKategori = "";
      this.filters.onlyBelowSafety = false;
      this.filters.onlyEmpty = false;
      this.filters.sortField = "judul";
      this.filters.sortDir = "asc";
      this.filterInfoMessage = "Filter di-reset ke kondisi awal.";
    },
    validateNewStock: function () {
      const errors = [];

      if (!this.newStock.kode) errors.push("Kode Mata Kuliah harus diisi.");
      if (!this.newStock.judul) errors.push("Judul Mata Kuliah harus diisi.");
      if (!this.newStock.kategori)
        errors.push("Kategori Mata Kuliah harus dipilih.");
      if (!this.newStock.upbjj) errors.push("UT-Daerah harus dipilih.");
      if (!this.newStock.lokasiRak)
        errors.push("Lokasi rak harus diisi untuk memudahkan pencarian.");
      if (this.newStock.harga == null || this.newStock.harga < 0)
        errors.push("Harga harus diisi dan tidak boleh negatif.");
      if (this.newStock.qty == null || this.newStock.qty < 0)
        errors.push("Qty harus diisi dan tidak boleh negatif.");
      if (this.newStock.safety == null || this.newStock.safety < 0)
        errors.push("Safety stock harus diisi dan tidak boleh negatif.");

      return errors;
    },
    submitNewStock: function () {
      this.formErrors = this.validateNewStock();
      if (this.formErrors.length > 0) {
        return;
      }

      // push ke stok
      this.stok.push({
        kode: this.newStock.kode,
        judul: this.newStock.judul,
        kategori: this.newStock.kategori,
        upbjj: this.newStock.upbjj,
        lokasiRak: this.newStock.lokasiRak,
        harga: this.newStock.harga,
        qty: this.newStock.qty,
        safety: this.newStock.safety,
        catatanHTML: this.newStock.catatanHTML || ""
      });

      this.lastSaveMessage =
        "Data stok baru dengan kode " +
        this.newStock.kode +
        " berhasil ditambahkan.";

      // reset form
      this.newStock = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: null,
        qty: null,
        safety: null,
        catatanHTML: ""
      };
      this.qtyHintMessage = "";
      this.formErrors = [];
    },
    saveRow: function (item) {
      this.lastSaveMessage =
        "Perubahan stok untuk " +
        item.kode +
        " (" +
        item.judul +
        ") tersimpan di memori aplikasi.";
      // dalam tugas ini tidak perlu kirim ke server / API
    }
  }
});
