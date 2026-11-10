// Initial seed data for Smart Complaint System (Lampung Smart City & Teknokrat)

export const CATEGORIES = [
  { id: 'jalan_rusak', name: 'Jalan Rusak & Berlubang', opd: 'Dinas Bina Marga & Bina Konstruksi (PUPR)', icon: 'Hammer', defaultPriority: 'Tinggi' },
  { id: 'sampah_menumpuk', name: 'Sampah Menumpuk & Liar', opd: 'Dinas Lingkungan Hidup (DLH)', icon: 'Trash2', defaultPriority: 'Sedang' },
  { id: 'lampu_mati', name: 'Lampu Penerangan Jalan (PJU) Mati', opd: 'Dinas Perhubungan (Dishub)', icon: 'Lightbulb', defaultPriority: 'Sedang' },
  { id: 'drainase_tersumbat', name: 'Drainase & Saluran Air Tersumbat', opd: 'Dinas PUPR - Bidang Sumber Daya Air', icon: 'Droplets', defaultPriority: 'Tinggi' },
  { id: 'fasilitas_umum', name: 'Fasilitas Umum & Taman Rusak', opd: 'Dinas Perumahan & Kawasan Permukiman', icon: 'Building2', defaultPriority: 'Rendah' },
  { id: 'ketertiban_umum', name: 'Gangguan Ketertiban & PKL Liar', opd: 'Satuan Polisi Pamong Praja (Satpol PP)', icon: 'ShieldAlert', defaultPriority: 'Sedang' },
];

export const OPDS = [
  { id: 'pupr', name: 'Dinas PUPR (Bina Marga)', code: 'PUPR-BDL', email: 'pupr@lampungprov.go.id' },
  { id: 'dlh', name: 'Dinas Lingkungan Hidup', code: 'DLH-BDL', email: 'dlh@lampungprov.go.id' },
  { id: 'dishub', name: 'Dinas Perhubungan', code: 'DISHUB-BDL', email: 'dishub@lampungprov.go.id' },
  { id: 'satpolpp', name: 'Satuan Polisi Pamong Praja', code: 'SATPOL-BDL', email: 'satpolpp@lampungprov.go.id' },
];

export const OFFICERS = [
  { id: 'off_01', name: 'Budi Santoso, S.T.', opdId: 'pupr', opdName: 'Dinas PUPR', role: 'Koordinator Unit Reaksi Cepat Jalan' },
  { id: 'off_02', name: 'Rahmat Hidayat', opdId: 'pupr', opdName: 'Dinas PUPR', role: 'Teknisi Pengaspalan' },
  { id: 'off_03', name: 'Agus Prayitno', opdId: 'dlh', opdName: 'Dinas Lingkungan Hidup', role: 'Mandor Armada Kebersihan' },
  { id: 'off_04', name: 'Siti Rahmawati', opdId: 'dlh', opdName: 'Dinas Lingkungan Hidup', role: 'Pengawas Pengelolaan Sampah' },
  { id: 'off_05', name: 'Hendra Gunawan', opdId: 'dishub', opdName: 'Dinas Perhubungan', role: 'Teknisi Elektrikal PJU' },
  { id: 'off_06', name: 'Zulham Efendi', opdId: 'satpolpp', opdName: 'Satpol PP', role: 'Komandan Regu Patroli' },
];

export const SUBDISTRICTS = [
  'Kedaton',
  'Sukarame',
  'Tanjung Karang Pusat',
  'Tanjung Karang Timur',
  'Teluk Betung Selatan',
  'Teluk Betung Utara',
  'Rajabasa',
  'Kemiling',
  'Way Halim',
  'Panjang',
];

export const INITIAL_COMPLAINTS = [
  {
    id: 'PKM-2024-0012',
    title: 'Aspal Ambles dan Berlubang Dalam di Depan Halte',
    category: 'Jalan Rusak & Berlubang',
    categoryId: 'jalan_rusak',
    description: 'Terdapat lubang jalan berdiameter sekitar 80 cm dengan kedalaman 15 cm. Sangat membahayakan pengendara motor khususnya pada malam hari dan saat hujan karena tergenang air.',
    location: 'Jl. ZA. Pagar Alam No. 93, Labuhan Ratu (Depan Kampus Teknokrat)',
    subdistrict: 'Kedaton',
    coordinates: { lat: -5.38178, lng: 105.25832 },
    photo: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'Sedang Diproses',
    priority: 'Tinggi',
    reporterName: 'Dimas Pratama',
    reporterPhone: '0812-7890-1234',
    isAnonymous: false,
    assignedOpd: 'Dinas PUPR (Bina Marga)',
    assignedOfficer: 'Budi Santoso, S.T.',
    officerId: 'off_01',
    createdAt: '2026-11-09T08:30:00Z',
    slaHours: 24,
    timeline: [
      {
        status: 'Menunggu Verifikasi',
        timestamp: '2026-11-09T08:30:00Z',
        actor: 'Sistem',
        notes: 'Laporan berhasil dibuat oleh warga dengan nomor tiket #PKM-2024-0012.'
      },
      {
        status: 'Diverifikasi & Disposisi',
        timestamp: '2026-11-09T09:15:00Z',
        actor: 'Admin Pemda (Ahmad Fauzi)',
        notes: 'Laporan telah divalidasi kebenaran lokasinya. Disposisi diteruskan ke Dinas PUPR - Ditugaskan kepada Budi Santoso, S.T.'
      },
      {
        status: 'Sedang Diproses',
        timestamp: '2026-11-09T13:40:00Z',
        actor: 'Budi Santoso, S.T. (Petugas PUPR)',
        notes: 'Tim Reaksi Cepat telah meluncur ke lokasi membawa material cold-mix aspal dan stamper plate. Sedang dilakukan perataan dasar fondasi agregat.'
      }
    ],
    completionPhoto: null,
    completionNotes: null,
    feedback: null
  },
  {
    id: 'PKM-2024-0015',
    title: 'Tumpukan Sampah Liar Meluber ke Bahu Jalan Pasar',
    category: 'Sampah Menumpuk & Liar',
    categoryId: 'sampah_menumpuk',
    description: 'Sampah plastik dan limbah sayur menumpuk selama 3 hari belum diangkut armada. Menimbulkan bau menyengat hingga mengganggu pertokoan sekitar dan arus lalu lintas.',
    location: 'Jl. Teuku Umar No. 45, Pasir Gintung',
    subdistrict: 'Tanjung Karang Pusat',
    coordinates: { lat: -5.40210, lng: 105.25360 },
    photo: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    status: 'Selesai',
    priority: 'Sedang',
    reporterName: 'Ratna Sari Dewi',
    reporterPhone: '0857-1122-3344',
    isAnonymous: false,
    assignedOpd: 'Dinas Lingkungan Hidup',
    assignedOfficer: 'Agus Prayitno',
    officerId: 'off_03',
    createdAt: '2026-11-08T07:15:00Z',
    slaHours: 12,
    timeline: [
      {
        status: 'Menunggu Verifikasi',
        timestamp: '2026-11-08T07:15:00Z',
        actor: 'Sistem',
        notes: 'Laporan pengaduan sampah berhasil terdaftar.'
      },
      {
        status: 'Diverifikasi & Disposisi',
        timestamp: '2026-11-08T07:45:00Z',
        actor: 'Admin Pemda (Ahmad Fauzi)',
        notes: 'Laporan divalidasi. Disposisi ke Dinas Lingkungan Hidup (Armada Kebersihan Wilayah Tanjung Karang).'
      },
      {
        status: 'Sedang Diproses',
        timestamp: '2026-11-08T09:00:00Z',
        actor: 'Agus Prayitno (Mandor DLH)',
        notes: '1 unit truk compactor nomor lambung DLH-08 tiba di lokasi. Proses pembersihan dan pengangkutan dimulai bersama 6 personil orange.'
      },
      {
        status: 'Selesai',
        timestamp: '2026-11-08T11:20:00Z',
        actor: 'Agus Prayitno (Mandor DLH)',
        notes: 'Seluruh sampah seberat 1.8 ton berhasil diangkut ke TPA Bakung. Area jalan telah disemprot bersih dengan mobil damkar.'
      }
    ],
    completionPhoto: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    completionNotes: 'Lokasi Jl. Teuku Umar sudah bersih total. Kami juga memasang plang imbauan larangan membuang sampah sembarangan.',
    feedback: {
      rating: 5,
      comment: 'Luar biasa cepat penanganannya! Terima kasih Pemda Lampung dan tim DLH!',
      createdAt: '2026-11-08T14:10:00Z'
    }
  },
  {
    id: 'PKM-2024-0019',
    title: 'Lampu Penerangan Jalan Padam Sepanjang 300 Meter',
    category: 'Lampu Penerangan Jalan (PJU) Mati',
    categoryId: 'lampu_mati',
    description: 'Ada 4 tiang lampu PJU yang padam berurutan sehingga ruas jalan sangat gelap dan rawan tindak kejahatan begal/pencurian.',
    location: 'Jl. Sultan Agung Jalur Dua, Way Halim',
    subdistrict: 'Way Halim',
    coordinates: { lat: -5.39050, lng: 105.27510 },
    photo: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    status: 'Menunggu Verifikasi',
    priority: 'Sedang',
    reporterName: 'Warga (Anonim)',
    reporterPhone: '',
    isAnonymous: true,
    assignedOpd: 'Dinas Perhubungan',
    assignedOfficer: null,
    officerId: null,
    createdAt: '2026-11-10T06:10:00Z',
    slaHours: 24,
    timeline: [
      {
        status: 'Menunggu Verifikasi',
        timestamp: '2026-11-10T06:10:00Z',
        actor: 'Sistem',
        notes: 'Laporan baru masuk, menunggu pemeriksaan kelengkapan berkas oleh admin dinas.'
      }
    ],
    completionPhoto: null,
    completionNotes: null,
    feedback: null
  },
  {
    id: 'PKM-2024-0008',
    title: 'Saluran Drainase Tersumbat Sampah Plastik Menimbulkan Genangan',
    category: 'Drainase & Saluran Air Tersumbat',
    categoryId: 'drainase_tersumbat',
    description: 'Gorong-gorong tersumbat sedimen lumpur dan sampah kemasan plastik tebal. Setiap hujan 30 menit langsung banjir setinggi 30 cm menggenangi halaman rumah warga.',
    location: 'Jl. Ryacudu Komp. Perumahan Korpri, Sukarame',
    subdistrict: 'Sukarame',
    coordinates: { lat: -5.37890, lng: 105.30120 },
    photo: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    status: 'Selesai',
    priority: 'Tinggi',
    reporterName: 'Ir. Hendro Wijaya',
    reporterPhone: '0811-2345-6789',
    isAnonymous: false,
    assignedOpd: 'Dinas PUPR (Bina Marga)',
    assignedOfficer: 'Budi Santoso, S.T.',
    officerId: 'off_01',
    createdAt: '2026-11-06T10:00:00Z',
    slaHours: 24,
    timeline: [
      {
        status: 'Menunggu Verifikasi',
        timestamp: '2026-11-06T10:00:00Z',
        actor: 'Sistem',
        notes: 'Laporan pengaduan drainase diterima.'
      },
      {
        status: 'Diverifikasi & Disposisi',
        timestamp: '2026-11-06T10:40:00Z',
        actor: 'Admin Pemda',
        notes: 'Disposisi ke Bidang Sumber Daya Air / PUPR.'
      },
      {
        status: 'Sedang Diproses',
        timestamp: '2026-11-06T13:00:00Z',
        actor: 'Budi Santoso, S.T.',
        notes: 'Pengerukan sedimen lumpur dan pengangkatan sampah dengan alat mini excavator.'
      },
      {
        status: 'Selesai',
        timestamp: '2026-11-07T11:30:00Z',
        actor: 'Budi Santoso, S.T.',
        notes: 'Aliran air kembali lancar, gorong-gorong telah dinormalisasi.'
      }
    ],
    completionPhoto: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    completionNotes: 'Pengerukan selesai 100%, saluran air kini mengalir bebas ke sungai induk.',
    feedback: {
      rating: 4,
      comment: 'Sudah tidak banjir lagi waktu hujan kemarin. Kerja bagus tim teknis.',
      createdAt: '2026-11-07T16:00:00Z'
    }
  },
  {
    id: 'PKM-2024-0004',
    title: 'Laporan Pengaduan Tidak Memiliki Titik Lokasi Valid',
    category: 'Fasilitas Umum & Taman Rusak',
    categoryId: 'fasilitas_umum',
    description: 'Ada lampu taman pecah di dekat warung makan tapi tidak disebutkan nama jalan atau taman yang mana.',
    location: 'Sekitaran Bandar Lampung',
    subdistrict: 'Kemiling',
    coordinates: { lat: -5.40550, lng: 105.21500 },
    photo: 'https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=800&q=80',
    status: 'Ditolak',
    priority: 'Rendah',
    reporterName: 'Anonim',
    reporterPhone: '',
    isAnonymous: true,
    assignedOpd: null,
    assignedOfficer: null,
    officerId: null,
    createdAt: '2026-11-05T14:20:00Z',
    slaHours: 48,
    timeline: [
      {
        status: 'Menunggu Verifikasi',
        timestamp: '2026-11-05T14:20:00Z',
        actor: 'Sistem',
        notes: 'Laporan masuk ke sistem.'
      },
      {
        status: 'Ditolak',
        timestamp: '2026-11-05T15:30:00Z',
        actor: 'Admin Pemda (Siti Marlina)',
        notes: 'Laporan ditolak: Informasi alamat dan foto tidak memadai untuk diverifikasi ke lapangan. Mohon kirim ulang laporan dengan menyertakan nama taman dan koordinat GPS yang akurat.'
      }
    ],
    completionPhoto: null,
    completionNotes: null,
    feedback: null
  }
];
