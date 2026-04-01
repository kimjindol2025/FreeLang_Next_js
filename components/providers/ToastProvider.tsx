"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ToastContainer } from "@/components/ui/Toast";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration: number;
}

interface ToastContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (
    message: string,
    type: "success" | "error" | "info" | "warning" = "info",
    duration = 5000
  ) => {
    const id = Date.now().toString() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const value: ToastContextType = {
    success: (message, duration) => addToast(message, "success", duration),
    error: (message, duration) => addToast(message, "error", duration),
    info: (message, duration) => addToast(message, "info", duration),
    warning: (message, duration) => addToast(message, "warning", duration),
  };

  const toastPropsArray = toasts.map((t) => ({
    ...t,
    onClose: removeToast,
  }));

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toastPropsArray} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
