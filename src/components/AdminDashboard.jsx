import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Filter, 
  Search, 
  ArrowUpDown, 
  Send, 
  Building2, 
  UserCheck, 
  Eye, 
  FileText,
  AlertOctagon,
  Calendar
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    complaints, 
    categories, 
    opds, 
    officers, 
    subdistricts, 
    verifyComplaint, 
    setSelectedTicketId, 
    setActiveTab 
  } = useComplaints();

  // Filters
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterSubdistrict, setFilterSubdistrict] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected complaint for disposition / verification modal
  const [modalComplaint, setModalComplaint] = useState(null);
  const [dispositionForm, setDispositionForm] = useState({
    approved: true,
    priority: 'Sedang',
    assignedOpd: 'Dinas PUPR (Bina Marga)',
    officerId: 'off_01',
    rejectionReason: ''
  });

  // Calculate Metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'Menunggu Verifikasi').length;
  const inProgressCount = complaints.filter((c) => c.status === 'Sedang Diproses').length;
  const completedCount = complaints.filter((c) => c.status === 'Selesai').length;
  const rejectedCount = complaints.filter((c) => c.status === 'Ditolak').length;
  const resolutionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (filterCategory !== 'ALL' && c.categoryId !== filterCategory) return false;
    if (filterSubdistrict !== 'ALL' && c.subdistrict !== filterSubdistrict) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchId = c.id.toLowerCase().includes(q);
      const matchLoc = c.location.toLowerCase().includes(q);
      const matchRep = c.reporterName.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchLoc && !matchRep) return false;
    }
    return true;
  });

  const handleOpenModal = (complaint) => {
    setModalComplaint(complaint);
    // Suggest default OPD based on category
    const cat = categories.find((k) => k.name === complaint.category || k.id === complaint.categoryId);
    const opdName = cat ? cat.opd : 'Dinas PUPR (Bina Marga)';
    
    // Suggest officer
    const matchingOfficer = officers.find(o => o.opdName.toLowerCase().includes(opdName.split(' ')[1]?.toLowerCase() || 'pupr')) || officers[0];

    setDispositionForm({
      approved: true,
      priority: complaint.priority || 'Sedang',
      assignedOpd: opdName,
      officerId: matchingOfficer ? matchingOfficer.id : officers[0].id,
      rejectionReason: ''
    });
  };

  const handleProcessDisposition = (e) => {
    e.preventDefault();
    if (!modalComplaint) return;

    verifyComplaint(modalComplaint.id, dispositionForm);
    setModalComplaint(null);
  };

  return (
    <div className="max-w-[1440px] mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 sm:p-6 shadow-level-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Pusat Kendali Pengaduan & Disposisi OPD</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-primary">
            Panel Verifikasi & Manajemen Pengaduan Kota
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Pemerintah Daerah Provinsi Lampung — Layanan terintegrasi tindak lanjut aduan masyarakat berbasis SLA.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-sm border border-slate-200 font-mono tnum">
            Petugas Aktif: Ahmad Fauzi (Super Admin)
          </span>
        </div>
      </div>

      {/* Metric Cards (Design.md: rounded-lg 8px, 1px solid #E2E8F0, tabular figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Laporan */}
        <button
          type="button"
          onClick={() => setFilterStatus('ALL')}
          className={`text-left bg-white border ${filterStatus === 'ALL' ? 'ring-2 ring-brand-primary' : 'border-[#E2E8F0]'} rounded-lg p-4 shadow-level-1 hover:shadow-level-2 transition`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Laporan</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 tnum">
            {totalCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Semua laporan tercatat</span>
        </button>

        {/* Menunggu Verifikasi */}
        <button
          type="button"
          onClick={() => setFilterStatus('Menunggu Verifikasi')}
          className={`text-left bg-white border ${filterStatus === 'Menunggu Verifikasi' ? 'ring-2 ring-amber-500' : 'border-[#E2E8F0]'} rounded-lg p-4 shadow-level-1 border-l-4 border-l-amber-500 hover:shadow-level-2 transition`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase">Menunggu Validasi</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600 mt-2 tnum">
            {pendingCount}
          </div>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">Klik untuk filter</span>
        </button>

        {/* Sedang Diproses */}
        <button
          type="button"
          onClick={() => setFilterStatus('Sedang Diproses')}
          className={`text-left bg-white border ${filterStatus === 'Sedang Diproses' ? 'ring-2 ring-teal-600' : 'border-[#E2E8F0]'} rounded-lg p-4 shadow-level-1 border-l-4 border-l-teal-600 hover:shadow-level-2 transition`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-800 uppercase">Sedang Ditangani</span>
            <AlertTriangle className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-teal-700 mt-2 tnum">
            {inProgressCount}
          </div>
          <span className="text-[11px] text-teal-700 mt-1 block">Klik untuk filter</span>
        </button>

        {/* Selesai */}
        <button
          type="button"
          onClick={() => setFilterStatus('Selesai')}
          className={`text-left bg-white border ${filterStatus === 'Selesai' ? 'ring-2 ring-emerald-500' : 'border-[#E2E8F0]'} rounded-lg p-4 shadow-level-1 border-l-4 border-l-emerald-500 hover:shadow-level-2 transition`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 uppercase">Laporan Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2 tnum">
            {completedCount}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Rasio {resolutionRate}% tuntas</span>
        </button>

        {/* Ditolak */}
        <button
          type="button"
          onClick={() => setFilterStatus('Ditolak')}
          className={`text-left bg-white border ${filterStatus === 'Ditolak' ? 'ring-2 ring-red-500' : 'border-[#E2E8F0]'} rounded-lg p-4 shadow-level-1 hover:shadow-level-2 transition`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Tidak Valid / Ditolak</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-700 mt-2 tnum">
            {rejectedCount}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Klik untuk filter</span>
        </button>
      </div>

      {/* Filter and Table Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-level-1 overflow-hidden">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-[#F1F5F9] bg-surface-low flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Cari ID tiket, judul, lokasi, pelapor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              <option value="ALL">Semua Status ({complaints.length})</option>
              <option value="Menunggu Verifikasi">Menunggu Validasi ({pendingCount})</option>
              <option value="Sedang Diproses">Sedang Diproses ({inProgressCount})</option>
              <option value="Selesai">Selesai ({completedCount})</option>
              <option value="Ditolak">Ditolak ({rejectedCount})</option>
            </select>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Subdistrict Filter */}
            <select
              value={filterSubdistrict}
              onChange={(e) => setFilterSubdistrict(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            >
              <option value="ALL">Semua Kecamatan</option>
              {subdistricts.map((s) => (
                <option key={s} value={s}>Kec. {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Complaints Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">No. Tiket</th>
                <th className="py-3 px-4">Laporan & Lokasi</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Prioritas</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dinas / Petugas</th>
                <th className="py-3 px-4 text-right">Aksi Tindak Lanjut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                    {/* Tiket & Waktu */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-brand-primary tnum">
                        #{item.id}
                      </span>
                      <span className="block text-[10px] text-slate-400 tnum mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>

                    {/* Judul & Lokasi */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={item.photo}
                          alt=""
                          className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.location} (Kec. {item.subdistrict})
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Pelapor: {item.isAnonymous ? 'Anonim' : item.reporterName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Kategori */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-slate-700 font-medium block">{item.category}</span>
                    </td>

                    {/* Prioritas */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Dinas & Petugas */}
                    <td className="py-3 px-4 text-[11px]">
                      {item.assignedOpd ? (
                        <div>
                          <span className="font-semibold text-slate-800 block truncate max-w-[150px]">
                            {item.assignedOpd}
                          </span>
                          <span className="text-slate-500 block truncate max-w-[150px]">
                            {item.assignedOfficer || 'Menunggu penugasan'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                          Belum Disposisi
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                      {/* Lihat Detail */}
                      <button
                        onClick={() => {
                          setSelectedTicketId(item.id);
                          setActiveTab('track');
                        }}
                        className="px-2.5 py-1 text-slate-600 hover:text-brand-primary bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-medium transition"
                        title="Lihat Detail & Timeline"
                      >
                        Detail
                      </button>

                      {/* Tombol Verifikasi & Disposisi */}
                      <button
                        onClick={() => handleOpenModal(item)}
                        className={`px-3 py-1 text-[11px] font-semibold rounded text-white transition ${
                          item.status === 'Menunggu Verifikasi'
                            ? 'bg-brand-primary hover:bg-brand-primary-hover shadow-sm'
                            : 'bg-brand-secondary hover:bg-brand-secondary-hover'
                        }`}
                      >
                        {item.status === 'Menunggu Verifikasi' ? 'Verifikasi & Disposisi' : 'Ubah Disposisi'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Tidak ditemukan data pengaduan yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification & Disposition Modal */}
      {modalComplaint && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-level-3 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-primary" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Formulir Verifikasi & Disposisi Resmi
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 tnum">
                    Nomor Tiket: #{modalComplaint.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalComplaint(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Complaint Summary */}
            <div className="mt-4 p-3.5 bg-surface-low rounded border border-slate-200 text-xs space-y-2">
              <div className="flex items-start gap-3">
                <img
                  src={modalComplaint.photo}
                  alt=""
                  className="w-16 h-16 rounded object-cover border border-slate-300 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{modalComplaint.title}</h4>
                  <p className="text-slate-600 mt-0.5 line-clamp-2">{modalComplaint.description}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    📍 {modalComplaint.location} (Kec. {modalComplaint.subdistrict})
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleProcessDisposition} className="mt-5 space-y-4 text-xs">
              
              {/* Approval Choice */}
              <div>
                <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Keputusan Verifikasi Lapangan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer transition ${
                    dispositionForm.approved ? 'bg-emerald-50 border-emerald-500 text-emerald-900' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="approved_choice"
                      checked={dispositionForm.approved === true}
                      onChange={() => setDispositionForm({ ...dispositionForm, approved: true })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="font-semibold">Valid & Disposisikan ke OPD</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded border cursor-pointer transition ${
                    !dispositionForm.approved ? 'bg-red-50 border-red-500 text-red-900' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="approved_choice"
                      checked={dispositionForm.approved === false}
                      onChange={() => setDispositionForm({ ...dispositionForm, approved: false })}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className="font-semibold">Tolak Laporan (Tidak Valid)</span>
                  </label>
                </div>
              </div>

              {dispositionForm.approved ? (
                <>
                  {/* Select OPD */}
                  <div>
                    <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                      Disposisi ke Dinas Teknis (OPD Terkait) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={dispositionForm.assignedOpd}
                      onChange={(e) => setDispositionForm({ ...dispositionForm, assignedOpd: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:ring-1 focus:ring-brand-primary"
                    >
                      <option value="Dinas Bina Marga & Bina Konstruksi (PUPR)">Dinas PUPR (Bina Marga & Saluran)</option>
                      <option value="Dinas Lingkungan Hidup (DLH)">Dinas Lingkungan Hidup (DLH)</option>
                      <option value="Dinas Perhubungan (Dishub)">Dinas Perhubungan (PJU & Marka)</option>
                      <option value="Satuan Polisi Pamong Praja (Satpol PP)">Satuan Polisi Pamong Praja (Satpol PP)</option>
                    </select>
                  </div>

                  {/* Select Priority & Officer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                        Tingkat Prioritas (SLA)
                      </label>
                      <select
                        value={dispositionForm.priority}
                        onChange={(e) => setDispositionForm({ ...dispositionForm, priority: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900"
                      >
                        <option value="Tinggi">Tinggi (SLA 24 Jam - Segera)</option>
                        <option value="Sedang">Sedang (SLA 48 Jam - Standar)</option>
                        <option value="Rendah">Rendah (SLA 72 Jam - Berkala)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-800 uppercase tracking-wider mb-1">
                        Petugas Lapangan Penanggung Jawab
                      </label>
                      <select
                        value={dispositionForm.officerId}
                        onChange={(e) => setDispositionForm({ ...dispositionForm, officerId: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded text-slate-900"
                      >
                        {officers.map((off) => (
                          <option key={off.id} value={off.id}>
                            {off.name} — {off.opdName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                /* Rejection Reason */
                <div>
                  <label className="block font-semibold text-red-800 uppercase tracking-wider mb-1">
                    Alasan Resmi Penolakan Laporan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={dispositionForm.rejectionReason}
                    onChange={(e) => setDispositionForm({ ...dispositionForm, rejectionReason: e.target.value })}
                    placeholder="Contoh: Lokasi tidak ditemukan / Foto tidak relevan / Bukan merupakan kewenangan jalan kota..."
                    className="w-full px-3 py-2 border border-red-300 rounded text-slate-900 focus:ring-1 focus:ring-red-500"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Alasan ini akan tampil di pelacakan publik warga pelapor secara transparan.
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalComplaint(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-xs font-semibold text-white rounded shadow-sm transition ${
                    dispositionForm.approved
                      ? 'bg-brand-primary hover:bg-brand-primary-hover'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {dispositionForm.approved ? 'Terbitkan Surat Disposisi' : 'Konfirmasi Tolak Laporan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
