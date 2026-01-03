import React, { useEffect, useRef } from 'react';
import './Toast.scss';

const Toast = ({ toast, onClose, duration = 4000 }) => {
  // toast: { type: 'success'|'error'|'info', text }
  const ref = useRef(null);

  useEffect(() => {
    if (!toast) return;

    // focus for accessibility so screen readers announce it
    try {
      ref.current && ref.current.focus();
    } catch (e) {}

    // Only auto-hide if a positive duration is provided.
    if (duration && duration > 0) {
      const t = setTimeout(() => onClose && onClose(), duration);
      return () => clearTimeout(t);
    }
    // if duration is 0 or null, remain visible until user closes
    return undefined;
  }, [toast, duration, onClose]);

  if (!toast) return null;

  return (
    <div
      className={`app-toast ${toast.type || 'info'}`}
      role="status"
      aria-live="polite"
      tabIndex={-1}
      ref={ref}
    >
      <div className="toast-content">
        <div className="toast-text">{toast.text}</div>
        <button className="toast-close" onClick={onClose} aria-label="Close">×</button>
      </div>
    </div>
  );
};

export default Toast;
