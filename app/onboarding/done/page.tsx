"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useOnboardingGuard } from "@/hooks/onBoardingGuard";

function Confetti() {
  useEffect(() => {
    const confettiCount = 92;
    const container = document.createElement("div");

    container.id = "confetti-root";
    Object.assign(container.style, {
      position: "fixed",
      left: "0",
      top: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      overflow: "hidden",
      zIndex: "9999",
    });

    document.body.appendChild(container);

    const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ec4899"];
    const widths = [6, 8, 12];
    const heights = [12, 16, 20];

    for (let i = 0; i < confettiCount; i++) {
      const piece = document.createElement("div");
      piece.className = "micro-confetti-piece";
      const leftPx = Math.floor(Math.random() * window.innerWidth);
      piece.style.left = `${leftPx}px`;
      piece.style.top = `${-10 - Math.random() * 40}px`;
      const w = widths[Math.floor(Math.random() * widths.length)];
      const h = heights[Math.floor(Math.random() * heights.length)];
      piece.style.width = `${w}px`;
      piece.style.height = `${h}px`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.6 ? "2px" : "4px";
      piece.style.boxShadow = "0 2px 8px 0 rgba(60,60,80,0.04)";
      const sway = (-1 + Math.random() * 2) * 80;
      const duration = 2.8 + Math.random() * 1.1;
      const delay = Math.random() * 1.2;
      const end = Math.ceil(window.innerHeight + 120 + Math.random() * 80);
      piece.style.setProperty("--mf-sway", `${sway}px`);
      piece.style.setProperty("--mf-end", `${end}px`);
      piece.style.animation = `micro-fall ${duration}s cubic-bezier(.69,.23,.44,1.08) forwards`;
      piece.style.animationDelay = `${delay}s`;
      piece.style.opacity = "0.98";
      piece.style.position = "absolute";
      piece.style.pointerEvents = "none";
      piece.style.transform = `translateY(0) translateX(0) rotate(${Math.random() * 60 - 30}deg)`;

      const onAnimEnd = () => {
        piece.removeEventListener("animationend", onAnimEnd);
        if (piece.parentElement) piece.parentElement.removeChild(piece);
      };
      piece.addEventListener("animationend", onAnimEnd);

      container.appendChild(piece);
    }

    const maxDuration = 5.5 * 1000;
    const cleanupTimer = window.setTimeout(() => {
      if (container.parentElement) container.parentElement.removeChild(container);
    }, maxDuration);

    return () => {
      window.clearTimeout(cleanupTimer);
      if (container.parentElement) container.parentElement.removeChild(container);
    };
  }, []);

  return null;
}

export default function OnboardingDonePage() {
  useOnboardingGuard("skip");
  const [summary, setSummary] = useState({
    semester: "",
    subjectsCount: 0,
    timetableCount: 0,
  });

  useEffect(() => {
    try {
      const semester = JSON.parse(localStorage.getItem("semester") || "{}");
      const subjects = JSON.parse(localStorage.getItem("subjects") || "[]");
      const timetable = JSON.parse(localStorage.getItem("timetable") || "[]");

      setSummary({
        semester: semester.semesterName || "Semester ready",
        subjectsCount: Array.isArray(subjects) ? subjects.length : 0,
        timetableCount: Array.isArray(timetable) ? timetable.length : 0,
      });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("onboarding_completed", "true");
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f6f8] font-display text-[#0e121b] flex flex-col">
      <Confetti />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#e7ebf3] overflow-hidden">
          <div className="p-8 sm:p-12 flex flex-col items-center">
            <div className="text-center mb-8 mt-6">
              <h1 className="text-3xl font-bold mb-3">
                You’re all set 🎉
              </h1>
              <p className="text-[#4e6797] text-base max-w-sm mx-auto">
                Your setup is complete. Everything’s organized and ready to go.
              </p>
            </div>
            <div className="w-full bg-[#f8f9fc] rounded-xl p-6 mb-10 border border-[#e7ebf3]">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-4">
                Setup summary
              </h3>
              <ul className="space-y-4">
                <Highlight
                  icon="calendar_today"
                  title="Semester configured"
                  subtitle={summary.semester}
                  color="emerald"
                />
                <Highlight
                  icon="category"
                  title="Subjects added"
                  subtitle={`${summary.subjectsCount} subjects in your plan`}
                  color="amber"
                />
                <Highlight
                  icon="auto_schedule"
                  title="Weekly timetable"
                  subtitle={`${summary.timetableCount} fixed classes scheduled`}
                  color="blue"
                />
              </ul>
            </div>
            <div className="w-full space-y-4">
              <Link
                href="/dashboard"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 transition flex items-center justify-center gap-2 group"
              >
                Go to Dashboard
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/schedule"
                className="w-full h-12 border border-[#e7ebf3] text-[#4e6797] font-medium rounded-xl hover:bg-[#f8f9fc] transition flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">
                  calendar_month
                </span>
                View my schedule
              </Link>
            </div>
            <Link
              href="/settings"
              className="mt-8 text-xs text-[#94a3b8] hover:text-primary transition"
            >
              Need to change something?
              <span className="underline underline-offset-4 ml-1">
                Review settings
              </span>
            </Link>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-xs text-[#94a3b8]/60">
        © 2024 Harmony Planner. All rights reserved.
      </footer>
      <style jsx>{`
        .micro-confetti-piece {
          opacity: 0.96;
          will-change: transform, opacity;
        }

        @keyframes micro-fall {
          0% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          60% {
            opacity: 0.98;
          }
          100% {
            opacity: 0;
            transform: translateY(var(--mf-end, 100vh)) translateX(var(--mf-sway, 0px)) rotate(420deg);
          }
        }
      `}</style>
    </div>
  );
}

function Highlight({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: "emerald" | "amber" | "blue";
}) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <li className="flex items-center gap-4">
      <div className={`size-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
        <span className="material-symbols-outlined text-[18px]">
          {icon}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-[#4e6797]">{subtitle}</span>
      </div>
    </li>
  );
}
