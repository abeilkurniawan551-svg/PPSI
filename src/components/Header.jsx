import React, { useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { 
  Search, 
  UserCheck, 
  ShieldCheck, 
  Wrench, 
  BarChart3, 
  RotateCcw, 
  Bell, 
  FileText, 
  MapPin, 
  PlusCircle, 
  Layers,
  ChevronDown
} from 'lucide-react';

export const Header = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery, 
    findComplaintById, 
    setSelectedTicketId,
    addToast,
    resetToSeed,
    complaints
  } = useComplaints();

  const [inputTicket, setInputTicket] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchTicket = (e) => {
    e.preventDefault();
    if (!inputTicket.trim()) return;

    const found = findComplaintById(inputTicket);
    if (found) {
      setSelectedTicketId(found.id);
      setActiveTab('track');
      addToast(`Menampilkan rincian tiket #${found.id}`, 'info', 'Tiket Ditemukan');
      setInputTicket('');
    } else {
      addToast(`Tiket #${inputTicket.toUpperCase()} tidak ditemukan di database.`, 'warning', 'Pencarian Gagal');
    }
  };

  const roles = [
    { id: 'citizen', label: 'Warga / Masyarakat', icon: UserCheck, desc: 'Pelapor & Pemantau Status' },
    { id: 'admin', label: 'Admin Pemda', icon: ShieldCheck, desc: 'Verifikasi & Disposisi OPD' },
    { id: 'officer', label: 'Petugas Lapangan', icon: Wrench, desc: 'Penanganan & Bukti Selesai' },
    { id: 'executive', label: 'Pimpinan / Dinas', icon: BarChart3, desc: 'Statistik & Audit SLA' },
  ];

  const currentRoleObj = roles.find((r) => r.id === currentRole) || roles[0];

  // Recent unresolved complaints for notification bell
  const pendingCount = complaints.filter(c => c.status === 'Menunggu Verifikasi').length;
  const inProgressCount = complaints.filter(c => c.status === 'Sedang Diproses').length;

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 shadow-level-1">
      {/* Top Institutional Branding Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Dual Identity: Pemda Lampung & Universitas Teknokrat Indonesia */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Logo Pemda Lampung Crest Representation */}
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo-pemda.png" 
                alt="Logo Kota Bandar Lampung" 
                className="w-10 h-10 object-contain drop-shadow-sm"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
                  Pemerintah Daerah
                </span>
                <span className="text-sm sm:text-base font-bold text-brand-primary leading-tight">
                  Kota Bandar Lampung
                </span>
              </div>
            </div>

            {/* Vertical Divider defined in DESIGN.md */}
            <div className="h-8 w-[1px] bg-[#CBD5E1]" aria-hidden="true" />

            {/* Logo Universitas Teknokrat Indonesia */}
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo-uti.png" 
                alt="Logo Universitas Teknokrat Indonesia" 
                className="w-10 h-10 object-contain drop-shadow-sm"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="hidden md:block">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider leading-none">
                  Kolaborasi Inovasi Smart City
                </span>
                <span className="text-sm sm:text-base font-bold text-[#990000] leading-tight">
                  Universitas Teknokrat Indonesia
                </span>
              </div>
            </div>
          </div>

          {/* Center: Integrated Search Bar for Complaint Ticket IDs */}
          <div className="flex-1 max-w-md hidden lg:block">
            <form onSubmit={handleSearchTicket} className="relative">
              <input
                type="text"
                placeholder="Lacak ID Tiket (contoh: #PKM-2024-0012)..."
                value={inputTicket}
                onChange={(e) => setInputTicket(e.target.value)}
                className="w-full pl-9 pr-24 py-2 text-sm bg-surface-low border border-[#CBD5E1] rounded-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-medium rounded-sm transition-colors"
              >
                Lacak
              </button>
            </form>
          </div>

          {/* Right Actions: Quick Role Switcher, Notification, Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Ticket Input on Small Screens */}
            <button
              onClick={() => {
                const id = prompt('Masukkan Nomor Tiket Pengaduan (contoh: PKM-2024-0012):');
                if (id) {
                  const found = findComplaintById(id);
                  if (found) {
                    setSelectedTicketId(found.id);
                    setActiveTab('track');
                    addToast(`Menampilkan rincian tiket #${found.id}`, 'info');
                  } else {
                    addToast('Tiket tidak ditemukan.', 'warning');
                  }
                }
              }}
              className="lg:hidden p-2 text-slate-600 hover:text-brand-primary hover:bg-surface-low rounded-sm"
              title="Lacak Tiket"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-600 hover:text-brand-primary hover:bg-surface-low rounded-sm relative transition-colors"
                title="Notifikasi Sistem"
              >
                <Bell className="w-5 h-5" />
                {pendingCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#CBD5E1] rounded-lg shadow-level-3 p-4 z-50 text-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-800">Status Operasional Kota</span>
                    <span className="text-[11px] bg-brand-secondary text-white px-2 py-0.5 rounded-full font-medium">Real-time</span>
                  </div>
                  <div className="py-2.5 space-y-2">
                    <div className="flex items-start gap-2.5 text-xs text-slate-600 p-2 bg-amber-50/70 border border-amber-200 rounded">
                      <span className="w-2 h-2 mt-1 rounded-full bg-amber-500 shrink-0"></span>
                      <div>
                        <strong className="text-amber-900">{pendingCount} Pengaduan Baru</strong> membutuhkan verifikasi segera dari Admin Pemda.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-slate-600 p-2 bg-teal-50/70 border border-teal-200 rounded">
                      <span className="w-2 h-2 mt-1 rounded-full bg-teal-600 shrink-0"></span>
                      <div>
                        <strong className="text-teal-900">{inProgressCount} Pekerjaan Aktif</strong> sedang ditangani tim dinas di lapangan.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="w-full text-center text-xs text-brand-primary hover:underline font-medium pt-1"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>

            {/* Role Switcher Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 bg-[#f0f4f9] hover:bg-[#e4ebf5] border border-[#CBD5E1] rounded-sm transition-all"
                title="Ganti Mode Pengguna / Peran"
              >
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center">
                  <currentRoleObj.icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-semibold leading-none">
                    Mode Pengguna
                  </span>
                  <span className="text-xs font-semibold text-brand-primary leading-tight flex items-center gap-1">
                    {currentRoleObj.label}
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </span>
                </div>
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#CBD5E1] rounded-lg shadow-level-3 py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 bg-surface-low">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Pilih Hak Akses Pengguna
                    </p>
                    <p className="text-xs text-slate-600">
                      Uji coba seluruh alur peran sesuai PRD
                    </p>
                  </div>
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isActive = currentRole === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          setCurrentRole(r.id);
                          setShowRoleMenu(false);
                          if (r.id === 'citizen') setActiveTab('home');
                          else if (r.id === 'admin') setActiveTab('admin-list');
                          else if (r.id === 'officer') setActiveTab('officer-tasks');
                          else if (r.id === 'executive') setActiveTab('executive-overview');
                          addToast(`Beralih ke mode: ${r.label}`, 'info');
                        }}
                        className={`w-full text-left px-3 py-2.5 flex items-start gap-3 hover:bg-slate-50 transition-colors ${
                          isActive ? 'bg-blue-50/60 border-l-4 border-brand-primary' : ''
                        }`}
                      >
                        <div className={`p-1.5 rounded-sm mt-0.5 ${isActive ? 'bg-brand-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${isActive ? 'text-brand-primary' : 'text-slate-800'}`}>
                            {r.label}
                          </p>
                          <p className="text-[11px] text-slate-500">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Reset Demo Data Button */}
            <button
              onClick={resetToSeed}
              className="p-2 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors border border-transparent hover:border-amber-200"
              title="Reset Data Sampel Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#1F3A5F] text-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1.5 scrollbar-none text-xs sm:text-sm font-medium">
            
            {/* Citizen Tabs */}
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'home' ? 'bg-[#162A45] text-amber-300 font-semibold shadow-inner' : 'text-slate-200 hover:bg-[#2A4B75]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Beranda & Laporan</span>
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'report' ? 'bg-brand-secondary text-white font-semibold' : 'text-slate-200 hover:bg-[#2A4B75]'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buat Pengaduan Baru</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'track' ? 'bg-[#162A45] text-amber-300 font-semibold' : 'text-slate-200 hover:bg-[#2A4B75]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Lacak Tiket Saya</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'map' ? 'bg-[#162A45] text-amber-300 font-semibold' : 'text-slate-200 hover:bg-[#2A4B75]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Peta Pengaduan Kota</span>
            </button>

            {/* Separator */}
            <div className="h-5 w-[1px] bg-slate-500 mx-1 shrink-0" />

            {/* Admin & Officers Specialized Views */}
            <button
              onClick={() => {
                setCurrentRole('admin');
                setActiveTab('admin-list');
              }}
              className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'admin-list' ? 'bg-[#162A45] text-amber-300 font-semibold' : 'text-slate-200 hover:bg-[#2A4B75]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin & Disposisi</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-500 text-slate-900 font-bold rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setCurrentRole('officer');
                setActiveTab('officer-tasks');
              }}
              className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'officer-tasks' ? 'bg-[#162A45] text-amber-300 font-semibold' : 'text-slate-200 hover:bg-[#2A4B75]'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Petugas Lapangan</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('executive');
                setActiveTab('executive-overview');
              }}
              className={`px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'executive-overview' ? 'bg-[#162A45] text-amber-300 font-semibold' : 'text-slate-200 hover:bg-[#2A4B75]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard Eksekutif</span>
            </button>

          </nav>
        </div>
      </div>
    </header>
  );
};
