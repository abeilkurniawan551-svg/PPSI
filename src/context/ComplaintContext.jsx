import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_COMPLAINTS, CATEGORIES, OPDS, OFFICERS, SUBDISTRICTS } from '../data/initialData';
import { sanitizeText, sanitizeImageSrc } from '../utils/security';

const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
  // Load initial complaints from localStorage or fallback to INITIAL_COMPLAINTS
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem('smart_city_complaints');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading complaints from localStorage', e);
    }
    return INITIAL_COMPLAINTS;
  });

  // Active Role: 'citizen' (Masyarakat), 'admin' (Admin Pemda), 'officer' (Petugas Lapangan), 'executive' (Pimpinan/Dinas)
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('smart_city_role') || 'citizen';
  });

  // Current active officer when role is 'officer'
  const [currentOfficer, setCurrentOfficer] = useState(OFFICERS[0]); // Budi Santoso

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('home');

  // Search Ticket or keyword
  const [searchQuery, setSearchQuery] = useState('');

  // Selected complaint for modal or detail view
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Save complaints to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smart_city_complaints', JSON.stringify(complaints));
    } catch (e) {
      console.error('Error saving complaints', e);
    }
  }, [complaints]);

  // Save active role
  useEffect(() => {
    localStorage.setItem('smart_city_role', currentRole);
  }, [currentRole]);

  // Show toast notification
  const addToast = (message, type = 'info', title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Create new complaint with security sanitization (CWE-79, CWE-359)
  const createComplaint = (data) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `PKM-2024-${randomNum}`;
    const now = new Date().toISOString();

    const isAnon = !!data.isAnonymous;
    const sanitizedTitle = sanitizeText(data.title, 150);
    const sanitizedDesc = sanitizeText(data.description, 1500);
    const sanitizedLoc = sanitizeText(data.location, 250);
    const sanitizedReporterName = isAnon ? 'Warga (Anonim)' : sanitizeText(data.reporterName || 'Warga', 100);
    const sanitizedReporterPhone = isAnon ? '' : sanitizeText(data.reporterPhone || '', 20);
    const safePhoto = sanitizeImageSrc(data.photo) || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';

    const newComplaint = {
      id: newId,
      title: sanitizedTitle,
      category: data.category,
      categoryId: data.categoryId,
      description: sanitizedDesc,
      location: sanitizedLoc,
      subdistrict: data.subdistrict || 'Kedaton',
      coordinates: data.coordinates || { lat: -5.38178, lng: 105.25832 },
      photo: safePhoto,
      status: 'Menunggu Verifikasi',
      priority: data.priority || 'Sedang',
      reporterName: sanitizedReporterName,
      reporterPhone: sanitizedReporterPhone,
      isAnonymous: isAnon,
      assignedOpd: null,
      assignedOfficer: null,
      officerId: null,
      createdAt: now,
      slaHours: 24,
      timeline: [
        {
          status: 'Menunggu Verifikasi',
          timestamp: now,
          actor: 'Sistem Publik',
          notes: `Laporan berhasil diajukan dengan nomor tiket #${newId}. Menunggu verifikasi admin Pemda.`
        }
      ],
      completionPhoto: null,
      completionNotes: null,
      feedback: null
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    addToast(
      `Pengaduan berhasil dikirim! Simpan Nomor Tiket: #${newId}`,
      'success',
      'Laporan Diterima'
    );
    return newComplaint;
  };

  // Verify and Disposition by Admin
  const verifyComplaint = (id, { approved, priority, assignedOpd, officerId, rejectionReason }) => {
    const now = new Date().toISOString();
    const officerObj = OFFICERS.find((o) => o.id === officerId);

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        if (!approved) {
          return {
            ...c,
            status: 'Ditolak',
            timeline: [
              ...c.timeline,
              {
                status: 'Ditolak',
                timestamp: now,
                actor: 'Admin Verifikator Pemda',
                notes: rejectionReason || 'Laporan tidak memenuhi kriteria verifikasi lapangan.'
              }
            ]
          };
        }

        // Approved & Dispatched
        return {
          ...c,
          status: 'Sedang Diproses',
          priority: priority || c.priority,
          assignedOpd: assignedOpd || c.assignedOpd,
          assignedOfficer: officerObj ? officerObj.name : 'Unit Reaksi Cepat',
          officerId: officerId || null,
          timeline: [
            ...c.timeline,
            {
              status: 'Diverifikasi & Disposisi',
              timestamp: now,
              actor: 'Admin Pemda Lampung',
              notes: `Laporan diverifikasi valid. Prioritas: ${priority || c.priority}. Didisposisikan ke ${assignedOpd} - Petugas: ${officerObj ? officerObj.name : 'Tim Terkait'}.`
            }
          ]
        };
      })
    );

    if (approved) {
      addToast(`Laporan #${id} berhasil diverifikasi dan didisposisikan.`, 'success', 'Disposisi Berhasil');
    } else {
      addToast(`Laporan #${id} telah ditolak dengan catatan resmi.`, 'warning', 'Laporan Ditolak');
    }
  };

  // Officer Update Status (In progress, Resolving, Completed)
  const updateOfficerStatus = (id, { status, completionPhoto, completionNotes, actionNotes }) => {
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        const updatedTimeline = [
          ...c.timeline,
          {
            status: status === 'Selesai' ? 'Selesai' : 'Sedang Diproses',
            timestamp: now,
            actor: `${currentOfficer.name} (${currentOfficer.role})`,
            notes: actionNotes || (status === 'Selesai' ? completionNotes : 'Pembaruan progres di lapangan.')
          }
        ];

        return {
          ...c,
          status: status,
          completionPhoto: completionPhoto || c.completionPhoto,
          completionNotes: completionNotes || c.completionNotes,
          timeline: updatedTimeline
        };
      })
    );

    if (status === 'Selesai') {
      addToast(`Laporan #${id} berhasil diselesaikan dengan bukti penanganan!`, 'success', 'Tugas Selesai');
    } else {
      addToast(`Progres penanganan #${id} telah diperbarui.`, 'info', 'Status Diperbarui');
    }
  };

  // Submit Feedback & Rating
  const submitFeedback = (id, { rating, comment }) => {
    const now = new Date().toISOString();

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          feedback: {
            rating,
            comment,
            createdAt: now
          }
        };
      })
    );
    addToast('Terima kasih atas penilaian dan masukan Anda!', 'success', 'Rating Terkirim');
  };

  // Reset demo data
  const resetToSeed = () => {
    setComplaints(INITIAL_COMPLAINTS);
    localStorage.removeItem('smart_city_complaints');
    addToast('Data sistem telah direset ke data sampel awal Lampung Smart City.', 'info', 'Reset Berhasil');
  };

  // Look up complaint by ID or partial match
  const findComplaintById = (id) => {
    if (!id) return null;
    const clean = id.trim().toUpperCase().replace('#', '');
    // 1. Exact match
    const exact = complaints.find((c) => c.id.toUpperCase() === clean);
    if (exact) return exact;

    // 2. Contains match (e.g. typing '0012' matches 'PKM-2024-0012')
    const partial = complaints.find((c) => c.id.toUpperCase().includes(clean));
    if (partial) return partial;

    // 3. Fallback: match by title keyword
    const byTitle = complaints.find((c) => c.title.toLowerCase().includes(id.trim().toLowerCase()));
    return byTitle || null;
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        categories: CATEGORIES,
        opds: OPDS,
        officers: OFFICERS,
        subdistricts: SUBDISTRICTS,
        currentRole,
        setCurrentRole,
        currentOfficer,
        setCurrentOfficer,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedTicketId,
        setSelectedTicketId,
        toasts,
        addToast,
        removeToast,
        createComplaint,
        verifyComplaint,
        updateOfficerStatus,
        submitFeedback,
        resetToSeed,
        findComplaintById
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within ComplaintProvider');
  }
  return context;
};
