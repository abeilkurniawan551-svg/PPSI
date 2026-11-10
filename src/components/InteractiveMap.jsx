import React, { useEffect, useRef, useState } from 'react';
import { useComplaints } from '../context/ComplaintContext';
import L from 'leaflet';
import { MapPin, Filter, Layers, Navigation, Eye } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { escapeHTML, sanitizeImageSrc } from '../utils/security';

export const InteractiveMap = () => {
  const { complaints, categories, setSelectedTicketId, setActiveTab } = useComplaints();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    if (categoryFilter !== 'ALL' && c.categoryId !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map instance
    const map = L.map(mapContainerRef.current, {
      center: [-5.39714, 105.26679],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Pemda Lampung & UTI',
      maxZoom: 19,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    // Invalidate map size after DOM mount to ensure full tile rendering
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      // Proper cleanup on tab change or component unmount to prevent container already initialized error
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Update Markers when filter or complaints change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    filteredComplaints.forEach((c) => {
      if (!c.coordinates || !c.coordinates.lat || !c.coordinates.lng) return;

      // Color based on status
      let pinColor = '#F59E0B'; // Amber for waiting
      if (c.status === 'Sedang Diproses') pinColor = '#1B7F79';
      else if (c.status === 'Selesai') pinColor = '#10B981';
      else if (c.status === 'Ditolak') pinColor = '#EF4444';

      // Custom SVG marker icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background-color: ${pinColor}; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
            <div style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%; transform: rotate(45deg);"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([c.coordinates.lat, c.coordinates.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-1 text-xs font-sans text-slate-800';
      popupContent.innerHTML = `
        <div style="width: 220px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-family: monospace; font-weight: bold; color: #1F3A5F;">#${escapeHTML(c.id)}</span>
            <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 9999px; background: #f1f5f9;">${escapeHTML(c.status)}</span>
          </div>
          <h4 style="font-weight: bold; font-size: 12px; margin: 0 0 4px 0; line-height: 1.3;">${escapeHTML(c.title)}</h4>
          <p style="font-size: 11px; color: #64748B; margin: 0 0 6px 0;">📍 ${escapeHTML(c.location)}</p>
          <img src="${sanitizeImageSrc(c.photo)}" alt="" style="width: 100%; height: 90px; object-fit: cover; border-radius: 4px; margin-bottom: 6px;" />
          <button type="button" style="width: 100%; background: #1F3A5F; color: #ffffff; border: none; border-radius: 3px; padding: 5px 8px; font-size: 11px; font-weight: 600; cursor: pointer;">
            Buka Rincian Tiket & Timeline
          </button>
        </div>
      `;

      // Safely bind direct button click listener
      const trackBtn = popupContent.querySelector('button');
      if (trackBtn) {
        trackBtn.onclick = (e) => {
          e.preventDefault();
          setSelectedTicketId(c.id);
          setActiveTab('track');
        };
      }

      marker.bindPopup(popupContent);
      layer.addLayer(marker);
    });
  }, [filteredComplaints, setSelectedTicketId, setActiveTab]);

  return (
    <div className="max-w-[1440px] mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-4">
      
      {/* Header & Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-level-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Sistem Informasi Geografis (SIG) Pengaduan Smart City</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-primary">
            Peta Sebaran Titik Permasalahan Kota
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Menampilkan titik koordinat riil pengaduan jalan rusak, sampah, dan PJU di Kota Bandar Lampung.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-surface-low border border-[#CBD5E1] rounded-sm text-slate-800"
          >
            <option value="ALL">Semua Status ({complaints.length})</option>
            <option value="Menunggu Verifikasi">🟡 Menunggu Validasi</option>
            <option value="Sedang Diproses">🟢 Sedang Diproses</option>
            <option value="Selesai">✅ Selesai</option>
            <option value="Ditolak">🔴 Ditolak</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-surface-low border border-[#CBD5E1] rounded-sm text-slate-800"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-level-1 overflow-hidden relative">
        {/* Map Legend Overlay */}
        <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm border border-slate-200 rounded p-3 shadow-level-2 text-xs space-y-1.5">
          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider mb-1">
            Legenda Status
          </span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]"></span>
            <span className="text-slate-700">Menunggu Validasi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1B7F79]"></span>
            <span className="text-slate-700">Sedang Ditangani Lapangan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10B981]"></span>
            <span className="text-slate-700">Selesai Dikerjakan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>
            <span className="text-slate-700">Ditolak / Tidak Valid</span>
          </div>
        </div>

        {/* Leaflet Map Div */}
        <div
          ref={mapContainerRef}
          className="w-full h-[600px] z-10"
        />
      </div>

    </div>
  );
};
