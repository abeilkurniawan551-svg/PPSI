import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useComplaints();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let border = 'border-blue-500';
        let bg = 'bg-white';
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;

        if (toast.type === 'success') {
          border = 'border-emerald-500';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
        } else if (toast.type === 'warning' || toast.type === 'error') {
          border = 'border-rose-500';
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 bg-white border-l-4 ${border} border-y border-r border-[#E2E8F0] rounded-sm shadow-level-3 transition-all animate-in slide-in-from-right-5`}
          >
            {icon}
            <div className="flex-1 text-xs">
              {toast.title && <p className="font-semibold text-slate-800 mb-0.5">{toast.title}</p>}
              <p className="text-slate-600 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
