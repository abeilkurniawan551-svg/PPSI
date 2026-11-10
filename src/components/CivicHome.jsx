import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Hammer, 
  Trash2, 
  Lightbulb, 
  ArrowRight,
  TrendingUp,
  Building2,
  Sparkles
} from 'lucide-react';

export const CivicHome = () => {
  const { complaints, setActiveTab, setSelectedTicketId } = useComplaints();

  const total = complaints.length;
  const completed = complaints.filter((c) => c.status === 'Selesai').length;
  const inProgress = complaints.filter((c) => c.status === 'Sedang Diproses').length;

  const mvpCategories = [
    {
      id: 'jalan_rusak',
      title: 'Jalan Rusak & Berlubang',
      desc: 'Laporkan aspal amblas, jalan berlubang, atau retak yang membahayakan pengendara.',
      icon: Hammer,
      badge: 'Prioritas Tinggi (PUPR)',
      color: 'border-l-blue-600'
    },
    {
      id: 'sampah_menumpuk',
      title: 'Sampah Menumpuk & Liar',
      desc: 'Laporkan timbunan sampah liar, TPS meluber, atau limbah pasar yang mengganggu kebersihan.',
      icon: Trash2,
      badge: 'Dinas Lingkungan Hidup',
      color: 'border-l-emerald-600'
    },
    {
      id: 'lampu_mati',
      title: 'Lampu Penerangan (PJU) Mati',
      desc: 'Laporkan lampu jalan padam berurutan yang menyebabkan ruas jalan gelap dan rawan kriminalitas.',
      icon: Lightbulb,
      badge: 'Dinas Perhubungan',
      color: 'border-l-amber-500'
    }
  ];

  return (
    <div className="space-y-10 pb-12">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1F3A5F] to-[#142538] text-white py-14 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-[1440px] mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kolaborasi Riset Smart City: Pemda Lampung & Universitas Teknokrat Indonesia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Sistem Pengaduan Masyarakat Terpadu Berbasis Digital
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Laporkan jalan berlubang, tumpukan sampah, atau lampu jalan padam di sekitar Anda. Pantau penanganan petugas dinas secara langsung hingga tuntas.
          </p>

          {/* Quick CTA Buttons */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('report')}
              className="px-6 py-3 bg-brand-secondary hover:bg-brand-secondary-hover text-white text-sm font-semibold rounded-sm shadow-level-2 flex items-center gap-2 transition active:scale-[0.99]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Buat Pengaduan Sekarang</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-semibold rounded-sm transition flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-amber-300" />
              <span>Lacak Status Tiket Anda</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white text-sm font-semibold rounded-sm transition flex items-center gap-2"
            >
              <MapPin className="w-5 h-5 text-teal-300" />
              <span>Peta Pengaduan Kota</span>
            </button>
          </div>

          {/* Transparency Live Strip */}
          <div className="pt-6 border-t border-white/10 max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-amber-300 block tnum">{total}</span>
              <span className="text-[11px] sm:text-xs text-slate-300">Total Pengaduan Warga</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-teal-300 block tnum">{inProgress}</span>
              <span className="text-[11px] sm:text-xs text-slate-300">Sedang Dikerjakan</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-emerald-300 block tnum">{completed}</span>
              <span className="text-[11px] sm:text-xs text-slate-300">Tuntas Diselesaikan</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* MVP 3 Core Problems Cards (PRD 5.1) */}
        <section className="space-y-4">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-primary">
              3 Kategori Prioritas Penanganan Kota
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Fokus utama pelayanan respons cepat aduan prasarana perkotaan Bandar Lampung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mvpCategories.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={`bg-white border border-[#E2E8F0] border-l-4 ${item.color} rounded-lg p-6 shadow-level-1 hover:shadow-level-2 transition flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-sm bg-surface-low border border-slate-200 flex items-center justify-center text-brand-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">SLA Target 24 Jam</span>
                    <button
                      onClick={() => setActiveTab('report')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-secondary hover:text-brand-secondary-hover"
                    >
                      <span>Lapor Masalah Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4 Steps Workflow Section */}
        <section className="bg-white border border-[#E2E8F0] rounded-lg p-6 sm:p-8 shadow-level-1">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-primary">
              Alur Penanganan Laporan Transparan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Dari pengiriman aduan hingga bukti fisik terselesaikan oleh dinas berwenang.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="p-4 rounded-sm bg-surface-low border border-slate-200 relative">
              <span className="w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold flex items-center justify-center mb-3">
                1
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Masyarakat Melapor</h3>
              <p className="text-xs text-slate-600">
                Isi formulir pengaduan, pilih kategori, lampirkan foto dan tentukan koordinat lokasi kejadian.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-sm bg-surface-low border border-slate-200 relative">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center mb-3">
                2
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Verifikasi & Disposisi</h3>
              <p className="text-xs text-slate-600">
                Admin Pemda memverifikasi laporan dan mendisposisikan tugas ke dinas teknis (PUPR, DLH, Dishub).
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-sm bg-surface-low border border-slate-200 relative">
              <span className="w-7 h-7 rounded-full bg-teal-600 text-white text-xs font-bold flex items-center justify-center mb-3">
                3
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Tindak Lanjut Lapangan</h3>
              <p className="text-xs text-slate-600">
                Petugas reaksi cepat dinas meluncur ke titik lokasi untuk melakukan perbaikan fisik.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-sm bg-surface-low border border-slate-200 relative">
              <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center mb-3">
                4
              </span>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Bukti Selesai & Rating</h3>
              <p className="text-xs text-slate-600">
                Petugas mengunggah foto before-after selesai, warga memantau hasil dan memberi penilaian bintang.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Resolved Complaints Preview (Before & After) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-brand-primary">
                Bukti Nyata Penanganan Terkini (Before & After)
              </h2>
              <p className="text-xs text-slate-600">
                Transparansi hasil kerja nyata tim pemerintah daerah di lapangan.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('track')}
              className="text-xs font-semibold text-brand-secondary hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Lihat Seluruh Laporan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complaints.filter(c => c.status === 'Selesai').slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E2E8F0] rounded-lg shadow-level-1 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 tnum">#{item.id}</span>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  </div>
                  <StatusBadge status={item.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-1 p-2 bg-slate-100">
                  <div className="relative">
                    <img
                      src={item.photo}
                      alt="Sebelum"
                      className="w-full h-36 object-cover rounded-sm"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      SEBELUM
                    </span>
                  </div>
                  <div className="relative">
                    <img
                      src={item.completionPhoto || item.photo}
                      alt="Sesudah"
                      className="w-full h-36 object-cover rounded-sm"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      SESUDAH
                    </span>
                  </div>
                </div>

                <div className="p-4 text-xs space-y-2">
                  <p className="text-slate-600 line-clamp-2">
                    {item.completionNotes || item.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span>📍 {item.location}</span>
                    <button
                      onClick={() => {
                        setSelectedTicketId(item.id);
                        setActiveTab('track');
                      }}
                      className="text-brand-primary font-semibold hover:underline"
                    >
                      Buka Rincian
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
};
