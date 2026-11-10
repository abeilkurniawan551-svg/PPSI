-- ==============================================================
-- DATABASE SCHEMA: Smart Complaint System (Smart City Lampung)
-- Kolaborasi: Pemda Provinsi Lampung & Universitas Teknokrat Indonesia
-- Standard: ANSI SQL / MySQL / PostgreSQL / SQLite Compatible
-- ==============================================================

-- 1. Tabel Kategori Permasalahan (Categories)
CREATE TABLE IF NOT EXISTS categories (
    id_category VARCHAR(50) PRIMARY KEY,
    nama_kategori VARCHAR(150) NOT NULL,
    opd_penanggung_jawab VARCHAR(150) NOT NULL,
    prioritas_default VARCHAR(20) DEFAULT 'Sedang',
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Dinas / Organisasi Perangkat Daerah (OPD)
CREATE TABLE IF NOT EXISTS opds (
    id_opd VARCHAR(50) PRIMARY KEY,
    nama_opd VARCHAR(150) NOT NULL,
    kode_opd VARCHAR(30) UNIQUE NOT NULL,
    email_resmi VARCHAR(100),
    nomor_telepon VARCHAR(50),
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Petugas Lapangan (Officers)
CREATE TABLE IF NOT EXISTS officers (
    id_officer VARCHAR(50) PRIMARY KEY,
    nama_petugas VARCHAR(150) NOT NULL,
    id_opd VARCHAR(50) NOT NULL,
    jabatan VARCHAR(150),
    nomor_kontak VARCHAR(50),
    status_aktif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_opd) REFERENCES opds(id_opd) ON DELETE CASCADE
);

-- 4. Tabel Pengguna (Users: Masyarakat, Admin, Pimpinan)
CREATE TABLE IF NOT EXISTS users (
    id_user VARCHAR(50) PRIMARY KEY,
    nama VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nomor_hp VARCHAR(50),
    role VARCHAR(30) NOT NULL DEFAULT 'masyarakat', -- masyarakat, admin, petugas, pimpinan
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Utama Pengaduan (Complaints)
CREATE TABLE IF NOT EXISTS complaints (
    id_complaint VARCHAR(50) PRIMARY KEY, -- Contoh: PKM-2024-0012
    id_user VARCHAR(50),
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    id_category VARCHAR(50) NOT NULL,
    lokasi TEXT NOT NULL,
    kecamatan VARCHAR(100) NOT NULL, -- Kedaton, Sukarame, Rajabasa, Way Halim, dll.
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    foto_bukti VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Menunggu Verifikasi', -- Menunggu Verifikasi, Sedang Diproses, Selesai, Ditolak
    prioritas VARCHAR(20) DEFAULT 'Sedang', -- Tinggi, Sedang, Rendah
    is_anonymous BOOLEAN DEFAULT FALSE,
    id_opd VARCHAR(50),
    id_officer VARCHAR(50),
    sla_hours INT DEFAULT 24,
    foto_penyelesaian VARCHAR(255),
    catatan_penyelesaian TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES users(id_user) ON DELETE SET NULL,
    FOREIGN KEY (id_category) REFERENCES categories(id_category),
    FOREIGN KEY (id_opd) REFERENCES opds(id_opd) ON DELETE SET NULL,
    FOREIGN KEY (id_officer) REFERENCES officers(id_officer) ON DELETE SET NULL
);

-- 6. Tabel Riwayat Jejak Audit Penanganan (Complaint Updates / Audit Trail)
CREATE TABLE IF NOT EXISTS complaint_updates (
    id_update INT AUTO_INCREMENT PRIMARY KEY,
    id_complaint VARCHAR(50) NOT NULL,
    status_tahap VARCHAR(50) NOT NULL,
    aktor VARCHAR(150) NOT NULL, -- Nama Petugas / Admin / Sistem
    catatan_tindakan TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_complaint) REFERENCES complaints(id_complaint) ON DELETE CASCADE
);

-- 7. Tabel Ulasan & Penilaian Masyarakat (Feedback)
CREATE TABLE IF NOT EXISTS feedback (
    id_feedback INT AUTO_INCREMENT PRIMARY KEY,
    id_complaint VARCHAR(50) UNIQUE NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    komentar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_complaint) REFERENCES complaints(id_complaint) ON DELETE CASCADE
);

-- ==============================================================
-- INITIAL SEED DATA (Sampel Data Awal)
-- ==============================================================

INSERT INTO categories (id_category, nama_kategori, opd_penanggung_jawab, prioritas_default) VALUES
('jalan_rusak', 'Jalan Rusak & Berlubang', 'Dinas Bina Marga & Bina Konstruksi (PUPR)', 'Tinggi'),
('sampah_menumpuk', 'Sampah Menumpuk & Liar', 'Dinas Lingkungan Hidup (DLH)', 'Sedang'),
('lampu_mati', 'Lampu Penerangan Jalan (PJU) Mati', 'Dinas Perhubungan (Dishub)', 'Sedang'),
('drainase_tersumbat', 'Drainase & Saluran Air Tersumbat', 'Dinas PUPR - Sumber Daya Air', 'Tinggi');

INSERT INTO opds (id_opd, nama_opd, kode_opd, email_resmi) VALUES
('pupr', 'Dinas PUPR (Bina Marga)', 'PUPR-BDL', 'pupr@lampungprov.go.id'),
('dlh', 'Dinas Lingkungan Hidup', 'DLH-BDL', 'dlh@lampungprov.go.id'),
('dishub', 'Dinas Perhubungan', 'DISHUB-BDL', 'dishub@lampungprov.go.id');

INSERT INTO officers (id_officer, nama_petugas, id_opd, jabatan) VALUES
('off_01', 'Budi Santoso, S.T.', 'pupr', 'Koordinator Unit Reaksi Cepat Jalan'),
('off_03', 'Agus Prayitno', 'dlh', 'Mandor Armada Kebersihan Wilayah'),
('off_05', 'Hendra Gunawan', 'dishub', 'Teknisi Elektrikal PJU');
