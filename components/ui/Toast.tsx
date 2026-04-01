"use client";

import React, { useEffect, useState } from "react";

export interface ToastProps {
  id: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = "info",
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const typeStyles = {
    success: "bg-state-success text-white",
    error: "bg-state-error text-white",
    info: "bg-state-info text-white",
    warning: "bg-state-warning text-dark-primary",
  };

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
    warning: "⚠",
  };

  return (
    <div
      className={`${typeStyles[type]} px-4 py-3 rounded-lg flex items-center gap-3 shadow-lg transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="text-xl font-bold">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        className="text-lg opacity-70 hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
};

export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-3 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};

// Toast 관리자 훅
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const add = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    duration = 5000
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [
      ...prev,
      { id, message, type, duration, onClose: () => {} },
    ]);
    return id;
  };

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (message: string, duration = 5000) => add(message, "success", duration);
  const error = (message: string, duration = 5000) => add(message, "error", duration);
  const info = (message: string, duration = 5000) => add(message, "info", duration);
  const warning = (message: string, duration = 5000) =>
    add(message, "warning", duration);

  return { toasts: toasts.map((t) => ({ ...t, onClose: remove })), add, remove, success, error, info, warning };
}

export default Toast;
