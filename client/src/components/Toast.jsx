import React, { useEffect } from "react";

const baseClasses =
  "pointer-events-auto flex items-center gap-10 rounded-12 border px-16 py-12 text-[12px] font-bold shadow-lg";

const variants = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
  error: "bg-rose-50 text-rose-700 border-rose-100",
  info: "bg-slate-50 text-slate-700 border-slate-200",
};

const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => onDismiss(toast.id), 2800);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 right-24 z-[80] flex flex-col gap-8">
      <div className={`${baseClasses} ${variants[toast.type] || variants.info}`}>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
