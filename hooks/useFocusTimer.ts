"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function useFocusTimer(initialMinutes: number, onComplete: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Notification & Audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/success.mp3"); // Path to your sound
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleTimer = useCallback(() => setIsActive((prev) => !prev), []);

  // Countdown Logic w/ Sound and Notification
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);

      // 1. Play Sound
      audioRef.current?.play().catch(() => {});

      // 2. Send Notification
      if (Notification.permission === "granted") {
        new Notification("Session Complete!", {
          body: "Great job! Time for a short break.",
          icon: "/icons/logo.png"
        });
      }

      onComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);

  // Keyboard Shortcuts (Space to Toggle, Esc to Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleTimer();
      }
      if (e.code === "Escape") {
        setIsActive(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTimer]);

  // Document Title Update (Show timer in tab)
  useEffect(() => {
    document.title = isActive ? `${formatTime(timeLeft)} - Focusing` : "Harmony Planner";
  }, [timeLeft, isActive]);

  return { timeLeft, isActive, toggleTimer, formatTime };
}