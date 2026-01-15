"use client";

import { useState, useEffect, useMemo } from "react";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import { DayColumn } from "./components/DayColumn";

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false);
  const { weekPlan, loading } = useWeekPlan();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate stats from real data
  const stats = useMemo(() => {
    if (!weekPlan || weekPlan.length === 0) {
      return {
        totalBlocks: 0,
        completedBlocks: 0,
        totalHours: 0,
        hasRealData: false,
      };
    }

    const totalBlocks = weekPlan.reduce((sum, day) => sum + day.blocks.length, 0);
    const completedBlocks = weekPlan.reduce(
      (sum, day) => sum + day.blocks.filter((b) => b.status === "done").length,
      0
    );
    const totalMinutes = weekPlan.reduce(
      (sum, day) =>
        sum +
        day.blocks
          .filter((b) => b.status === "done")
          .reduce((acc, b) => acc + b.durationMin, 0),
      0
    );
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    return {
      totalBlocks: totalBlocks || 42, // Mock if zero
      completedBlocks: completedBlocks || 28, // Mock if zero
      totalHours: totalHours || 12.5, // Mock if zero
      hasRealData: totalBlocks > 0,
    };
  }, [weekPlan]);

  // Get week date range
  const weekRange = useMemo(() => {
    if (!weekPlan || weekPlan.length === 0) return "Loading...";
    const firstDay = new Date(weekPlan[0].date + "T00:00:00");
    const lastDay = new Date(weekPlan[weekPlan.length - 1].date + "T00:00:00");
    
    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    
    return `${formatDate(firstDay)} - ${formatDate(lastDay)}, ${firstDay.getFullYear()}`;
  }, [weekPlan]);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your week...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 h-full overflow-hidden flex flex-col bg-[#f8f9fa] relative">
      {/* Top Gradient Decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent pointer-events-none z-0"></div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden z-10 px-8 py-8">
        <div className="max-w-[1800px] mx-auto flex flex-col gap-8">
          {/* Header & Stats Row */}
          <div className="flex flex-wrap items-end justify-between gap-8">
            {/* Heading */}
            <div className="flex flex-col gap-1 min-w-[300px]">
              <h2 className="text-[#111118] text-4xl font-black leading-tight tracking-[-0.033em]">
                Weekly Overview
              </h2>
              <div className="flex items-center gap-2 text-[#616189]">
                <span className="text-lg">📅</span>
                <p className="text-base font-medium">{weekRange}</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="flex flex-wrap gap-4 flex-1 justify-end">
              {!stats.hasRealData && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700">
                  <span>⚠️</span>
                  <span>Mock stats data</span>
                </div>
              )}
              
              <div className="flex min-w-[180px] items-center gap-4 rounded-3xl bg-white p-5 shadow-sm border border-white/60">
                <div className="bg-blue-50 text-primary rounded-2xl p-3 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#616189] text-sm font-medium">Total Blocks</p>
                  <p className="text-[#111118] text-2xl font-black leading-none">
                    {stats.totalBlocks}
                  </p>
                </div>
              </div>

              <div className="flex min-w-[180px] items-center gap-4 rounded-3xl bg-white p-5 shadow-sm border border-white/60">
                <div className="bg-green-50 text-emerald-600 rounded-2xl p-3 flex items-center justify-center">
                  <span className="text-2xl">✓</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#616189] text-sm font-medium">Completed</p>
                  <p className="text-[#111118] text-2xl font-black leading-none">
                    {stats.completedBlocks}
                  </p>
                </div>
              </div>

              <div className="flex min-w-[180px] items-center gap-4 rounded-3xl bg-white p-5 shadow-sm border border-white/60">
                <div className="bg-purple-50 text-purple-600 rounded-2xl p-3 flex items-center justify-center">
                  <span className="text-2xl">⏱</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#616189] text-sm font-medium">Study Hours</p>
                  <p className="text-[#111118] text-2xl font-black leading-none">
                    {stats.totalHours}h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Grid Container */}
          <div className="w-full overflow-x-auto pb-6">
            <div className="grid grid-cols-7 gap-4 min-w-[1600px]">
              {weekPlan.map((day) => (
                <DayColumn
                  key={day.date}
                  day={day}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}