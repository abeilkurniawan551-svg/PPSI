import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  MessageSquare, 
  AlertTriangle,
  Building2,
  Wrench,
  Image as ImageIcon,
  Copy,
  Check,
  Share2
} from 'lucide-react';

export const TicketTracker = () => {
  const { 
    complaints, 
    selectedTicketId, 
    setSelectedTicketId, 
    findComplaintById, 
    submitFeedback,
    setActiveTab,
    addToast
  } = useComplaints();

  const [inputTicket, setInputTicket] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Copy Ticket ID to clipboard
  const handleCopyTicket = (id) => {
    navigator.clipboard?.writeText(id);
    setCopied(true);
    addToast(`Nomor Tiket #${id} disalin ke clipboard!`, 'info', 'Tersalin');
    setTimeout(() => setCopied(false), 2500);
  };

  // Default to selected ticket or first complaint
  const activeComplaint = selectedTicketId 
    ? findComplaintById(selectedTicketId) 
    : complaints[0];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputTicket.trim()) return;
    const found = findComplaintById(inputTicket);
    if (found) {
      setSelectedTicketId(found.id);
      setInputTicket('');
    } else {
      alert(`Nomor tiket #${inputTicket.toUpperCase()} tidak ditemukan.`);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!activeComplaint) return;
    submitFeedback(activeComplaint.id, {
      rating: ratingInput,
      comment: commentInput
    });
    setShowFeedbackModal(false);
    setCommentInput('');
  };

  return (
    <div className="max-w-[1440px] mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Banner & Search Input */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 shadow-level-1 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-brand-primary">
              Pelacakan Status Pengaduan (Real-Time Tracking)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Pantau tahapan tindak lanjut laporan Anda secara transparan dari verifikasi hingga penyelesaian fisik di lapangan.
            </p>
          </div>

          {/* Form Lacak */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Masukkan Nomor Tiket (misal: PKM-2024-0012)..."
                value={inputTicket}
                onChange={(e) => setInputTicket(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-surface-lowest border border-[#CBD5E1] rounded-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-semibold rounded-sm transition whitespace-nowrap"
            >
              Cari Tiket
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Ticket Details & Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {activeComplaint ? (
            <>
              {/* Ticket Main Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-level-1 overflow-hidden">
                {/* Header Strip */}
                <div className="p-5 sm:p-6 border-b border-[#F1F5F9] bg-gradient-to-r from-slate-50 to-white flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-primary tnum bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        #{activeComplaint.id}
                      </span>
                      <button
                        onClick={() => handleCopyTicket(activeComplaint.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-brand-primary p-1 rounded hover:bg-slate-100 transition"
                        title="Salin ID Tiket"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copied ? 'Tersalin' : 'Salin'}</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=Pantau%20progres%20laporan%20pengaduan%20Smart%20City%20Lampung%20nomor%20tiket%20%23${activeComplaint.id}%20%3A%20${encodeURIComponent(activeComplaint.title)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 p-1 rounded hover:bg-emerald-50 transition"
                        title="Bagikan ke WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Bagikan</span>
                      </a>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                      {activeComplaint.title}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={activeComplaint.priority} />
                    <StatusBadge status={activeComplaint.status} />
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 sm:p-6 space-y-5">
                  {/* Meta Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-surface-low rounded border border-slate-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">Kategori</span>
                      <span className="font-semibold text-slate-800">{activeComplaint.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Kecamatan</span>
                      <span className="font-semibold text-slate-800">Kec. {activeComplaint.subdistrict}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tanggal Lapor</span>
                      <span className="font-semibold text-slate-800 tnum">
                        {new Date(activeComplaint.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Pelapor</span>
                      <span className="font-semibold text-slate-800">
                        {activeComplaint.isAnonymous ? 'Warga (Anonim)' : activeComplaint.reporterName}
                      </span>
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Deskripsi Pengaduan
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-100">
                      {activeComplaint.description}
                    </p>
                  </div>

                  {/* Lokasi Kejadian */}
                  <div className="flex items-start gap-2 text-xs text-slate-700">
                    <MapPin className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                    <div>
                      <strong>Lokasi:</strong> {activeComplaint.location}
                      <span className="text-slate-500 ml-2 tnum">
                        (Koordinat: {activeComplaint.coordinates.lat}, {activeComplaint.coordinates.lng})
                      </span>
                    </div>
                  </div>

                  {/* Foto Laporan Awal */}
                  <div>
                    <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Foto Bukti Kerusakan Awal (Pelapor)</span>
                    </h4>
                    <div className="rounded-lg overflow-hidden border border-slate-200 max-h-72 bg-slate-100">
                      <img
                        src={activeComplaint.photo}
                        alt="Foto Pengaduan"
                        className="w-full h-full object-cover max-h-72"
                      />
                    </div>
                  </div>

                  {/* Before & After Comparison if Completed */}
                  {activeComplaint.status === 'Selesai' && activeComplaint.completionPhoto && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">
                          Bukti Verifikasi Penyelesaian Pekerjaan (Before & After)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-amber-300 rounded-lg overflow-hidden bg-amber-50/50">
                          <div className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-semibold flex items-center justify-between">
                            <span>SEBELUM (Kondisi Awal)</span>
                            <span className="text-[10px] text-amber-700">Laporan Warga</span>
                          </div>
                          <img
                            src={activeComplaint.photo}
                            alt="Kondisi Sebelum"
                            className="w-full h-48 object-cover"
                          />
                        </div>

                        <div className="border border-emerald-300 rounded-lg overflow-hidden bg-emerald-50/50">
                          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                            <span>SESUDAH (Hasil Penanganan)</span>
                            <span className="text-[10px] text-emerald-700">Bukti Dinas Resmi</span>
                          </div>
                          <img
                            src={activeComplaint.completionPhoto}
                            alt="Kondisi Sesudah"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>

                      {activeComplaint.completionNotes && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
                          <strong>Catatan Petugas Lapangan:</strong> {activeComplaint.completionNotes}
                        </div>
                      )}

                      {/* Citizen Feedback Rating Section */}
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3">
                        {activeComplaint.feedback ? (
                          <div>
                            <span className="text-xs font-semibold text-brand-primary block">
                              Ulasan & Penilaian Anda:
                            </span>
                            <div className="flex items-center gap-1 my-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= activeComplaint.feedback.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                              <span className="text-xs font-bold text-slate-700 ml-1.5">
                                ({activeComplaint.feedback.rating}/5)
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 italic">
                              "{activeComplaint.feedback.comment}"
                            </p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">
                                Pekerjaan telah tuntas! Bagaimana kepuasan Anda?
                              </p>
                              <p className="text-[11px] text-slate-600">
                                Berikan ulasan untuk membantu Pemda Lampung mengevaluasi kinerja OPD terkait.
                              </p>
                            </div>
                            <button
                              onClick={() => setShowFeedbackModal(true)}
                              className="px-4 py-2 bg-brand-secondary hover:bg-brand-secondary-hover text-white text-xs font-semibold rounded-sm shadow-sm transition whitespace-nowrap"
                            >
                              Beri Penilaian (Rating)
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Disposisi & Petugas Info */}
                  <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-brand-primary shrink-0" />
                      <div>
                        <span className="text-slate-500 block">Dinas Pelaksana (OPD):</span>
                        <span className="font-semibold text-slate-800">
                          {activeComplaint.assignedOpd || 'Menunggu verifikasi admin'}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center gap-2.5">
                      <Wrench className="w-4 h-4 text-brand-secondary shrink-0" />
                      <div>
                        <span className="text-slate-500 block">Petugas Penanggung Jawab:</span>
                        <span className="font-semibold text-slate-800">
                          {activeComplaint.assignedOfficer || 'Belum ditugaskan'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 sm:p-6 shadow-level-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-primary" />
                  <span>Jejak Riwayat Penanganan (Audit Trail)</span>
                </h3>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeComplaint.timeline.map((step, idx) => {
                    const isLast = idx === activeComplaint.timeline.length - 1;
                    return (
                      <div key={idx} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                            isLast ? 'bg-brand-secondary ring-2 ring-teal-200' : 'bg-slate-400'
                          }`}
                        />
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-800">{step.status}</span>
                            <span className="text-[11px] text-slate-500 tnum font-mono">
                              {new Date(step.timestamp).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <span className="text-[11px] font-medium text-brand-primary block mt-0.5">
                            Oleh: {step.actor}
                          </span>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                            {step.notes}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center text-slate-500">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-slate-700">Tidak ada tiket yang dipilih</p>
              <p className="text-xs mt-1">Gunakan kotak pencarian atau pilih dari daftar laporan di sebelah kanan.</p>
            </div>
          )}
        </div>

        {/* Right Column: List of All Recent Complaints */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-level-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Daftar Laporan Terkini
                </h3>
                <span className="text-[11px] text-slate-500">{complaints.length} Laporan Tersimpan</span>
              </div>
              <button
                onClick={() => setActiveTab('report')}
                className="text-xs font-semibold text-brand-secondary hover:underline"
              >
                + Buat Baru
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100 max-h-[700px] overflow-y-auto pr-1">
              {complaints.map((c) => {
                const isSelected = activeComplaint && activeComplaint.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedTicketId(c.id)}
                    className={`w-full text-left py-3 px-2 rounded-sm transition-colors flex items-start gap-3 ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-brand-primary' : 'hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={c.photo}
                      alt={c.title}
                      className="w-12 h-12 rounded object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono text-slate-500 tnum">#{c.id}</span>
                        <span className="text-[10px] text-slate-400 tnum">
                          {new Date(c.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{c.title}</p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-slate-500 truncate max-w-[110px]">
                          Kec. {c.subdistrict}
                        </span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Citizen Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-level-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Penilaian Kinerja Penanganan</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Berapa bintang kepuasan Anda terhadap kecepatan & kualitas hasil?
                </label>
                <div className="flex items-center gap-2 my-2 justify-center py-2 bg-slate-50 rounded">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= ratingInput
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tuliskan komentar atau masukan Anda untuk Pemda Lampung:
                </label>
                <textarea
                  rows={3}
                  required
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Misal: Sangat tanggap, perbaikan aspal mulus dan rapi..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-brand-secondary hover:bg-brand-secondary-hover text-white rounded shadow-sm"
                >
                  Kirim Penilaian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
