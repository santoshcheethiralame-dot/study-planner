"use client";

import { useEffect, useRef } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
    onClose?: () => void;
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => {
            onClose?.();
        }, duration);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [duration, onClose]);

    const bgColor = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500",
    }[type];

    const icon = {
        success: "✓",
        error: "✗",
        info: "ℹ",
    }[type];

    return (
        <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
            <div className={`${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px]`}>
                <span className="text-2xl">{icon}</span>
                <p className="font-semibold">{message}</p>
            </div>
        </div>
    );
}