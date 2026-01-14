"use client";

import { useState, useEffect } from "react";
import { useTodayContext } from "@/hooks/useTodayContext";
import { useTodayPlan } from "@/hooks/useTodayPlan";
import { useOnboardingGuard } from "@/hooks/onBoardingGuard";
import { FocusSession } from "./components/FocusSession";
import { useStreak } from "@/hooks/useStreak";
import type { StudyBlock } from "@/lib/types";
import { BreakScreen } from "./components/BreakScreen";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRouter } from "next/navigation";

// Helper for circular progress
function CircularProgress({ percent }: { percent: number }) {
  const size = 80;
  const stroke = 7;
  const radius = (size / 2) - stroke;
  const c = 2 * Math.PI * radius;
  return (
    <svg width={size} height={size} className="block" style={{ display: "block" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#f0f0f4"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1313ec"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c - (c * percent) / 100}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)",
        }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".35em"
        className="text-[1rem] font-bold fill-[#111118]"
        style={{ fontFamily: "Lexend, sans-serif" }}
      >
        {percent}%
      </text>
    </svg>
  );
}

// Intelligent Timeline Item helper
function IntelligentTimeline({ blocks }: { blocks: StudyBlock[] }) {
  let items: {
    block?: StudyBlock;
    type: "past" | "current" | "upcoming";
    time: string;
  }[] = [];

  // Mock time generator for demo
  function getMockedTime(index: number): string {
    const options = [
      "09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"
    ];
    return options[index % options.length];
  }

  const nonDone = blocks.filter((b) => b.status !== "done");
  const doneBlocks = blocks.filter((b) => b.status === "done");

  // Past (all done blocks)
  doneBlocks.forEach((block, idx) => {
    items.push({
      block,
      type: "past",
      time: getMockedTime(idx),
    });
  });

  if (nonDone.length) {
    // Current: first non-done block
    const curBlock = nonDone[0];
    items.push({
      block: curBlock,
      type: "current",
      time: getMockedTime(doneBlocks.length),
    });

    // Remaining: upcoming
    nonDone.slice(1).forEach((block, idx) => {
      items.push({
        block,
        type: "upcoming",
        time: getMockedTime(doneBlocks.length + 1 + idx),
      });
    });
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col bg-white rounded-3xl p-6 shadow-soft border border-white/50">
        <div className="text-center text-[#616189] py-12">
          <p className="text-lg font-semibold mb-2">No blocks scheduled yet</p>
          <p className="text-sm">Add your first study block to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-3xl p-6 shadow-soft border border-white/50 relative">
      {/* Connecting Line behind timeline items */}
      <div className="absolute left-[3.25rem] top-10 bottom-10 w-0.5 bg-[#f0f0f4] pointer-events-none"></div>
      
      {items.map((item, idx) => {
        const block = item.block!;
        
        if (item.type === "past") {
          return (
            <div key={idx} className="flex gap-4 relative group opacity-50 hover:opacity-100 transition-opacity">
              <div className="flex flex-col items-end w-16 pt-1">
                <span className="text-xs font-bold text-[#111118]">{item.time}</span>
                <span className="text-[10px] text-[#616189]">Done</span>
              </div>
              <div className="relative z-10 flex items-center justify-center size-8 rounded-full bg-emerald-100 text-emerald-600 border-2 border-white shrink-0">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div className="flex-1 bg-[#f8f9fa] p-3 rounded-xl mb-4 border border-transparent">
                <span className="font-bold text-[#111118] line-through">{block.title}</span>
              </div>
            </div>
          );
        }
        
        if (item.type === "current") {
          return (
            <div key={idx} className="flex gap-4 relative">
              <div className="flex flex-col items-end w-16 pt-1">
                <span className="text-xs font-bold text-primary">{item.time}</span>
                <span className="text-[10px] text-primary font-medium">Now</span>
              </div>
              <div className="relative z-10 flex items-center justify-center size-8 rounded-full bg-primary text-white border-4 border-white shadow-lg shrink-0">
                <div className="size-2 bg-white rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1 bg-white p-4 rounded-xl mb-6 border-l-4 border-l-primary shadow-sm ring-1 ring-[#f0f0f4]">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-[#111118] text-lg">{block.title}</h4>
                    <p className="text-[#616189] text-sm">{block.subjectCode} • {block.durationMin}m</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wide">
                    {block.subjectCode}
                  </span>
                </div>
              </div>
            </div>
          );
        }
        
        if (item.type === "upcoming") {
          return (
            <div key={idx} className="flex gap-4 relative group">
              <div className="flex flex-col items-end w-16 pt-1">
                <span className="text-xs font-bold text-[#111118]">{item.time}</span>
                <span className="text-[10px] text-[#616189]">Next</span>
              </div>
              <div className="relative z-10 flex items-center justify-center size-8 rounded-full bg-white border-2 border-[#dbdbe6] shrink-0">
                <div className="size-2 bg-[#dbdbe6] rounded-full"></div>
              </div>
              <div className="flex-1 bg-white p-3 rounded-xl mb-4 border border-[#f0f0f4] hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-[#111118]">{block.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wide mt-1 inline-block">
                      {block.subjectCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
}

export default function DashboardPage() {
  useOnboardingGuard("require");
  const router = useRouter();
  const { context, ready: contextReady } = useTodayContext();
  const { plan, ready: planReady, completeBlock, deleteBlock, addBlock } = useTodayPlan();
  const { streak, recordCompletion } = useStreak();

  const [activeBlock, setActiveBlock] = useState<StudyBlock | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  useKeyboardShortcuts({
    d: () => router.push("/dashboard"),
    p: () => router.push("/planner"),
    s: () => router.push("/stats"),
    g: () => router.push("/settings"),
    "?": () => setShowShortcutsHelp(true),
  });

  // Confetti Timeout
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Loading / no context
  if (!contextReady || !planReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your plan...</p>
        </div>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center p-6">
        <p className="text-neutral-600">Please complete your day context check-in</p>
      </div>
    );
  }

  // Derived stats
  const nextBlock = plan?.find((b) => b.status !== "done");
  const completedCount = plan?.filter((b) => b.status === "done").length || 0;
  const totalCount = plan?.length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const remainingMinutes = plan?.filter((b) => b.status !== "done")
    .reduce((acc, curr) => acc + curr.durationMin, 0) || 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addBlock(newTaskTitle, 45, "MISC");
    setNewTaskTitle("");
  };

  const handleBlockComplete = (blockId: string) => {
    completeBlock(blockId);

    const updatedPlan = plan?.map((b) =>
      b.id === blockId ? { ...b, status: "done" as const } : b
    );

    const allDone = updatedPlan?.every((b) => b.status === "done");

    if (allDone) {
      recordCompletion();
      setShowConfetti(true);
    } else {
      setIsOnBreak(true);
    }
    setActiveBlock(null);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  };

  const getMoodLabel = () => {
    switch (context.mood) {
      case "high": return "High Energy Day";
      case "normal": return "Normal Energy";
      case "low": return "Low Energy Day";
      default: return "Normal Energy";
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Main Workspace */}
      <main className="flex-1 h-full overflow-y-auto relative bg-[#f6f6f8] p-10">
        {/* Confetti Layer */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[100] flex justify-center">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-primary rounded-sm animate-confetti-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ["#4e6797", "#306ee8", "#10b981", "#f59e0b"][i % 4],
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Keyboard Shortcuts Modal */}
        {showShortcutsHelp && (
          <div
            className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4"
            onClick={() => setShowShortcutsHelp(false)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">⌨️ Keyboard Shortcuts</h3>
                <button
                  onClick={() => setShowShortcutsHelp(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { key: "?", description: "Show this help" },
                  { key: "d", description: "Go to Dashboard" },
                  { key: "p", description: "Go to Planner" },
                  { key: "s", description: "Go to Stats" },
                  { key: "g", description: "Go to Settings" },
                ].map((shortcut) => (
                  <div key={shortcut.key} className="flex items-center justify-between">
                    <span className="text-neutral-600">{shortcut.description}</span>
                    <kbd className="px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-lg text-sm font-mono">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-10">
          {/* Header */}
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black text-[#111118] tracking-tight leading-tight">
                Good {getGreeting()}, Student
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-[#616189] text-base font-normal">
                  {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#dbdbe6]"></span>
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 border border-emerald-200">
                  <span>⚡</span>
                  {getMoodLabel()}
                </div>
              </div>
            </div>
            <button className="relative group cursor-pointer">
              <div className="relative flex items-center gap-2 px-5 py-2.5 bg-white border border-orange-100 rounded-xl shadow-soft hover:-translate-y-0.5 transition-transform">
                <span className="text-xl">🔥</span>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-[#616189] font-medium uppercase tracking-wider">Streak</span>
                  <span className="text-[#111118] text-sm font-bold">{streak?.currentStreak || 0} Days</span>
                </div>
              </div>
            </button>
          </header>

          {/* Progress Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Goal */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex items-center justify-between border border-white/50">
              <div className="flex flex-col gap-1">
                <p className="text-[#616189] text-sm font-medium">You're crushing it!</p>
                <h3 className="text-2xl font-bold text-[#111118]">
                  {completedCount} of {totalCount} blocks done
                </h3>
                <p className="text-[#1313ec] text-sm font-medium mt-2">
                  {Math.floor(remainingMinutes / 60)}h {remainingMinutes % 60}m remaining
                </p>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#f0f0f4" strokeWidth="6" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="#1313ec"
                    strokeWidth="6"
                    strokeDasharray={213.6}
                    strokeDashoffset={213.6 - (213.6 * completionPercentage) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#111118]">{completionPercentage}%</span>
                </div>
              </div>
            </div>

            {/* Weekly Focus - Real Data */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col justify-between border border-white/50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <p className="text-[#616189] text-xs font-bold uppercase tracking-wider mb-1">📊 Weekly Focus</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#616189]">Total Hours</p>
                  <p className="text-2xl font-bold text-[#111118]">
                    {Math.floor((completedCount * 45) / 60)}h
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#616189]">Completion</p>
                  <p className="text-2xl font-bold text-green-600">{completionPercentage}%</p>
                </div>
              </div>
            </div>

            {/* Tomorrow Preview - Show next pending blocks */}
            <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col justify-center gap-3 border border-white/50">
              <h3 className="font-bold text-base">📅 Upcoming</h3>
              {plan && plan.filter(b => b.status === "pending").slice(0, 2).length > 0 ? (
                plan.filter(b => b.status === "pending").slice(0, 2).map((block, idx) => (
                  <div key={block.id} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                    <span className="text-sm text-[#111118]">{block.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#616189]">No upcoming blocks</p>
              )}
            </div>
          </section>

          {/* Focus Mode (Current focus block) */}
          <section className="w-full">
            <div className="relative w-full rounded-3xl overflow-hidden shadow-xl group">
              <div className="absolute inset-0 bg-[#043c50]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#043c50]/90 via-[#043c50]/70 to-transparent"></div>
              </div>
              <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
                <div className="flex flex-col gap-4 items-start">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(238,217,190,0.14)",
                      color: "#eed9be",
                    }}
                  >
                    <span>⏰</span>
                    <span>Current Session</span>
                  </div>
                  <div>
                    <h2
                      className="text-3xl md:text-4xl font-bold mb-1"
                      style={{ color: "#eed9be" }}
                    >
                      {nextBlock ? nextBlock.title : "No Active Block"}
                    </h2>
                    <p
                      className="text-lg font-light"
                      style={{ color: "#eed9be", opacity: 0.8 }}
                    >
                      {nextBlock ? nextBlock.subjectCode : "Take a break or add a new block!"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-6">
                  <div
                    className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums drop-shadow-lg"
                    style={{ color: "#eed9be" }}
                  >
                    {nextBlock ? (
                      nextBlock.durationMin >= 60 ? (
                        // Show in 00:50:00 (hh:mm:ss) format for 50+ mins
                        <span>
                          {String(Math.floor(nextBlock.durationMin / 60)).padStart(2, "0")}:
                          {String(nextBlock.durationMin % 60).padStart(2, "0")}:00
                        </span>
                      ) : (
                        // Show as "50 mins" format if less than 60 minutes
                        <span>
                          {nextBlock.durationMin} mins
                        </span>
                      )
                    ) : (
                      <span>--:--</span>
                    )}
                  </div>
                  {nextBlock ? (
                    <button
                      className="px-8 py-3 rounded-full font-bold text-lg shadow-[0_0_30px_rgba(238,217,190,0.28)] hover:shadow-[0_0_50px_rgba(238,217,190,0.45)] hover:scale-105 transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: "#eed9be",
                        color: "#043c50"
                      }}
                      onClick={() => setActiveBlock(nextBlock)}
                    >
                      <span>▶</span>
                      Start Focus Session
                    </button>
                  ) : (
                    <span style={{ color: "#eed9be", opacity: 0.7 }}>Great work! 🎉</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Intelligent Timeline & Actions */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-[#111118]">Today's Schedule</h3>
              </div>
              <IntelligentTimeline blocks={plan || []} />
              <form
                onSubmit={handleQuickAdd}
                className="flex gap-3 mt-4 bg-white p-2 rounded-2xl border border-neutral-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/10 transition-all"
              >
                <input
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="Add a new study block..."
                  className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Add
                </button>
              </form>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold text-[#111118] mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4 h-full">
                <button
                  className="bg-white p-4 rounded-3xl shadow-soft hover:shadow-lg hover:scale-[1.03] transition-all flex flex-col items-center justify-center gap-2 group aspect-square"
                  onClick={() => nextBlock && setActiveBlock(nextBlock)}
                  disabled={!nextBlock}
                >
                  <div className="size-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <span className="text-3xl">⏱</span>
                  </div>
                  <span className="font-bold text-sm text-[#111118]">Focus Mode</span>
                </button>
                <button
                  className="bg-white p-4 rounded-3xl shadow-soft hover:shadow-lg hover:scale-[1.03] transition-all flex flex-col items-center justify-center gap-2 group aspect-square"
                  onClick={() => router.push("/stats")}
                >
                  <div className="size-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <span className="text-3xl">📊</span>
                  </div>
                  <span className="font-bold text-sm text-[#111118]">Stats</span>
                </button>
                <button
                  className="bg-white p-4 rounded-3xl shadow-soft hover:shadow-lg hover:scale-[1.03] transition-all flex flex-col items-center justify-center gap-2 group aspect-square"
                  onClick={() => router.push("/planner")}
                >
                  <div className="size-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <span className="text-3xl">📅</span>
                  </div>
                  <span className="font-bold text-sm text-[#111118]">Planner</span>
                </button>
                <button
                  className="bg-white p-4 rounded-3xl shadow-soft hover:shadow-lg hover:scale-[1.03] transition-all flex flex-col items-center justify-center gap-2 group aspect-square"
                  onClick={() => router.push("/settings")}
                >
                  <div className="size-12 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-gray-600 group-hover:text-white transition-colors">
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <span className="font-bold text-sm text-[#111118]">Settings</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Overlay: Focus Session */}
        {activeBlock && (
          <div className="fixed inset-0 z-50 animate-slide-up">
            <FocusSession
              block={activeBlock}
              onExit={() => setActiveBlock(null)}
              onComplete={() => handleBlockComplete(activeBlock.id)}
            />
          </div>
        )}

        {/* Overlay: Break Screen */}
        {isOnBreak && (
          <div className="fixed inset-0 z-[60] animate-slide-up">
            <BreakScreen
              duration={5}
              onComplete={() => setIsOnBreak(false)}
              onSkip={() => setIsOnBreak(false)}
            />
          </div>
        )}
      </main>
    </div>
  );
}