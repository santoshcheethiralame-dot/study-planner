"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useFocusTimer(initialMinutes: number, onComplete: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/success.mp3");
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft !== 0 || completedRef.current) return;

    completedRef.current = true;
    setIsActive(false);

    audioRef.current?.play().catch(() => {});

    if (Notification.permission === "granted") {
      new Notification("Session Complete!", {
        body: "Great job! Time for a short break.",
        icon: "/icons/logo.png",
      });
    }

    onComplete();
  }, [timeLeft, onComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsActive((a) => !a);
      }
      if (e.code === "Escape") {
        pauseTimer();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pauseTimer]);

  useEffect(() => {
    document.title = isActive
      ? `${formatTime(timeLeft)} - Focusing`
      : "Harmony Planner";
  }, [timeLeft, isActive]);

  return {
    timeLeft,
    isActive,
    startTimer,
    pauseTimer,
    formatTime,
  };
}