import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { _registerToast } from '../utils/toast';

/* ── Per-toast config ───────────────────────────── */
const CONFIG = {
  success: { icon: CheckCircle,    iconColor: '#34d399', bar: '#34d399', border: 'rgba(52,211,153,0.2)'  },
  error:   { icon: XCircle,        iconColor: '#f87171', bar: '#f87171', border: 'rgba(248,113,113,0.2)' },
  warning: { icon: AlertTriangle,  iconColor: '#fbbf24', bar: '#fbbf24', border: 'rgba(251,191,36,0.2)'  },
  info:    { icon: Info,           iconColor: '#38bdf8', bar: '#38bdf8', border: 'rgba(56,189,248,0.2)'  },
};

/* ── Single toast item ──────────────────────────── */
function ToastItem({ toast, onRemove }) {
  const [alive, setAlive] = useState(false);
  const cfg = CONFIG[toast.type] ?? CONFIG.info;
  const Icon = cfg.icon;

  const dismiss = useCallback(() => {
    setAlive(false);
    setTimeout(() => onRemove(toast.id), 280);
  }, [toast.id, onRemove]);

  useEffect(() => {
    const enter  = requestAnimationFrame(() => setAlive(true));
    const timer  = setTimeout(dismiss, toast.duration ?? 4000);
    return () => { cancelAnimationFrame(enter); clearTimeout(timer); };
  }, [dismiss, toast.duration]);

  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: '12px',
        position: 'relative', overflow: 'hidden',
        backgroundColor: '#111111',
        border: `1px solid ${cfg.border}`,
        borderRadius: '10px',
        padding: '14px 16px 14px 20px',
        minWidth: '300px', maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        fontFamily: 'system-ui, sans-serif',
        /* animate in/out */
        opacity:   alive ? 1 : 0,
        transform: alive ? 'translateX(0) scale(1)' : 'translateX(24px) scale(0.97)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}
    >
      {/* left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', backgroundColor: cfg.bar, borderRadius: '10px 0 0 10px' }} />

      {/* icon */}
      <div style={{ color: cfg.iconColor, flexShrink: 0, marginTop: '1px' }}>
        <Icon size={17} />
      </div>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <p style={{ color: '#f3f4f6', fontSize: '13px', fontWeight: 600, margin: '0 0 3px', lineHeight: 1.3 }}>
            {toast.title}
          </p>
        )}
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0, lineHeight: 1.5 }}>
          {toast.message}
        </p>
      </div>

      {/* close */}
      <button
        onClick={dismiss}
        style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', padding: '2px', flexShrink: 0, marginTop: '-1px', lineHeight: 0 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Container — mount once in AdminLayout ──────── */
export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast  = useCallback((t) => setToasts(prev => [...prev, t]), []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  /* register the adder so the utility can call it */
  useEffect(() => { _registerToast(addToast); }, [addToast]);

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column-reverse', gap: '10px',
      zIndex: 99999, pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}
