# Smart Complaint System — Smart City Kota Bandar Lampung & Provinsi Lampung
### Kolaborasi Inovasi: Pemerintah Daerah Provinsi Lampung & Universitas Teknokrat Indonesia (UTI)

Aplikasi berbasis web modern untuk pengaduan masyarakat perkotaan yang dibangun berdasarkan spesifikasi lengkap pada **[PRD_Smart_Complaint_System.md](PRD_Smart_Complaint_System.md)** dan panduan desain visual pada **[DESIGN.md](DESIGN.md)**.

---

## 🏛️ Keselarasan dengan DESIGN.md

1. **Brand Voice & Identitas Ganda (Institutional Minimalism):**
   - Menampilkan lambang **Pemerintah Daerah Provinsi Lampung** berdampingan dengan emblem **Universitas Teknokrat Indonesia** (Kampus Sang Juara) yang dipisahkan oleh garis pembatas vertikal `#CBD5E1`.
   - Menggunakan warna resmi:
     - **Primary:** `#1F3A5F` (Deep Navy Blue)
     - **Secondary:** `#1B7F79` (Teal Green)
     - **Canvas & Background:** `#F5F7FA` & `#FFFFFF`
   - Tipografi menggunakan **Inter** dengan angka tabelaris (`font-variant-numeric: tabular-nums`) untuk metrik SLA dan nomor tiket.
   - **Government Outline Badges:**
     - *Menunggu Validasi:* Border `#F59E0B`, Background `#FEF3C7`, Text `#B45309`
     - *Sedang Diproses:* Border `#1B7F79`, Background `#CCFBF1`, Text `#115E59`
     - *Selesai:* Border `#10B981`, Background `#D1FAE5`, Text `#047857`
     - *Ditolak / Tidak Valid:* Border `#EF4444`, Background `#FEE2E2`, Text `#B91C1C`

---

## 🎯 Fitur & Pemenuhan Kebutuhan PRD

| ID PRD | Fitur / Kebutuhan | Status Implementasi | Keterangan |
|---|---|---|---|
| **FR-01** | Pengiriman Pengaduan Masyarakat | ✅ **Lengkap** | Tersedia form online lengkap dengan validasi |
| **FR-02** | Isian Judul, Kategori, Deskripsi, Lokasi, Foto | ✅ **Lengkap** | Form mencakup seluruh isian + preview foto & preset pengujian cepat |
| **FR-03** | Penyimpanan Data Laporan | ✅ **Lengkap** | Tersimpan di LocalStorage dengan persistence & data sampel awal |
| **FR-04** | Admin Melihat Daftar & Detail Laporan | ✅ **Lengkap** | Dashboard admin dengan filter status, kategori, kecamatan, pencarian |
| **FR-05** | Verifikasi & Keputusan Validasi Admin | ✅ **Lengkap** | Modal verifikasi (Valid atau Tolak dengan alasan transparan) |
| **FR-06** | Penetapan Petugas & Disposisi OPD | ✅ **Lengkap** | Disposisi ke Dinas PUPR, DLH, Dishub, Satpol PP & assign petugas |
| **FR-07** | Petugas Melihat Tugas yang Ditugaskan | ✅ **Lengkap** | Portal Petugas Lapangan dengan daftar tugas terpisah per personil |
| **FR-08** | Petugas Memperbarui Status & Keterangan | ✅ **Lengkap** | Input update progres teknis langsung ke audit trail timeline |
| **FR-09** | Petugas Mengunggah Bukti Selesai | ✅ **Lengkap** | Fitur unggah foto sesudah (after) & catatan penyelesaian |
| **FR-10** | Pelacakan Status Tiket oleh Warga | ✅ **Lengkap** | Pencarian instan nomor tiket (misal `#PKM-2024-0012`), timeline berjejak, foto *before-after* |
| **FR-11** | Dashboard Ringkasan & Metrik Status | ✅ **Lengkap** | Kartu metrik total, menunggu, diproses, selesai, SLA compliance |
| **FR-12** | Laporan Kinerja Eksekutif / Pimpinan | ✅ **Lengkap** | Grafik kategori, ranking kecamatan, waktu respon (1.8 jam), unduh rekap CSV & Cetak PDF |
| **FR-13** | Penilaian & Feedback Rating Warga | ✅ **Lengkap** | Modal bintang 1-5 dan ulasan publik setelah laporan diselesaikan |
| **FR-15** | AI Klasifikasi Pengaduan Otomatis | ✅ **Lengkap** | Tombol "Analisis Otomatis AI" mendeteksi kategori & prioritas dari teks laporan |
| **Inovasi** | Laporan Anonim | ✅ **Lengkap** | Checkbox lapor tanpa menampilkan nama & nomor kontak ke publik |
| **Inovasi** | Peta Pengaduan Interaktif (GIS) | ✅ **Lengkap** | Peta Leaflet dengan pin berwarna status di Kota Bandar Lampung |

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dibangun menggunakan **React 18 + Vite + Tailwind CSS + Lucide Icons + Leaflet**.

### 1. Menjalankan Cepat (Windows Batch Launcher)
Cukup jalankan file:
```bash
start.bat
```
Script ini akan langsung membuka peramban di `http://localhost:3000` dan mengaktifkan server Vite tanpa kendala PowerShell execution policy.

### 2. Menjalankan Mode Pengembangan (Development)
Buka terminal di direktori proyek ini dan jalankan:
```bash
npm.cmd run dev
# atau: npm run dev
```
Aplikasi akan aktif di `http://localhost:3000`.

### 3. Menjalankan Pengujian Otomatis (Automated Testing)
```bash
npm test
```
Menjalankan **57 kasus uji** mencakup:
- Integritas data seed awal & konsistensi model tiket
- Engine klasifikasi kecerdasan buatan (AI Smart Classification FR-15)
- Alur *end-to-end complaint lifecycle* (pengajuan, verifikasi admin, pengerjaan petugas, rating warga)
- Metrik analitik eksekutif & resolusi SLA
- **Security Defenses & Sanitization Suite (OWASP Top 10 & UU PDP)**:
  - Sanitasi DOM XSS (CWE-79) dengan entitas HTML escape
  - Sanitasi anti-CSV Formula / DDE Injection (CWE-1236)
  - Validasi protokol skema URL foto (menolak `javascript:`, `vbscript:`, `data:text/html`)
  - Validasi ketat kuota & tipe MIME berkas unggahan (CWE-434)
  - Sanitasi pembersihan karakter kontrol & pembatasan panjang teks input
  - Proteksi privasi pelapor mode anonim (UU No. 27/2022 UU PDP / CWE-359)
  - Validasi format nomor telepon seluler / WhatsApp Indonesia

### 4. Membuat Ulang Laporan Formal Word (Generate DOCX)
- **Laporan Pengujian & Debugging:**
  ```bash
  npm run report
  ```
  Menghasilkan dokumen: `Laporan_Testing_dan_Debugging_Smart_Complaint_System.docx`.

- **Laporan Audit Keamanan Sistem (Security Audit):**
  ```bash
  npm run audit:report
  ```
  Menghasilkan dokumen: `Laporan_Security_Audit_Smart_Complaint_System.docx`.

### 5. Membangun untuk Produksi (Build)
```bash
npm run build
```
Hasil build siap di-*deploy* berada di folder `dist/`.

---

## 🛡️ Modul & Kebijakan Keamanan Sistem (Security & Compliance)
Sistem telah diaudit dan diperkuat dengan standar **OWASP Top 10** serta **UU No. 27/2022 tentang Perlindungan Data Pribadi (UU PDP)**:
- **Pustaka Keamanan Terpusat (`src/utils/security.js`):** Menyediakan fungsi sanitasi `escapeHTML()`, validasi protokol gambar `sanitizeImageSrc()`, sanitasi ekspor CSV `sanitizeCsvField()`, pembersih string input `sanitizeText()`, validasi berkas `validateImageFile()`, serta validator nomor telepon `isValidPhone()`.
- **Perlindungan Data Pribadi (CWE-359):** Mode pelaporan anonim menyembunyikan identitas pelapor dan mengosongkan nomor telepon dari tampilan publik, basis data pelacakan, maupun berkas ekspor laporan.
- **Proteksi Browser (`index.html`):** Dilengkapi meta tag `Content-Security-Policy` (CSP), `Permissions-Policy`, `X-Content-Type-Options: nosniff`, dan `Referrer-Policy: strict-origin-when-cross-origin`.
- **Proteksi Anti-Spam & DoS:** Formulir pelaporan dilengkapi batas jeda waktu (*submission cooldown*) minimal 3 detik untuk mencegah pengiriman berulang/bot flood.

---

## 💾 Skema Database Standar Produksi (SQL)
Tersedia file **[database/schema.sql](database/schema.sql)** yang memuat 7 tabel relasional lengkap:
- `users`: data pengguna (masyarakat, admin, petugas, pimpinan) dengan hash password standar bcrypt (`VARCHAR(255)`).
- `categories`: kategori pengaduan dan OPD penanggung jawab.
- `opds`: instansi dinas teknis (PUPR, DLH, Dishub, Satpol PP).
- `officers`: personil petugas reaksi cepat lapangan.
- `complaints`: data pokok laporan pengaduan, koordinat GPS, foto kerusakan & bukti penanganan.
- `complaint_updates`: jejak rekam audit trail status tindak lanjut.
- `feedback`: rating bintang 1–5 dan ulasan warga.

---

## 📑 Dokumen Laporan Resmi Proyek
Dokumen formal hasil pengujian, debugging, dan audit keamanan tersedia dalam format Microsoft Word (.docx):
1. **[Laporan_Testing_dan_Debugging_Smart_Complaint_System.docx](Laporan_Testing_dan_Debugging_Smart_Complaint_System.docx)** (40 Halaman — Rekap 40 skenario pengujian fungsional dan perbaikan bug)
2. **[Laporan_Security_Audit_Smart_Complaint_System.docx](Laporan_Security_Audit_Smart_Complaint_System.docx)** (Laporan Asesmen Kerentanan OWASP, Matriks CWE, dan Kepatuhan UU PDP)

---

## 👥 Pengujian Multi-Peran (Role Switcher)
Pada bagian kanan atas navbar, terdapat **Dropdown Mode Pengguna** untuk berpindah peran secara instan:
1. **👤 Warga / Pelapor:** Mengirim pengaduan, melacak tiket, melihat foto before-after, memberi bintang rating.
2. **🛡️ Admin Pemda:** Memvalidasi laporan masuk, menetapkan prioritas, memilih OPD dan petugas lapangan penanggung jawab.
3. **🛠️ Petugas Lapangan:** Menerima tugas, membuka rute Google Maps, memperbarui progres, mengunggah foto bukti pengerjaan selesai.
4. **📊 Pimpinan / Dinas:** Menganalisis waktu tanggap, peta kecamatan tertinggi, dan mengunduh berkas laporan CSV.

