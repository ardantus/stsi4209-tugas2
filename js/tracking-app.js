// js/tracking-app.js

new Vue({
  el: "#tracking-app",
  data: function () {
    const d = window.dataBahanAjar || {};
    const initialTracking = (d.initialTracking || []).map(it => Object.assign({}, it));

    return {
      upbjjList: d.upbjjList || [],
      pengirimanList: d.pengirimanList || [],
      paket: d.paket || [],
      doList: initialTracking,
      form: {
        nim: "",
        nama: "",
        upbjj: "",
        ekspedisiKode: "",
        paketKode: "",
        tanggalKirim: this.todayString()
      },
      formErrors: [],
      paketHintMessage: "",
      doListInfoMessage: ""
    };
  },
  computed: {
    nextDoNumber: function () {
      // Format: DOYYYY-XXX (3 digit sequence)
      const year = new Date().getFullYear();
      const prefix = "DO" + year + "-";

      let maxSeq = 0;
      this.doList.forEach(item => {
        if (item.noDo && item.noDo.startsWith("DO")) {
          const parts = item.noDo.split("-");
          const seqStr = parts[1] || "0000";
          const seq = parseInt(seqStr, 10) || 0;
          if (seq > maxSeq) maxSeq = seq;
        }
      });

      const nextSeq = maxSeq + 1;
      const padded = String(nextSeq).padStart(4, "0");
      return prefix + padded;
    },
    selectedPaket: function () {
      if (!this.form.paketKode) return null;
      return this.paket.find(p => p.kode === this.form.paketKode) || null;
    }
  },
  watch: {
    "form.paketKode": function (newVal) {
      if (!newVal) {
        this.paketHintMessage =
          "Pilih paket untuk menampilkan detail isi paket dan total harga.";
        return;
      }
      const p = this.paket.find(p => p.kode === newVal);
      if (p) {
        this.paketHintMessage =
          "Paket " +
          p.nama +
          " dipilih. Pastikan isi paket sesuai dengan KRS mahasiswa.";
      } else {
        this.paketHintMessage = "";
      }
    },
    doList: {
      handler: function (newList) {
        if (newList.length === 0) {
          this.doListInfoMessage = "Belum ada data DO tersimpan.";
        } else {
          this.doListInfoMessage =
            "Total DO tercatat: " +
            newList.length +
            ". Terakhir: " +
            newList[newList.length - 1].noDo;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    todayString: function () {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return y + "-" + m + "-" + day;
    },
    formatRupiah: function (angka) {
      if (angka == null) return "";
      return (
        "Rp " +
        angka
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      );
    },
    validateForm: function () {
      const errors = [];

      if (!this.form.nim) errors.push("NIM harus diisi.");
      if (!this.form.nama) errors.push("Nama harus diisi.");
      if (!this.form.upbjj) errors.push("UT-Daerah harus dipilih.");
      if (!this.form.ekspedisiKode) errors.push("Ekspedisi harus dipilih.");
      if (!this.form.paketKode) errors.push("Paket bahan ajar harus dipilih.");
      if (!this.form.tanggalKirim) errors.push("Tanggal kirim harus diisi.");

      return errors;
    },
    resetForm: function () {
      this.form = {
        nim: "",
        nama: "",
        upbjj: "",
        ekspedisiKode: "",
        paketKode: "",
        tanggalKirim: this.todayString()
      };
      this.formErrors = [];
      this.paketHintMessage = "";
    },
    submitDO: function () {
      this.formErrors = this.validateForm();
      if (this.formErrors.length > 0) {
        return;
      }

      const eksp = this.pengirimanList.find(
        e => e.kode === this.form.ekspedisiKode
      );
      const selectedPaket = this.selectedPaket;

      const newDo = {
        noDo: this.nextDoNumber,
        nim: this.form.nim,
        nama: this.form.nama,
        upbjj: this.form.upbjj,
        ekspedisiKode: eksp ? eksp.kode : "",
        ekspedisiNama: eksp ? eksp.nama : "",
        paketKode: this.form.paketKode,
        tanggalKirim: this.form.tanggalKirim,
        total: selectedPaket ? selectedPaket.harga : 0,
        status: "Dalam Proses"
      };

      this.doList.push(newDo);

      // setelah simpan, reset form (tapi tanggal bisa tetap hari ini)
      const message =
        "Delivery Order " +
        newDo.noDo +
        " berhasil disimpan untuk mahasiswa " +
        newDo.nama +
        " (" +
        newDo.nim +
        ").";

      alert(message);
      this.resetForm();
    }
  },
  mounted: function () {
    if (!this.form.paketKode) {
      this.paketHintMessage =
        "Pilih salah satu paket untuk melihat isi dan total harga.";
    }
  }
});
