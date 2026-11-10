import React from 'react';
import { Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  let config = {
    label: status || 'Menunggu Verifikasi',
    border: 'border-[#F59E0B]',
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#B45309]',
    icon: Clock
  };

  switch (status) {
    case 'Menunggu Verifikasi':
    case 'Menunggu Validasi':
      config = {
        label: 'Menunggu Validasi',
        border: 'border-[#F59E0B]',
        bg: 'bg-[#FEF3C7]',
        text: 'text-[#B45309]',
        icon: Clock
      };
      break;
    case 'Sedang Diproses':
    case 'Diproses':
      config = {
        label: 'Sedang Diproses',
        border: 'border-[#1B7F79]',
        bg: 'bg-[#CCFBF1]',
        text: 'text-[#115E59]',
        icon: AlertTriangle
      };
      break;
    case 'Selesai':
      config = {
        label: 'Selesai',
        border: 'border-[#10B981]',
        bg: 'bg-[#D1FAE5]',
        text: 'text-[#047857]',
        icon: CheckCircle2
      };
      break;
    case 'Ditolak':
    case 'Tidak Valid':
      config = {
        label: 'Ditolak / Tidak Valid',
        border: 'border-[#EF4444]',
        bg: 'bg-[#FEE2E2]',
        text: 'text-[#B91C1C]',
        icon: XCircle
      };
      break;
    default:
      break;
  }

  const Icon = config.icon;
  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${config.border} ${config.bg} ${config.text} ${paddingClass} leading-none whitespace-nowrap`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  let color = 'bg-slate-100 text-slate-700 border-slate-300';
  if (priority === 'Tinggi') {
    color = 'bg-red-50 text-red-700 border-red-300';
  } else if (priority === 'Sedang') {
    color = 'bg-amber-50 text-amber-700 border-amber-300';
  } else if (priority === 'Rendah') {
    color = 'bg-blue-50 text-blue-700 border-blue-300';
  }

  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${color}`}>
      Prioritas: {priority || 'Sedang'}
    </span>
  );
};
