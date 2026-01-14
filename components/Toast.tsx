"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      bg: "bg-green-500",
      icon: "✓",
      border: "border-green-600",
    },
    error: {
      bg: "bg-red-500",
      icon: "✗",
      border: "border-red-600",
    },
    info: {
      bg: "bg-blue-500",
      icon: "ℹ",
      border: "border-blue-600",
    },
    warning: {
      bg: "bg-amber-500",
      icon: "⚠",
      border: "border-amber-600",
    },
  }[type];

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ${
        isExiting
          ? "translate-y-2 opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      <div
        className={`${config.bg} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] border-2 ${config.border}`}
      >
        <span className="text-2xl font-bold">{config.icon}</span>
        <p className="font-semibold flex-1">{message}</p>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className="text-white/80 hover:text-white transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}