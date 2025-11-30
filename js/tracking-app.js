// js/tracking-app.js
new Vue({
  el: '#trackingApp',
  data: {
    paket: dummyData.paket,
    tracking: { ...dummyData.tracking },
    form: {
      nim: '',
      nama: '',
      ekspedisi: '',
      paket: '',
      tanggalKirim: new Date().toISOString().split('T')[0],
      total: 0
    }
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    selectedPaket() {
      return this.paket.find(p => p.kode === this.form.paket);
    },
    nextSequence() {
      const year = new Date().getFullYear();
      const prefix = `DO${year}-`;
      const keys = Object.keys(this.tracking)
        .filter(k => k.startsWith(prefix))
        .map(k => parseInt(k.split('-')[1]))
        .sort((a, b) => b - a);
      const next = (keys[0] || 0) + 1;
      return `${prefix}${next.toString().padStart(3, '0')}`;
    }
  },
  methods: {
    onPaketChange() {
      this.form.total = this.selectedPaket ? this.selectedPaket.harga : 0;
    },
    addDO() {
      if (!this.form.nim || !this.form.nama || !this.form.ekspedisi || !this.form.paket) {
        alert('Harap isi semua field!');
        return;
      }
      if (this.form.nim.length !== 9 || !/^\d+$/.test(this.form.nim)) {
        alert('NIM harus 9 digit angka!');
        return;
      }

      const noDO = this.nextSequence;
      this.$set(this.tracking, noDO, {
        nim: this.form.nim,
        nama: this.form.nama,
        ekspedisi: this.form.ekspedisi,
        paket: this.form.paket,
        tanggalKirim: this.form.tanggalKirim,
        total: this.form.total,
        status: "Dalam Perjalanan"
      });

      // Reset form
      this.form = {
        nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: this.today, total: 0
      };
    }
  },
  watch: {
    'form.paket'(newVal) {
      this.form.total = this.selectedPaket ? this.selectedPaket.harga : 0;
    }
  }
});