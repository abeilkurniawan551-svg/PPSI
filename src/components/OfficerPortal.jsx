import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { validateImageFile } from '../utils/security';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { 
  Wrench, 
  MapPin, 
  Navigation, 
  Camera, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  Check, 
  Phone, 
  AlertCircle,
  HardHat,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OfficerPortal = () => {
  const { 
    complaints, 
    officers, 
    currentOfficer, 
    setCurrentOfficer, 
    updateOfficerStatus, 
    setSelectedTicketId, 
    setActiveTab 
  } = useComplaints();

  // Selected complaint for updating status
  const [activeTask, setActiveTask] = useState(null);
  const [updateModalType, setUpdateModalType] = useState(null); // 'progress' | 'complete'
  const [progressNotes, setProgressNotes] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');
  const [completionPhotoPreview, setCompletionPhotoPreview] = useState(null);

  // Sample completion photos for quick testing
  const sampleCompletionPhotos = [
    {
      label: 'Hasil Aspal Mulus (PUPR)',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Hasil Bersih Bebas Sampah (DLH)',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'Lampu PJU Menyala Terang (Dishub)',
      url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Filter tasks assigned to current officer (or all in progress if none)
  const myTasks = complaints.filter(
    (c) => c.officerId === currentOfficer.id || (!c.officerId && c.status === 'Sedang Diproses')
  );

  const handleOpenProgress = (task) => {
    setActiveTask(task);
    setProgressNotes('');
    setUpdateModalType('progress');
  };

  const handleOpenComplete = (task) => {
    setActiveTask(task);
    setCompletionNotes('');
    setCompletionPhotoPreview(sampleCompletionPhotos[0].url);
    setUpdateModalType('complete');
  };

  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!activeTask) return;

    updateOfficerStatus(activeTask.id, {
      status: 'Sedang Diproses',
      actionNotes: progressNotes || 'Petugas sedang melakukan penanganan fisik di titik lokasi.'
    });

    setUpdateModalType(null);
  };

  const handleSaveComplete = (e) => {
    e.preventDefault();
    if (!activeTask) return;

    updateOfficerStatus(activeTask.id, {
      status: 'Selesai',
      completionPhoto: completionPhotoPreview || sampleCompletionPhotos[0].url,
      completionNotes: completionNotes || 'Penanganan fisik tuntas 100% sesuai standar operasional dinas.',
      actionNotes: 'Laporan telah diselesaikan dan bukti foto penyelesaian telah diunggah.'
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    setUpdateModalType(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCompletionPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Officer Header Profile */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 sm:p-6 shadow-level-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-sm bg-brand-secondary text-white flex items-center justify-center font-bold shadow">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentOfficer.name}</h1>
              <span className="text-[11px] bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full border border-teal-300">
                {currentOfficer.opdName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Jabatan: {currentOfficer.role} — Unit Reaksi Cepat Lapangan Kota Bandar Lampung
            </p>
          </div>
        </div>

        {/* Switch Officer Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Ganti Profil Petugas:
          </label>
          <select
            value={currentOfficer.id}
            onChange={(e) => {
              const off = officers.find((o) => o.id === e.target.value);
              if (off) setCurrentOfficer(off);
            }}
            className="px-3 py-1.5 text-xs bg-surface-low border border-[#CBD5E1] rounded-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
          >
            {officers.map((off) => (
              <option key={off.id} value={off.id}>
                {off.name} ({off.opdName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-level-1">
          <span className="text-xs font-semibold text-slate-500 uppercase">Tugas Ditugaskan</span>
          <div className="text-2xl font-bold text-brand-primary mt-1 tnum">{myTasks.length}</div>
          <span className="text-[11px] text-slate-500">Antrean kerja saat ini</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-level-1 border-l-4 border-l-teal-600">
          <span className="text-xs font-semibold text-teal-800 uppercase">Sedang Ditangani</span>
          <div className="text-2xl font-bold text-teal-700 mt-1 tnum">
            {myTasks.filter((t) => t.status === 'Sedang Diproses').length}
          </div>
          <span className="text-[11px] text-teal-700">Dalam proses fisik</span>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-level-1 border-l-4 border-l-emerald-600">
          <span className="text-xs font-semibold text-emerald-800 uppercase">Pekerjaan Tuntas</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tnum">
            {myTasks.filter((t) => t.status === 'Selesai').length}
          </div>
          <span className="text-[11px] text-emerald-700">Sudah ada bukti penanganan</span>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Daftar Penugasan Lapangan ({myTasks.length})
          </h2>
          <span className="text-xs text-slate-500">
            Pilih laporan untuk mengupdate progres atau menyelesaikan pekerjaan
          </span>
        </div>

        {myTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border border-[#E2E8F0] rounded-lg shadow-level-1 p-5 flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  {/* Top line */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-mono font-bold text-brand-primary tnum">
                      #{task.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} size="sm" />
                    </div>
                  </div>

                  {/* Task Image & Title */}
                  <div className="flex items-start gap-3 mt-3">
                    <img
                      src={task.photo}
                      alt=""
                      className="w-16 h-16 rounded object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                        {task.title}
                      </h3>
                      <span className="text-[11px] text-slate-500 block mt-0.5 font-medium">
                        Kategori: {task.category}
                      </span>
                    </div>
                  </div>

                  {/* Location & GPS */}
                  <div className="mt-3 p-2.5 bg-surface-low rounded text-xs text-slate-700 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-secondary shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        <strong>Titik Lokasi:</strong> {task.location} (Kec. {task.subdistrict})
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-5 tnum">
                      Koordinat GPS: {task.coordinates.lat}, {task.coordinates.lng}
                    </div>
                  </div>

                  {/* Reporter Contact if not anonymous */}
                  {!task.isAnonymous && task.reporterPhone && (
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Kontak Warga: {task.reporterName}</span>
                      </div>
                      <a
                        href={`https://wa.me/62${task.reporterPhone.replace(/[^0-9]/g, '').slice(1)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-semibold text-emerald-700 hover:underline"
                      >
                        {task.reporterPhone}
                      </a>
                    </div>
                  )}

                  {/* Last Note in timeline */}
                  {task.timeline && task.timeline.length > 0 && (
                    <div className="mt-3 text-[11px] text-slate-600 bg-blue-50/50 p-2.5 rounded border border-blue-100">
                      <strong className="text-brand-primary block mb-0.5">Status Terakhir:</strong>
                      {task.timeline[task.timeline.length - 1].notes}
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  {/* External Google Maps Nav */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${task.coordinates.lat},${task.coordinates.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-secondary hover:underline font-medium"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Rute Google Maps</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedTicketId(task.id);
                        setActiveTab('track');
                      }}
                      className="px-2.5 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition"
                    >
                      Audit
                    </button>

                    {task.status !== 'Selesai' && (
                      <>
                        <button
                          onClick={() => handleOpenProgress(task)}
                          className="px-3 py-1.5 text-xs font-semibold bg-slate-700 hover:bg-slate-800 text-white rounded transition"
                        >
                          Update Progres
                        </button>
                        <button
                          onClick={() => handleOpenComplete(task)}
                          className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm transition flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Lapor Selesai</span>
                        </button>
                      </>
                    )}

                    {task.status === 'Selesai' && (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded">
                        <Check className="w-3.5 h-3.5" />
                        <span>Selesai Diverifikasi</span>
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">Semua Tugas Sudah Selesai</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tidak ada tugas yang sedang aktif untuk petugas {currentOfficer.name}. Anda dapat mengganti petugas melalui dropdown di atas.
            </p>
          </div>
        )}
      </div>

      {/* Modal: Update Progres */}
      {updateModalType === 'progress' && activeTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-level-3 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Pembaruan Progres Lapangan — #{activeTask.id}
            </h3>
            <form onSubmit={handleSaveProgress} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan Tindak Lanjut Teknis:
                </label>
                <textarea
                  rows={4}
                  required
                  value={progressNotes}
                  onChange={(e) => setProgressNotes(e.target.value)}
                  placeholder="Contoh: Tim sudah tiba di lokasi membawa peralatan compactor. Sedang proses pembersihan material..."
                  className="w-full p-2.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdateModalType(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white rounded shadow-sm"
                >
                  Simpan Progres
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lapor Selesai (Unggah Bukti Penanganan) */}
      {updateModalType === 'complete' && activeTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-level-3 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Unggah Bukti Penyelesaian Pekerjaan (FR-09)
                </h3>
                <span className="text-[11px] font-mono text-slate-500 tnum">
                  Nomor Tiket: #{activeTask.id}
                </span>
              </div>
              <button
                onClick={() => setUpdateModalType(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveComplete} className="mt-4 space-y-4 text-xs">
              {/* Photo Preview / Upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Foto Bukti Hasil Pengerjaan Selesai (Kondisi Sesudah) <span className="text-red-500">*</span>
                </label>
                
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 text-center">
                  {completionPhotoPreview ? (
                    <div>
                      <img
                        src={completionPhotoPreview}
                        alt="Bukti Selesai"
                        className="max-h-52 w-full object-cover rounded border border-slate-300"
                      />
                    </div>
                  ) : (
                    <div className="py-6">
                      <Camera className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                      <p className="text-slate-600">Unggah foto bukti fisik penanganan</p>
                    </div>
                  )}

                  {/* Upload file or pick samples */}
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    <label className="cursor-pointer px-3 py-1 bg-white border border-slate-300 rounded font-medium text-slate-700 hover:bg-slate-100">
                      Pilih dari File Komputer
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {sampleCompletionPhotos.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCompletionPhotoPreview(s.url)}
                        className="px-2.5 py-1 text-[11px] bg-teal-50 border border-teal-200 text-teal-800 rounded hover:bg-teal-100"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Completion Notes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Keterangan Resmi Penyelesaian Fisik:
                </label>
                <textarea
                  rows={3}
                  required
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Contoh: Lubang jalan telah ditutup dengan cold mix aspal 5 cm dan diratakan sempurna. Arus lalu lintas telah kembali normal."
                  className="w-full p-2.5 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdateModalType(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Laporan Selesai</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
