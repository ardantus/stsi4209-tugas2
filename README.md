# Tugas Praktik 2 – Vue.js

### Struktur Folder Proyek

```text
tugas2-vue-ut/
├── index.html          → Halaman utama dengan navigasi
├── stok.html           → Halaman Stok Bahan Ajar (WAJIB)
├── tracking.html       → Halaman Tracking Delivery Order (WAJIB)
├── css/
│   └── style.css       → Styling ringan (opsional)
└── js/
├── dataBahanAjar.js → Data dummy (hanya objek, tidak ada Vue instance)
├── stok-app.js      → Logika Vue untuk stok.html
└── tracking-app.js  → Logika Vue untuk tracking.html
text```

### Fitur yang Telah Diimplementasikan

#### 1. Halaman Stok Bahan Ajar (`stok.html`)
- Tampilan tabel lengkap dengan kolom: Kode, Judul, Kategori, UT-Daerah, Lokasi Rak, Qty, Safety, Status, Catatan (`v-html`)
- **Filter**:
  - Filter berdasarkan UT-Daerah (select)
  - Filter Kategori (dependent select – hanya muncul setelah memilih UT-Daerah)
  - Checkbox “Tampilkan hanya stok rendah/kosong” (`qty < safety` atau `qty === 0`)
  - Sort berdasarkan Judul, Stok (qty), atau Harga
  - Tombol **Reset Filter**
- **Status Stok** dengan warna dan simbol:
  - Hijau → Aman (qty ≥ safety)
  - Orange → Menipis (qty < safety dan qty > 0)
  - Merah → Kosong (qty = 0)
- Fitur **Edit** stok langsung dari tabel
- Form **Tambah Bahan Ajar Baru** dengan validasi sederhana (required)
- Penggunaan `computed property` untuk `filteredStok` dan `filteredKategori`
- Penggunaan **2+ watcher** (pada perubahan filter dan stok)

#### 2. Halaman Tracking Delivery Order (`tracking.html`)
- Form tambah DO baru dengan field:
  - NIM (validasi 9 digit)
  - Nama
  - Ekspedisi (JNE Regular / JNE Express)
  - Paket Bahan Ajar (select menampilkan kode + nama)
  - Setelah memilih paket → otomatis muncul **detail isi paket** dan **total harga**
  - Tanggal Kirim (default hari ini)
- **Generate Nomor DO otomatis**: `DO2025-001`, `DO2025-002`, dst.
- Tabel daftar DO yang sudah ditambahkan
- Penggunaan `computed` untuk `nextSequence`, `selectedPaket`, dan `today`
- Watcher pada perubahan paket (update harga otomatis)

---

### Penerapan Konsep Vue.js (Indikator Capaian)

| No | Indikator Capaian                                 | Implementasi di Proyek                          |
|----|---------------------------------------------------|--------------------------------------------------|
| 1  | Struktur kode Vue.js yang baik                    | Pemisahan file, tidak ada komponen, struktur sesuai tugas |
| 2  | Mustache, `v-text`, `v-html`                      | Digunakan untuk menampilkan data & catatan HTML |
| 3  | Conditional (`v-if`, `v-else`, `v-show`)          | Status stok, dependent select, detail paket     |
| 4  | Data binding (`v-model`, `v-bind`) + `computed`/`methods` | Semua form, filter, sort, edit data            |
| 5  | Watcher                                           | 3 watcher (filter.upbjj, stok, form.paket)      |

---

### Cara Menjalankan Aplikasi

1. Ekstrak semua file ke dalam satu folder
2. Pastikan struktur folder persis seperti di atas
3. Buka file `index.html` dengan browser (Chrome/Firefox/Edge)
4. Klik menu **Stok Bahan Ajar** atau **Tracking DO**
5. Tidak memerlukan server lokal – langsung jalan!

---

### Catatan Penting
- File `dataBahanAjar.js` **hanya berisi objek data**, tidak ada `new Vue()` agar tidak error saat di-load berkali-kali
- Semua fitur interaktif bekerja tanpa reload halaman
- Desain responsif sederhana dan user-friendly
- Siap direkam untuk video penjelasan (maksimal 15 menit)

---

**Terima kasih atas kesempatan mengerjakan tugas ini. Semoga nilai yang diperoleh memuaskan!**
