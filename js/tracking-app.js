// js/tracking-app.js
new Vue({
  el: '#trackingApp',
  data: {
    paket: app.$data.paket,
    tracking: { ...app.$data.tracking },
    form: {
      nim: '',
      nama: '',
      ekspedisi: '',
      paket: '',
      tanggalKirim: '',
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
    paketMap() {
      return this.paket.reduce((map, p) => {
        map[p.kode] = p;
        return map;
      }, {});
    },
    nextSequence() {
      const year = new Date().getFullYear();
      const prefix = `DO${year}-`;
      const keys = Object.keys(this.tracking)
        .filter(k => k.startsWith(prefix))
        .map(k => parseInt(k.split('-')[1]))
        .sort((a, b) => b - a);
      const next = keys.length > 0 ? keys[0] + 1 : 1;
      return `${prefix}${next.toString().padStart(3, '0')}`;
    }
  },
  methods: {
    onPaketChange() {
      this.form.total = this.selectedPaket?.harga || 0;
    },
    addDO() {
      const noDo = this.nextSequence;
      this.$set(this.tracking, noDo, {
        nim: this.form.nim,
        nama: this.form.nama,
        ekspedisi: this.form.ekspedisi,
        paket: this.form.paket,
        tanggalKirim: this.form.tanggalKirim,
        total: this.form.total,
        status: "Dalam Perjalanan",
        perjalanan: [
          { waktu: `${this.form.tanggalKirim} 09:00:00`, keterangan: "Penerimaan di Loket" }
        ]
      });
      this.resetForm();
    },
    resetForm() {
      this.form = {
        nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: this.today, total: 0
      };
    }
  },
  watch: {
    'form.paket'(newVal) {
      if (newVal) {
        const pkg = this.paket.find(p => p.kode === newVal);
        if (pkg) this.form.total = pkg.harga;
      }
    },
    tracking: {
      handler() {
        console.log('Tracking diperbarui:', Object.keys(this.tracking).length);
      },
      deep: true
    }
  }
});