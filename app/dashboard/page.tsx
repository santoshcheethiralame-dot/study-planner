// app/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Helper: check if user already supplied today's "day-context".
 * Tries two keys we might store under: "day_context" or "dayContext".
 * Accepts:
 *  - boolean true
 *  - object with a .date field matching YYYY-MM-DD
 *  - non-empty object (fallback)
 */
function hasTodayContext(): boolean {
  try {
    const todayIso = new Date().toISOString().slice(0, 10);

    const rawA = localStorage.getItem("day_context");
    const rawB = localStorage.getItem("dayContext");

    const raw = rawA ?? rawB;
    if (!raw) return false;

    // if value is literal "true"
    if (raw === "true") return true;

    // try parse JSON
    const parsed = JSON.parse(raw);
    if (!parsed) return false;

    // if parsed is boolean
    if (typeof parsed === "boolean") return parsed;

    // if parsed has date matching today
    if (typeof parsed === "object" && parsed !== null) {
      if ("date" in parsed && String(parsed.date) === todayIso) return true;
      // fallback: non-empty object -> treat as context present
      return Object.keys(parsed).length > 0;
    }

    return false;
  } catch (e) {
    // parsing error => assume no context
    return false;
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Synchronous-ish check from localStorage to avoid render-before-redirect flash
    // (localStorage is sync, so this runs fast)
    const has = hasTodayContext();

    if (!has) {
      // replace so user doesn't briefly land on dashboard then get redirected
      router.replace("/onboarding/day-context");
      return;
    }

    // mark checked to render dashboard
    setChecked(true);
  }, [router]);

  // While checking (or redirecting) show nothing (or a spinner)
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f6f8]">
        <div role="status" aria-label="Loading" className="flex items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" className="opacity-25 stroke-current" stroke="currentColor" strokeWidth="4"></circle>
            <path d="M4 12a8 8 0 018-8" className="opacity-75 stroke-current" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
          </svg>
          <span className="text-sm text-[#4e6797]">Preparing your dashboard…</span>
        </div>
      </div>
    );
  }

  // Real dashboard UI (minimal placeholder — you can expand)
  return (
    <main className="px-6 md:px-12 py-10 bg-[#f6f6f8] min-h-screen">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-[#4e6797]">Welcome back — here's your day.</p>

      {/* Example blocks — replace with your real dashboard components */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow border border-[#e7ebf3]">
          <h2 className="font-semibold text-lg">Today's Focus</h2>
          <p className="text-sm text-[#6b7280] mt-2">Start your next study block or view today's schedule.</p>
          {/* TODO: add actionable blocks here */}
        </div>

        <aside className="bg-white rounded-2xl p-6 shadow border border-[#e7ebf3]">
          <h3 className="font-semibold text-sm">Quick stats</h3>
          <div className="mt-4 text-sm text-[#4e6797]">2h studied · 3/5 blocks done · 7 day streak</div>
        </aside>
      </section>
    </main>
  );
}
