"use client";

import { useMemo, useState, useEffect } from "react";
import type { StudyBlock } from "@/lib/types";
import { useStats } from "@/hooks/useStats";

const COLORS = [
  "#a855f7", // purple
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#f43f5e", // rose
  "#06b6d4", // cyan
];

interface SubjectChartData {
  subject: string;
  hours: number;
  blocks: number;
  color: string;
}

interface DailyChartData {
  date: string;
  blocks: number;
}

function exportStatsToCSV({ 
  subjectChartData, 
  dailyChartData 
}: { 
  subjectChartData: SubjectChartData[];
  dailyChartData: DailyChartData[];
}) {
  // Compile CSV content for the main stats
  let csv = "Subjects\nSubject,Hours,Blocks\n";
  subjectChartData.forEach((row: SubjectChartData) => {
    csv += `${row.subject},${row.hours},${row.blocks}\n`;
  });
  csv += "\nDaily Blocks\nDay,Blocks\n";
  dailyChartData.forEach((row: DailyChartData) => {
    csv += `${row.date},${row.blocks}\n`;
  });

  // Download as CSV
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "study_stats.csv";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

export default function StatsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "all">("week");
  const [mounted, setMounted] = useState(false);
  const { completionRate, totalMinutes, blocksDone, totalPlanned } = useStats();

  useEffect(() => {
    setMounted(true);
    // Always on light mode: remove 'dark' class from html/body
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
  }, []);

  // --- NEW WEEK-ALIGNED HEATMAP LOGIC ---
  const detailedStats = useMemo(() => {

    if (typeof window === "undefined" || !mounted) {
      return {
        subjectChartData: [] as SubjectChartData[],
        dailyChartData: [] as DailyChartData[],
        heatmapData: [] as number[][],
        hasRealData: false,
      };
    }

    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("harmony_today_plan")
    );

    const subjectData: Record<
      string,
      { minutes: number; blocks: number; color: string }
    > = {};
    const dailyData: Record<string, number> = {};
    const heatmapRaw: Record<string, Record<number, number>> = {};

    // 1. Parse all LocalStorage Data
    allKeys.forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key)!);
        if (!data?.blocks) return;

        const blocks: StudyBlock[] = data.blocks;
        const date = data.date; // Format: "YYYY-MM-DD"

        dailyData[date] = blocks.filter((b) => b.status === "done").length;

        blocks.forEach((block) => {
          if (block.status === "done") {
            // Aggregate Subject Data
            if (!subjectData[block.subjectCode]) {
              subjectData[block.subjectCode] = {
                minutes: 0,
                blocks: 0,
                color: COLORS[Object.keys(subjectData).length % COLORS.length],
              };
            }
            subjectData[block.subjectCode].minutes += block.durationMin;
            subjectData[block.subjectCode].blocks += 1;

            // Aggregate Heatmap Data
            if (!heatmapRaw[date]) {
              heatmapRaw[date] = {};
            }

            let hourSlot = 0;
            // Use completedAt if available, otherwise estimate based on list position
            if ((block as any).completedAt) {
              const completedDate = new Date((block as any).completedAt);
              const hour = completedDate.getHours();
              hourSlot = Math.max(0, Math.min(11, Math.floor((hour - 6) / 1.25)));
            } else {
              const blockIndex = blocks.indexOf(block);
              hourSlot = Math.min(11, Math.floor(blockIndex * 2.5));
            }

            heatmapRaw[date][hourSlot] = (heatmapRaw[date][hourSlot] || 0) + 1;
          }
        });
      } catch (e) {
        console.error("Error parsing stats data", e);
      }
    });

    const hasRealData =
      Object.keys(subjectData).length > 0 || Object.keys(dailyData).length > 0;

    // --- RETURN MOCK DATA IF NO REAL DATA ---
    if (!hasRealData) {
      // (Your original mock data block here)
      return {
        subjectChartData: [
          { subject: "Math", hours: 12, blocks: 16, color: COLORS[0] },
          { subject: "Physics", hours: 8, blocks: 11, color: COLORS[1] },
          { subject: "History", hours: 4, blocks: 5, color: COLORS[2] },
          { subject: "English", hours: 3.5, blocks: 5, color: COLORS[3] },
          { subject: "Biology", hours: 4.6, blocks: 6, color: COLORS[4] },
        ] as SubjectChartData[],
        dailyChartData: [
          { date: "Mon", blocks: 3 },
          { date: "Tue", blocks: 5 },
          { date: "Wed", blocks: 2 },
          { date: "Thu", blocks: 4 },
          { date: "Fri", blocks: 3 },
          { date: "Sat", blocks: 1 },
          { date: "Sun", blocks: 2 },
        ] as DailyChartData[],
        heatmapData: [
          [0, 1, 3, 2, 1, 0, 1, 3, 2, 1, 0, 0], // Mon
          [0, 2, 3, 3, 1, 0, 2, 3, 1, 0, 0, 0], // Tue
          [0, 0, 1, 2, 1, 0, 2, 3, 3, 2, 1, 0], // Wed
          [0, 2, 3, 2, 1, 0, 1, 2, 1, 0, 0, 0], // Thu
          [0, 1, 2, 1, 0, 0, 1, 2, 1, 0, 0, 0], // Fri
          [0, 0, 1, 1, 0, 0, 0, 1, 2, 1, 0, 0], // Sat
          [0, 0, 0, 1, 0, 0, 1, 2, 1, 0, 0, 0], // Sun
        ] as number[][],
        hasRealData: false,
      };
    }

    // --- REAL DATA PROCESSING (including week-aligned heatmap) ---
    const subjectChartData: SubjectChartData[] = Object.entries(subjectData).map(
      ([code, data]) => ({
        subject: code,
        hours: Math.round((data.minutes / 60) * 10) / 10,
        blocks: data.blocks,
        color: data.color,
      })
    );

    const dailyChartData: DailyChartData[] = Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, blocks]) => ({
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
        blocks,
      }));

    // --- FIXED HEATMAP LOGIC: Align to Current Week (Mon-Sun) ---
    // 1. Get the current date and find the Monday of this week
    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;

    const mondayDate = new Date(now);
    mondayDate.setDate(now.getDate() - distanceToMonday);

    // 2. Generate an array of 7 date strings (YYYY-MM-DD) for this week
    const thisWeeksDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + i);

      // Format manual YYYY-MM-DD to avoid UTC timezone issues
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      thisWeeksDates.push(`${year}-${month}-${day}`);
    }

    // 3. Map these specific dates to the heatmap slots
    const heatmapData: number[][] = thisWeeksDates.map((dateStr) => {
      const dayData = heatmapRaw[dateStr] || {};
      const hourArray = Array(12).fill(0);

      Object.entries(dayData).forEach(([hour, count]) => {
        const hourNum = parseInt(hour);
        hourArray[hourNum] = Math.min(3, Math.floor(count / 1));
      });

      return hourArray;
    });

    return {
      subjectChartData,
      dailyChartData,
      heatmapData,
      hasRealData: true,
    };

  }, [period, mounted]);

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  // Use real data or mock data for display
  const displayCompletionRate = detailedStats.hasRealData ? completionRate : 88;
  const displayTotalHours = detailedStats.hasRealData ? totalHours : 32;
  const displayRemainingMinutes = detailedStats.hasRealData
    ? remainingMinutes
    : 15;
  const displayBlocksDone = detailedStats.hasRealData ? blocksDone : 43;
  const displayTotalPlanned = detailedStats.hasRealData ? totalPlanned : 50;
  const displayAvgSession =
    detailedStats.hasRealData && blocksDone > 0
      ? Math.round(totalMinutes / blocksDone)
      : 45;

  const topSubject =
    detailedStats.subjectChartData.length > 0
      ? detailedStats.subjectChartData.reduce((max, curr) =>
          curr.hours > max.hours ? curr : max
        )
      : null;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f6f8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f8] min-h-screen flex flex-col font-display">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Analytics & Insights
              </h1>
              <p className="text-gray-500 text-base">
                Track your study patterns and energy levels across subjects.
              </p>
            </div>
            <div className="flex gap-3">
              {!detailedStats.hasRealData && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-medium text-amber-700">
                  <span>⚠️</span>
                  <span>Showing mock data</span>
                </div>
              )}
              <button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#f0f2f4] rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={() => exportStatsToCSV(detailedStats)}
              >
                <span className="text-lg">📥</span>
                Export
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-[#f0f2f4] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm font-medium">
                  Total Study Time
                </p>
                <span className="text-primary bg-primary/10 p-1.5 rounded-lg text-xl">
                  ⏱
                </span>
              </div>
              <div className="flex items-end gap-3 mt-1">
                <p className="text-3xl font-bold tracking-tight">
                  {displayTotalHours}h {displayRemainingMinutes}m
                </p>
                <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold mb-1">
                  <span className="text-xs mr-0.5">↗</span>
                  5%
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#f0f2f4] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm font-medium">
                  Focus Score
                </p>
                <span className="text-amber-500 bg-amber-500/10 p-1.5 rounded-lg text-xl">
                  ⚡
                </span>
              </div>
              <div className="flex items-end gap-3 mt-1">
                <p className="text-3xl font-bold tracking-tight">
                  {displayCompletionRate}
                  <span className="text-xl text-gray-400 font-normal">
                    /100
                  </span>
                </p>
                <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold mb-1">
                  <span className="text-xs mr-0.5">↗</span>
                  2%
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#f0f2f4] shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm font-medium">
                  Top Subject
                </p>
                <span className="text-purple-500 bg-purple-500/10 p-1.5 rounded-lg text-xl">
                  🎓
                </span>
              </div>
              <div className="flex items-end gap-3 mt-1">
                <p className="text-3xl font-bold tracking-tight">
                  {topSubject?.subject || "Math"}
                </p>
                <p className="text-sm text-gray-500 mb-1.5">
                  {topSubject?.hours || 12}h this week
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Hours Studied Chart */}
            <div className="bg-white p-6 rounded-xl border border-[#f0f2f4] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Hours Studied</h3>
                  <p className="text-sm text-gray-500">
                    Distribution by subject
                  </p>
                </div>
                <button className="text-gray-400 hover:text-primary transition-colors">
                  <span className="text-xl">⋯</span>
                </button>
              </div>
              <div className="flex flex-col gap-5">
                {detailedStats.subjectChartData.map((subject: SubjectChartData) => (
                  <div
                    key={subject.subject}
                    className="flex flex-col gap-1.5"
                  >
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-700">
                        {subject.subject}
                      </span>
                      <span className="text-gray-900 font-bold">
                        {subject.hours}h
                      </span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${
                            (subject.hours /
                              Math.max(
                                ...detailedStats.subjectChartData.map(
                                  (s: SubjectChartData) => s.hours
                                )
                              )) *
                            100
                          }%`,
                          backgroundColor: subject.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Energy Heatmap */}
            <div className="bg-white p-6 rounded-xl border border-[#f0f2f4] shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold">Energy Peaks</h3>
                  <p className="text-sm text-gray-500">
                    Activity heatmap (Last 7 Days)
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-100"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-200"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-400"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center overflow-x-auto pb-2">
                {/* X-Axis Labels (Time) */}
                <div className="flex justify-between text-[10px] text-gray-400 mb-2 pl-8 min-w-[500px]">
                  <span>6 AM</span>
                  <span>9 AM</span>
                  <span>12 PM</span>
                  <span>3 PM</span>
                  <span>6 PM</span>
                  <span>9 PM</span>
                </div>
                <div className="flex flex-col gap-1.5 min-w-[500px]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, dayIdx) => (
                      <div key={day} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-6">
                          {day}
                        </span>
                        <div className="flex-1 grid grid-cols-12 gap-1 h-6">
                          {detailedStats.heatmapData[dayIdx]?.map(
                            (intensity: number, hourIdx: number) => {
                              const colors = [
                                "bg-gray-100",
                                "bg-blue-200",
                                "bg-blue-400",
                                "bg-primary",
                              ];
                              const color = colors[intensity] || colors[0];
                              return (
                                <div
                                  key={hourIdx}
                                  className={`${color} rounded-sm ${
                                    intensity >= 3
                                      ? "group relative cursor-pointer hover:scale-110 transition-transform"
                                      : ""
                                  }`}
                                >
                                  {intensity >= 3 && (
                                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-10">
                                      {6 + hourIdx * 1.25}:00 - High Energy
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subject Performance Table */}
          <div className="bg-white rounded-xl border border-[#f0f2f4] shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-[#f0f2f4] flex items-center justify-between">
              <h3 className="text-lg font-bold">Subject Trends</h3>
              <button className="text-primary text-sm font-medium hover:underline">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total Hours
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Blocks
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trend (7d)
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Change
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f4]">
                  {detailedStats.subjectChartData.map((subject: SubjectChartData, idx: number) => (
                    <tr
                      key={subject.subject}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-8 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {subject.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              {subject.blocks} sessions
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {subject.hours}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {subject.blocks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-24 h-8 flex items-end gap-1">
                          {[0.3, 0.5, 0.4, 0.7, 0.9].map((height: number, i: number) => (
                            <div
                              key={i}
                              className="w-1.5 rounded-sm"
                              style={{
                                height: `${height * 100}%`,
                                backgroundColor:
                                  i >= 3 ? subject.color : "#e5e7eb",
                              }}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            idx % 2 === 0
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {idx % 2 === 0 ? "+" : "-"}
                          {Math.floor(Math.random() * 15) + 2}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}