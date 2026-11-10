import React from 'react';
import { Shield, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#142538] text-slate-300 text-xs border-t border-slate-700 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Institutional Identity */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-brand-primary text-white flex items-center justify-center font-bold">
                <svg viewBox="0 0 48 48" className="w-5 h-5 fill-amber-400">
                  <path d="M24 4L17 17H8L13 26L7 38H17L24 31L31 38H41L35 26L40 17H31L24 4Z" />
                </svg>
              </div>
              <span className="font-bold text-white text-sm">Smart Complaint System</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Platform layanan pengaduan prasarana kota terintegrasi berbasis transparansi dan akuntabilitas tindak lanjut respons cepat (SLA).
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              <span className="text-amber-400 font-semibold block">Inisiatif Kolaboratif:</span>
              Pemerintah Daerah Provinsi Lampung & Universitas Teknokrat Indonesia.
            </div>
          </div>

          {/* Col 2: Kategori Layanan MVP */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Layanan Penanganan Kota
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Jalan Rusak, Berlubang & Amblas (PUPR)</li>
              <li>• Sampah Menumpuk & Liar (DLH)</li>
              <li>• Penerangan Jalan Umum / PJU Mati (Dishub)</li>
              <li>• Drainase & Gorong-Gorong Tersumbat</li>
              <li>• Ketertiban Umum & PKL Liar (Satpol PP)</li>
            </ul>
          </div>

          {/* Col 3: Layanan Darurat & Kontak */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Kontak Layanan Publik
            </h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Call Center Darurat: <strong>112 (Bebas Pulsa)</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>pengaduan@lampungprov.go.id</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Kompleks Kantor Gubernur Lampung / Balai Kota Bandar Lampung</span>
              </div>
            </div>
          </div>

          {/* Col 4: Kampus & Riset Teknokrat */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Pusat Inovasi & Riset
            </h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Fakultas Teknik & Ilmu Komputer, Universitas Teknokrat Indonesia (UTI) — Sang Juara.
            </p>
            <p className="text-[11px] text-slate-400">
              Jl. ZA. Pagar Alam No. 9-11, Labuhan Ratu, Kedaton, Bandar Lampung.
            </p>
            <a
              href="https://teknokrat.ac.id"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-400 hover:underline text-[11px] font-semibold mt-1"
            >
              <span>teknokrat.ac.id</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© 2026 Pemerintah Daerah Provinsi Lampung & Universitas Teknokrat Indonesia. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center gap-1">
            Mendukung Inisiatif Smart City Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
};
