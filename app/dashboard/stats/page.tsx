"use client";

import { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { StudyBlock } from "@/lib/types";
import { useStats } from "@/hooks/useStats";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

export default function StatsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");
  const [mounted, setMounted] = useState(false);
  const { completionRate, totalMinutes, blocksDone, totalPlanned } = useStats();

  useEffect(() => {
    setMounted(true);
  }, []);

  const detailedStats = useMemo(() => {
    // Check if we're in the browser
    if (typeof window === "undefined" || !mounted) {
      return {
        subjectChartData: [],
        dailyChartData: [],
      };
    }

    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("harmony_today_plan")
    );

    const subjectData: Record<string, { minutes: number; blocks: number; color: string }> = {};
    const dailyData: Record<string, number> = {};

    allKeys.forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key)!);
        if (!data?.blocks) return;

        const blocks: StudyBlock[] = data.blocks;
        const date = data.date;

        // Daily completion
        dailyData[date] = blocks.filter((b) => b.status === "done").length;

        // Subject breakdown
        blocks.forEach((block) => {
          if (block.status === "done") {
            if (!subjectData[block.subjectCode]) {
              subjectData[block.subjectCode] = {
                minutes: 0,
                blocks: 0,
                color: COLORS[Object.keys(subjectData).length % COLORS.length],
              };
            }
            subjectData[block.subjectCode].minutes += block.durationMin;
            subjectData[block.subjectCode].blocks += 1;
          }
        });
      } catch (e) {
        // Skip invalid data
      }
    });

    // Convert to chart format
    const subjectChartData = Object.entries(subjectData).map(([code, data]) => ({
      subject: code,
      hours: Math.round((data.minutes / 60) * 10) / 10,
      blocks: data.blocks,
      color: data.color,
    }));

    const dailyChartData = Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7) // Last 7 days
      .map(([date, blocks]) => ({
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        blocks,
      }));

    return { subjectChartData, dailyChartData };
  }, [period, mounted]);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Show loading state while mounting
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="px-6 md:px-12 py-10 bg-[#f6f6f8] min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Study Analytics</h1>
        <p className="text-neutral-600">
          Track your progress and identify patterns
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="text-sm text-neutral-500 mb-2">Completion Rate</div>
          <div className="text-4xl font-bold text-blue-600">
            {completionRate}%
          </div>
          <div className="w-full bg-neutral-100 h-2 rounded-full mt-3">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="text-sm text-neutral-500 mb-2">Total Study Time</div>
          <div className="text-4xl font-bold text-purple-600">
            {totalHours}h {remainingMinutes}m
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Across all subjects
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="text-sm text-neutral-500 mb-2">Blocks Completed</div>
          <div className="text-4xl font-bold text-green-600">
            {blocksDone}
          </div>
          <div className="text-xs text-neutral-400 mt-2">
            Out of {totalPlanned} planned
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <div className="text-sm text-neutral-500 mb-2">Average Session</div>
          <div className="text-4xl font-bold text-amber-600">
            {blocksDone > 0 ? Math.round(totalMinutes / blocksDone) : 0}m
          </div>
          <div className="text-xs text-neutral-400 mt-2">Per study block</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Daily Activity Chart */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Last 7 Days Activity</h3>
          {detailedStats.dailyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={detailedStats.dailyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="blocks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-neutral-400">
              No activity data yet. Complete some study blocks to see your progress!
            </div>
          )}
        </div>

        {/* Subject Distribution */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Time by Subject</h3>
          {detailedStats.subjectChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={detailedStats.subjectChartData}
                  dataKey="hours"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props: any) => {
                    const { subject, hours } = props.payload;
                    return `${subject}: ${hours}h`;
                  }}
                >
                  {detailedStats.subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${value ?? 0}h`}
                  labelFormatter={(label) => `Subject: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-neutral-400">
              No subject data yet. Start studying to see the breakdown!
            </div>
          )}
        </div>
      </div>

      {/* Subject Breakdown Table */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Subject Breakdown</h3>
        {detailedStats.subjectChartData.length > 0 ? (
          <div className="space-y-4">
            {detailedStats.subjectChartData
              .sort((a, b) => b.hours - a.hours)
              .map((subject) => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <span className="font-semibold">{subject.subject}</span>
                      <span className="text-sm text-neutral-500">
                        {subject.blocks} blocks
                      </span>
                    </div>
                    <span className="font-bold">{subject.hours}h</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        backgroundColor: subject.color,
                        width: `${
                          (subject.hours /
                            Math.max(
                              ...detailedStats.subjectChartData.map(
                                (s) => s.hours
                              )
                            )) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-400">
            No subjects tracked yet. Complete study blocks to see your breakdown.
          </div>
        )}
      </div>
    </main>
  );
}