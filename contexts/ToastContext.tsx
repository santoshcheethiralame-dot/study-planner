"use client";

import { createContext, useContext, ReactNode } from "react";
import { useToast as useToastHook } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ToastContainer";
import type { ToastType } from "@/components/Toast";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, showToast, removeToast } = useToastHook();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] space-y-3">
        {toasts.map((toast) => (
          <div key={toast.id}>
            <div
              className={`${
                toast.type === "success"
                  ? "bg-green-500 border-green-600"
                  : toast.type === "error"
                  ? "bg-red-500 border-red-600"
                  : toast.type === "warning"
                  ? "bg-amber-500 border-amber-600"
                  : "bg-blue-500 border-blue-600"
              } text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] border-2 animate-slide-up`}
            >
              <span className="text-2xl font-bold">
                {toast.type === "success"
                  ? "✓"
                  : toast.type === "error"
                  ? "✗"
                  : toast.type === "warning"
                  ? "⚠"
                  : "ℹ"}
              </span>
              <p className="font-semibold flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/80 hover:text-white transition"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}