// js/stok-app.js
new Vue({
  el: '#stokApp',
  data: {
    upbjjList: app.$data.upbjjList,
    kategoriList: app.$data.kategoriList,
    stok: app.$data.stok.map(s => ({ ...s })), // clone
    filter: {
      upbjj: '',
      kategori: '',
      lowStock: false
    },
    sortBy: 'judul',
    form: {
      kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '',
      harga: 0, qty: 0, safety: 0, catatanHTML: ''
    },
    editMode: false,
    editIndex: -1
  },
  computed: {
    filteredKategori() {
      if (!this.filter.upbjj) return [];
      return [...new Set(this.stok
        .filter(s => s.upbjj === this.filter.upbjj)
        .map(s => s.kategori)
      )].sort();
    },
    filteredStok() {
      let result = this.stok.filter(item => {
        if (this.filter.upbjj && item.upbjj !== this.filter.upbjj) return false;
        if (this.filter.kategori && item.kategori !== this.filter.kategori) return false;
        if (this.filter.lowStock && item.qty >= item.safety) return false;
        return true;
      });

      // Sort
      result.sort((a, b) => {
        if (this.sortBy === 'judul') return a.judul.localeCompare(b.judul);
        if (this.sortBy === 'qty') return a.qty - b.qty;
        if (this.sortBy === 'harga') return a.harga - b.harga;
        return 0;
      });

      return result;
    }
  },
  methods: {
    onUpbjjChange() {
      this.filter.kategori = '';
    },
    resetFilters() {
      this.filter = { upbjj: '', kategori: '', lowStock: false };
      this.sortBy = 'judul';
    },
    editItem(item) {
      this.form = { ...item };
      this.editMode = true;
      this.editIndex = this.stok.indexOf(item);
    },
    cancelEdit() {
      this.editMode = false;
      this.editIndex = -1;
      this.resetForm();
    },
    saveItem() {
      if (this.editMode) {
        this.$set(this.stok, this.editIndex, { ...this.form });
      } else {
        this.stok.push({ ...this.form });
      }
      this.cancelEdit();
    },
    resetForm() {
      this.form = {
        kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '',
        harga: 0, qty: 0, safety: 0, catatanHTML: ''
      };
    }
  },
  watch: {
    'filter.upbjj'(newVal) {
      if (!newVal) this.filter.kategori = '';
    },
    'stok': {
      handler() {
        console.log('Stok berubah:', this.stok.length, 'item');
      },
      deep: true
    },
    'filter.lowStock'(val) {
      console.log('Filter lowStock:', val);
    }
  }
});