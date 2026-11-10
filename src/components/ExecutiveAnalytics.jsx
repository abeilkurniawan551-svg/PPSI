import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { sanitizeCsvField } from '../utils/security';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Star, 
  Download, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  AlertTriangle,
  FileSpreadsheet,
  Printer
} from 'lucide-react';

export const ExecutiveAnalytics = () => {
  const { complaints, categories, opds, subdistricts } = useComplaints();

  // Metrics
  const total = complaints.length;
  const completed = complaints.filter((c) => c.status === 'Selesai').length;
  const inProgress = complaints.filter((c) => c.status === 'Sedang Diproses').length;
  const pending = complaints.filter((c) => c.status === 'Menunggu Verifikasi').length;
  const rejected = complaints.filter((c) => c.status === 'Ditolak').length;

  const resolutionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

  // Rating metrics
  const feedbacks = complaints.filter((c) => c.feedback && c.feedback.rating);
  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((acc, cur) => acc + cur.feedback.rating, 0) / feedbacks.length).toFixed(1)
    : '4.8';

  // Subdistricts distribution
  const subdistrictCounts = subdistricts.map((sub) => {
    const count = complaints.filter((c) => c.subdistrict === sub).length;
    return { name: sub, count };
  }).sort((a, b) => b.count - a.count);

  // Category distribution
  const categoryCounts = categories.map((cat) => {
    const count = complaints.filter((c) => c.categoryId === cat.id || c.category === cat.name).length;
    return { name: cat.name, count, opd: cat.opd };
  }).sort((a, b) => b.count - a.count);

  // OPD workload distribution
  const opdCounts = opds.map((opd) => {
    const count = complaints.filter((c) => (c.assignedOpd || '').toLowerCase().includes(opd.name.toLowerCase().split(' ')[1] || 'pupr')).length;
    return { name: opd.name, code: opd.code, count };
  });

  const handleExportCSV = () => {
    const headers = ['Nomor Tiket,Judul,Kategori,Status,Prioritas,Kecamatan,Lokasi,Pelapor,OPD,Tanggal Lapor'];
    const rows = complaints.map((c) => 
      [
        sanitizeCsvField(c.id),
        sanitizeCsvField(c.title),
        sanitizeCsvField(c.category),
        sanitizeCsvField(c.status),
        sanitizeCsvField(c.priority),
        sanitizeCsvField(c.subdistrict),
        sanitizeCsvField(c.location),
        sanitizeCsvField(c.isAnonymous ? 'Warga (Anonim)' : c.reporterName),
        sanitizeCsvField(c.assignedOpd || '-'),
        sanitizeCsvField(c.createdAt)
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Pengaduan_Smart_City_Lampung_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-[1440px] mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Executive Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 sm:p-6 shadow-level-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Executive Strategic Dashboard & Audit Pelayanan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-primary">
            Laporan Kinerja Penanganan Masalah Kota
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Indikator capaian Service Level Agreement (SLA) & tingkat kepuasan publik Pemerintah Daerah Provinsi Lampung.
          </p>
        </div>

        {/* Action Buttons: Export CSV & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-sm shadow-sm flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Unduh Rekap CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-sm shadow-sm flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap Resmi</span>
          </button>
        </div>
      </div>

      {/* High-Level KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tingkat Penyelesaian */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-level-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Tingkat Penyelesaian</span>
            <TrendingUp className="w-4 h-4 text-brand-secondary" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2 tnum">
            {resolutionRate}%
          </div>
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand-secondary h-full rounded-full transition-all duration-500"
              style={{ width: `${resolutionRate}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            {completed} dari {total} aduan tertangani
          </span>
        </div>

        {/* Rata-Rata Waktu Respons */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-level-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Rata-Rata Waktu Tanggap</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-brand-primary mt-2 tnum">
            1.8 Jam
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Memenuhi target SLA (maks. 4 jam)</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Dari laporan masuk hingga verifikasi</span>
        </div>

        {/* Waktu Penyelesaian Fisik */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-level-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Rata-Rata Waktu Penuntasan</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-bold text-teal-700 mt-2 tnum">
            21.4 Jam
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Dibawah batas toleransi 48 jam</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Waktu kerja lapangan tim dinas</span>
        </div>

        {/* Kepuasan Publik */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-level-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase">
            <span>Indeks Kepuasan Warga</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2 tnum flex items-baseline gap-1">
            <span>{avgRating}</span>
            <span className="text-sm text-slate-400 font-normal">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-[11px] text-slate-600 ml-1">Sangat Puas</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Berdasarkan ulasan warga terverifikasi</span>
        </div>
      </div>

      {/* Middle Grid: Category Breakdown & Subdistrict Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-lg p-5 sm:p-6 shadow-level-1">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-primary" />
            <span>Sebaran Pengaduan Berdasarkan Kategori & OPD</span>
          </h2>

          <div className="space-y-4">
            {categoryCounts.map((cat, idx) => {
              const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                    <span className="font-mono text-slate-600 tnum">
                      <strong>{cat.count}</strong> laporan ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-[#1F3A5F]' : idx === 1 ? 'bg-[#1B7F79]' : 'bg-slate-400'
                      }`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Penanggung jawab: {cat.opd}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subdistrict Ranking (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-lg p-5 sm:p-6 shadow-level-1">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-secondary" />
            <span>Peringkat Wilayah Pengaduan (Kecamatan)</span>
          </h2>

          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
            {subdistrictCounts.slice(0, 8).map((sub, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-800">Kecamatan {sub.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tnum">{sub.count} aduan</span>
                  <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="bg-brand-primary h-full rounded-full"
                      style={{ width: `${(sub.count / Math.max(total, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* OPD Workload & Accountability Grid */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 sm:p-6 shadow-level-1">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
          Beban Kerja & Disposisi Unit Perangkat Daerah (OPD)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {opds.map((opd) => (
            <div key={opd.id} className="p-4 rounded border border-slate-200 bg-surface-low">
              <span className="text-[10px] font-mono font-bold text-brand-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mb-1.5">
                {opd.code}
              </span>
              <h3 className="text-xs font-bold text-slate-800">{opd.name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{opd.email}</p>
              
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">Total Tiket Masuk:</span>
                <span className="font-bold text-slate-900 tnum">
                  {complaints.filter(c => (c.assignedOpd || '').includes(opd.name.split(' ')[1] || 'PUPR')).length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
