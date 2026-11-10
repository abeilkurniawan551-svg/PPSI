import React, { useState, useRef } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { validateImageFile, isValidPhone, sanitizeText } from '../utils/security';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  Shield, 
  Send, 
  Info, 
  Check, 
  AlertCircle,
  HelpCircle,
  UploadCloud,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CitizenForm = () => {
  const { categories, subdistricts, createComplaint, setActiveTab, setSelectedTicketId } = useComplaints();
  const lastSubmitTimeRef = useRef(0);

  const [formData, setFormData] = useState({
    title: '',
    categoryId: 'jalan_rusak',
    categoryName: 'Jalan Rusak & Berlubang',
    description: '',
    location: '',
    subdistrict: 'Kedaton',
    coordinates: { lat: -5.38178, lng: 105.25832 },
    photo: '',
    reporterName: '',
    reporterPhone: '',
    isAnonymous: false,
    priority: 'Sedang',
  });

  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [locating, setLocating] = useState(false);

  // Subdistrict central coordinates in Bandar Lampung
  const SUBDISTRICT_COORDS = {
    'Kedaton': { lat: -5.38178, lng: 105.25832 },
    'Sukarame': { lat: -5.37890, lng: 105.30120 },
    'Tanjung Karang Pusat': { lat: -5.40210, lng: 105.25360 },
    'Tanjung Karang Timur': { lat: -5.41200, lng: 105.27100 },
    'Teluk Betung Selatan': { lat: -5.45100, lng: 105.26300 },
    'Teluk Betung Utara': { lat: -5.43200, lng: 105.26100 },
    'Rajabasa': { lat: -5.36200, lng: 105.24400 },
    'Kemiling': { lat: -5.40550, lng: 105.21500 },
    'Way Halim': { lat: -5.39050, lng: 105.27510 },
    'Panjang': { lat: -5.47200, lng: 105.32100 },
  };

  const handleSubdistrictSelect = (sub) => {
    const coords = SUBDISTRICT_COORDS[sub] || { lat: -5.38178, lng: 105.25832 };
    setFormData((prev) => ({
      ...prev,
      subdistrict: sub,
      coordinates: coords
    }));
  };

  // Quick preset photos for easy testing
  const samplePhotos = [
    {
      label: 'Foto Jalan Rusak',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      category: 'jalan_rusak'
    },
    {
      label: 'Foto Sampah Menumpuk',
      url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
      category: 'sampah_menumpuk'
    },
    {
      label: 'Foto Lampu PJU Mati',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      category: 'lampu_mati'
    }
  ];

  // AI Classification feature (PRD FR-15)
  const handleAiAnalyze = () => {
    const text = (formData.title + ' ' + formData.description).toLowerCase();

    if (!text.trim() || text.length < 5) {
      alert('Tuliskan judul atau deskripsi permasalahan terlebih dahulu agar sistem AI dapat menganalisis.');
      return;
    }

    let detectedCatId = 'jalan_rusak';
    let detectedPriority = 'Sedang';
    let reasoning = 'Mendeteksi indikasi kerusakan struktur prasarana.';

    if (text.includes('sampah') || text.includes('bau') || text.includes('kotor') || text.includes('tumpuk') || text.includes('plastik') || text.includes('limbah')) {
      detectedCatId = 'sampah_menumpuk';
      detectedPriority = text.includes('banyak') || text.includes('pasar') ? 'Tinggi' : 'Sedang';
      reasoning = 'Terdeteksi kata kunci terkait tumpukan limbah dan sampah lingkungan.';
    } else if (text.includes('lampu') || text.includes('pju') || text.includes('gelap') || text.includes('padam') || text.includes('tiang') || text.includes('penerangan')) {
      detectedCatId = 'lampu_mati';
      detectedPriority = text.includes('rawan') || text.includes('begal') || text.includes('panjang') ? 'Tinggi' : 'Sedang';
      reasoning = 'Terdeteksi permasalahan penerangan jalan umum (PJU) dan keselamatan malam hari.';
    } else if (text.includes('banjir') || text.includes('got') || text.includes('drainase') || text.includes('saluran') || text.includes('genangan') || text.includes('tersumbat')) {
      detectedCatId = 'drainase_tersumbat';
      detectedPriority = 'Tinggi';
      reasoning = 'Terdeteksi potensi sumbatan drainase dan risiko genangan air hujan.';
    } else if (text.includes('lubang') || text.includes('rusak') || text.includes('aspal') || text.includes('jalan') || text.includes('amblas') || text.includes('ambles')) {
      detectedCatId = 'jalan_rusak';
      detectedPriority = text.includes('dalam') || text.includes('bahaya') ? 'Tinggi' : 'Sedang';
      reasoning = 'Terdeteksi keluhan kerusakan badan jalan atau permukaan aspal berlubang.';
    }

    const matchedCat = categories.find((c) => c.id === detectedCatId) || categories[0];

    setAiSuggestion({
      categoryId: matchedCat.id,
      categoryName: matchedCat.name,
      priority: detectedPriority,
      reasoning: reasoning,
      opd: matchedCat.opd
    });

    setFormData((prev) => ({
      ...prev,
      categoryId: matchedCat.id,
      categoryName: matchedCat.name,
      priority: detectedPriority
    }));
  };

  // GPS auto-detect
  const handleGetLocation = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            coordinates: {
              lat: Number(position.coords.latitude.toFixed(5)),
              lng: Number(position.coords.longitude.toFixed(5))
            },
            location: prev.location || `Koordinat GPS: ${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)} (Bandar Lampung)`
          }));
          setLocating(false);
        },
        (error) => {
          // Fallback to Bandar Lampung center
          setFormData((prev) => ({
            ...prev,
            coordinates: { lat: -5.39714, lng: 105.26679 },
            location: prev.location || 'Jl. Raden Intan, Enggal, Bandar Lampung (Titik Pusat Kota)'
          }));
          setLocating(false);
        },
        { timeout: 5000 }
      );
    } else {
      setLocating(false);
    }
  };

  // File upload with client-side security validation (Size & MIME type - CWE-434)
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
        setPhotoPreview(reader.result);
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler with Anti-Spam Cooldown & Input Sanitization
  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side rate-limiting / anti-spam cooldown (minimum 3 seconds between submits)
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 3000) {
      alert('Mohon tunggu sejenak sebelum mengirim laporan kembali.');
      return;
    }

    const cleanTitle = sanitizeText(formData.title, 150);
    const cleanDesc = sanitizeText(formData.description, 1500);
    const cleanLocation = sanitizeText(formData.location, 250);
    const cleanReporterName = formData.isAnonymous ? 'Warga (Anonim)' : sanitizeText(formData.reporterName, 100);
    const cleanPhone = formData.isAnonymous ? '' : sanitizeText(formData.reporterPhone, 20);

    if (!cleanTitle) {
      alert('Mohon isi judul pengaduan');
      return;
    }
    if (!cleanDesc) {
      alert('Mohon isi deskripsi pengaduan secara jelas');
      return;
    }
    if (!cleanLocation) {
      alert('Mohon sebutkan lokasi atau patokan kejadian');
      return;
    }
    if (!formData.isAnonymous && !cleanReporterName) {
      alert('Mohon tulis nama pelapor atau pilih opsi Lapor Anonim');
      return;
    }
    if (!formData.isAnonymous && cleanPhone && !isValidPhone(cleanPhone)) {
      alert('Format nomor telepon tidak valid. Gunakan format yang benar (misal: 08123456789).');
      return;
    }

    lastSubmitTimeRef.current = now;
    setIsSubmitting(true);

    // Get category name
    const cat = categories.find((c) => c.id === formData.categoryId);
    const categoryName = cat ? cat.name : 'Jalan Rusak & Berlubang';

    const fallbackPhoto = samplePhotos[0].url;

    setTimeout(() => {
      const created = createComplaint({
        ...formData,
        title: cleanTitle,
        description: cleanDesc,
        location: cleanLocation,
        reporterName: cleanReporterName,
        reporterPhone: cleanPhone,
        isAnonymous: !!formData.isAnonymous,
        category: categoryName,
        photo: photoPreview || formData.photo || fallbackPhoto
      });

      setIsSubmitting(false);

      // Trigger Confetti effect
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      // Reset form fields
      setFormData({
        title: '',
        categoryId: 'jalan_rusak',
        categoryName: 'Jalan Rusak & Berlubang',
        description: '',
        location: '',
        subdistrict: 'Kedaton',
        coordinates: { lat: -5.38178, lng: 105.25832 },
        photo: '',
        reporterName: '',
        reporterPhone: '',
        isAnonymous: false,
        priority: 'Sedang',
      });
      setPhotoPreview(null);
      setAiSuggestion(null);

      // Redirect to tracking page
      setSelectedTicketId(created.id);
      setActiveTab('track');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-secondary mb-1">
          <Shield className="w-4 h-4" />
          <span>Layanan Aspirasi & Pengaduan Online Rakyat Lampung</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary tracking-tight">
          Buat Pengaduan Fasilitas Kota
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Laporkan permasalahan jalan rusak, sampah menumpuk, atau lampu penerangan jalan mati di lingkungan Anda. Laporan akan langsung diteruskan ke dinas teknis terkait.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-level-1 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Judul Pengaduan */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="title" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Judul Laporan Pengaduan <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">Contoh: Aspal Rusak Berlubang di Depan Puskesmas</span>
            </div>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Sebutkan inti permasalahan secara ringkas dan padat..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface-lowest border border-[#CBD5E1] rounded-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>

          {/* Kategori & AI Assist */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="category" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Kategori Masalah <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleAiAnalyze}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-secondary hover:text-brand-secondary-hover bg-teal-50 px-2.5 py-1 rounded border border-teal-200 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analisis Otomatis AI (FR-15)</span>
              </button>
            </div>

            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) => {
                const selected = categories.find((c) => c.id === e.target.value);
                setFormData({
                  ...formData,
                  categoryId: e.target.value,
                  categoryName: selected ? selected.name : ''
                });
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-surface-lowest border border-[#CBD5E1] rounded-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} — Penanggung Jawab: {cat.opd}
                </option>
              ))}
            </select>

            {/* AI Suggestion Box */}
            {aiSuggestion && (
              <div className="mt-2.5 p-3 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-sm text-xs text-slate-700 flex items-start gap-2.5 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-brand-secondary">
                    Rekomendasi AI: {aiSuggestion.categoryName} ({aiSuggestion.opd})
                  </p>
                  <p className="text-slate-600 mt-0.5">{aiSuggestion.reasoning}</p>
                </div>
              </div>
            )}
          </div>

          {/* Deskripsi Masalah */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
              Deskripsi Kejadian / Kondisi Lapangan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan secara detail: berapa perkiraan ukuran kerusakan, sejak kapan masalah terjadi, dampak terhadap warga/lalu lintas..."
              className="w-full px-3.5 py-2.5 text-sm bg-surface-lowest border border-[#CBD5E1] rounded-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
            />
          </div>

          {/* Lokasi & Kecamatan */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="location" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Alamat / Patokan Lokasi <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-brand-primary hover:underline"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-secondary" />
                  <span>{locating ? 'Mendeteksi...' : 'Deteksi GPS Saya'}</span>
                </button>
              </div>
              <input
                id="location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Contoh: Jl. Teuku Umar No. 12, seberang minimarket..."
                className="w-full px-3.5 py-2.5 text-sm bg-surface-lowest border border-[#CBD5E1] rounded-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
              />
            </div>

            <div>
              <label htmlFor="subdistrict" className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                Kecamatan (Kota Bandar Lampung)
              </label>
              <select
                id="subdistrict"
                value={formData.subdistrict}
                onChange={(e) => handleSubdistrictSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-surface-lowest border border-[#CBD5E1] rounded-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
              >
                {subdistricts.map((sub) => (
                  <option key={sub} value={sub}>
                    Kec. {sub}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 font-mono mt-1 block tnum">
                📍 Geo: {formData.coordinates.lat}, {formData.coordinates.lng}
              </span>
            </div>
          </div>

          {/* Unggah Foto Pendukung */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
              Foto Bukti Pendukung <span className="text-red-500">*</span>
            </label>

            <div className="border-2 border-dashed border-[#CBD5E1] hover:border-brand-primary rounded-lg p-5 text-center bg-surface-low transition-colors">
              {photoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Preview Laporan"
                    className="max-h-56 rounded-md object-cover border border-slate-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">
                    Klik untuk unggah foto atau seret berkas ke sini
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Format JPG, PNG atau WEBP (Maks. 5 MB)
                  </p>
                  <label className="mt-3 inline-block cursor-pointer px-4 py-1.5 bg-white border border-[#CBD5E1] hover:bg-slate-50 text-xs font-semibold text-slate-700 rounded-sm shadow-sm transition">
                    Pilih Berkas Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Sample Photo Presets for Quick Testing */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium block mb-2">
                  Atau pilih contoh foto sampel untuk pengujian instan:
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {samplePhotos.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPhotoPreview(sample.url);
                        setFormData((prev) => ({
                          ...prev,
                          photo: sample.url,
                          categoryId: sample.category
                        }));
                      }}
                      className="text-xs px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-300 rounded text-slate-700 hover:text-brand-primary transition"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Identitas Pelapor & Anonimitas */}
          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Identitas Pelapor
                </h4>
                <p className="text-xs text-slate-500">
                  Data Anda dilindungi untuk keperluan konfirmasi tindak lanjut oleh dinas.
                </p>
              </div>

              {/* Checkbox Anonim (PRD Inovasi) */}
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 border border-slate-200 rounded">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                  className="rounded text-brand-primary focus:ring-brand-primary"
                />
                <span className="text-xs font-medium text-slate-700">Lapor Anonim</span>
              </label>
            </div>

            {!formData.isAnonymous ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reporterName" className="block text-xs font-medium text-slate-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reporterName"
                    type="text"
                    value={formData.reporterName}
                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                    placeholder="Nama sesuai KTP..."
                    className="w-full px-3 py-2 text-sm bg-surface-lowest border border-[#CBD5E1] rounded-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="reporterPhone" className="block text-xs font-medium text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    id="reporterPhone"
                    type="tel"
                    value={formData.reporterPhone}
                    onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-3 py-2 text-sm bg-surface-lowest border border-[#CBD5E1] rounded-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Mode Anonim Aktif: Identitas nama dan nomor telepon Anda akan dirahasiakan dari publik dan petugas lapangan.
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Dengan mengirimkan laporan, Anda menyetujui syarat & ketentuan pelaporan Smart City Lampung.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 bg-[#1F3A5F] hover:bg-[#162A45] text-white text-sm font-semibold rounded-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mengirim Laporan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Laporan Pengaduan</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
