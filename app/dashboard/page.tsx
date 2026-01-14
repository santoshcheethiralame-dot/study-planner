"use client";

import { useState, useEffect } from "react";
import { useTodayContext } from "@/hooks/useTodayContext";
import { useTodayPlan } from "@/hooks/useTodayPlan";
import { useOnboardingGuard } from "@/hooks/onBoardingGuard";
import { TodayHeader } from "./components/TodayHeader";
import { StreakBadge } from "./components/StreakBadge";
import { FocusCard } from "./components/FocusCard";
import { UpcomingList } from "./components/UpcomingList";
import { FocusSession } from "./components/FocusSession";
import { TimetableWidget } from "./components/TimetableWidget";
import { useStreak } from "@/hooks/useStreak";
import type { StudyBlock } from "@/lib/types";
import { BreakScreen } from "./components/BreakScreen";
import { GoalsWidget } from "./components/GoalsWidget";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  useOnboardingGuard("require");

  const router = useRouter();

  const { context, ready: contextReady } = useTodayContext();
  const { plan, ready: planReady, completeBlock, deleteBlock, addBlock } = useTodayPlan();

  const [activeBlock, setActiveBlock] = useState<StudyBlock | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);

  // For shortcuts modal (?)
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const { recordCompletion } = useStreak();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "d": () => router.push("/dashboard"),
    "p": () => router.push("/planner"),
    "s": () => router.push("/stats"),
    "g": () => router.push("/settings"),
    "?": () => setShowShortcutsHelp(true),
  });

  // Handle Confetti Timeout
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  // Loading states
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

  // No context check
  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center p-6">
        <p className="text-neutral-600">Please complete your day context check-in</p>
      </div>
    );
  }

  // Data Calculations for Progress Tracker
  const nextBlock = plan?.find((b) => b.status !== "done");
  const completedCount = plan?.filter((b) => b.status === "done").length || 0;
  const totalCount = plan?.length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Projection: Total minutes remaining
  const remainingMinutes = plan
    ?.filter((b) => b.status !== "done")
    .reduce((acc, curr) => acc + curr.durationMin, 0) || 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addBlock(newTaskTitle, 45, "MISC");
    setNewTaskTitle("");
  };

  const handleBlockComplete = (blockId: string) => {
    completeBlock(blockId);

    const updatedPlan = plan?.map(b =>
      b.id === blockId ? { ...b, status: "done" as const } : b
    );

    const allDone = updatedPlan?.every(b => b.status === "done");

    if (allDone) {
      recordCompletion();
      setShowConfetti(true); // Trigger confetti for 100% completion
    } else {
      setIsOnBreak(true);
    }

    setActiveBlock(null);
  };

  return (
    <main className="px-6 md:px-12 py-10 bg-[#f6f6f8] min-h-screen relative overflow-x-hidden">

      {/* Confetti Layer */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex justify-center">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-sm animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#4e6797', '#306ee8', '#10b981', '#f59e0b'][i % 4],
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Shortcuts Help Modal (if wanted) */}
      {showShortcutsHelp && (
        <div
          className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4"
          onClick={() => setShowShortcutsHelp(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
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
                { key: "n", description: "Add new block" },
                { key: "Esc", description: "Close modals" },
              ].map(shortcut => (
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

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <TodayHeader context={context} />
        <StreakBadge />
      </div>

      {/* Feature 1: Progress Summary Widget */}
      <div className="mt-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-neutral-900">Today&apos;s Goal</h3>
            <p className="text-sm text-neutral-500">
              {completedCount} of {totalCount} blocks done • {remainingMinutes}m remaining
            </p>
          </div>

          <div className="relative w-16 h-16">
            <svg className="transform -rotate-90 w-16 h-16">
              <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="5" fill="none" />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="var(--color-primary)"
                strokeWidth="5"
                fill="none"
                strokeDasharray={176}
                strokeDashoffset={176 - (176 * completionPercentage) / 100}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold">{completionPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay: Focus Session (With Slide Up Animation) */}
      {activeBlock && (
        <div className="fixed inset-0 z-50 animate-slide-up">
          <FocusSession
            block={activeBlock}
            onExit={() => setActiveBlock(null)}
            onComplete={() => handleBlockComplete(activeBlock.id)}
          />
        </div>
      )}

      {/* Main Content Grid */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-8">

          {/* Active Task / Finish State */}
          {nextBlock ? (
            <FocusCard
              next={nextBlock}
              onStart={() => setActiveBlock(nextBlock)}
            />
          ) : (
            <div className="bg-white p-10 rounded-3xl border-2 border-dashed border-green-200 text-center space-y-4">
              <div className="text-5xl">🏆</div>
              <h2 className="text-2xl font-black text-neutral-900">Victory!</h2>
              <p className="text-neutral-500 max-w-xs mx-auto">
                All study blocks for today are finished. Rest up for tomorrow.
              </p>
            </div>
          )}

          {/* Feature 3: Quick Add */}
          <form onSubmit={handleQuickAdd} className="flex gap-3 bg-white p-2 rounded-2xl border border-neutral-200 shadow-sm focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What else do you need to study?"
              className="flex-1 px-4 py-2 bg-transparent focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Add Block
            </button>
          </form>

          {/* List of Tasks */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-4 ml-1">Timeline</h4>
            <UpcomingList blocks={plan || []} onDelete={deleteBlock} />
          </div>
        </div>

        {/* Sidebar Widgets */}
        <aside className="space-y-6">
          <GoalsWidget />
          <TimetableWidget />
        </aside>
      </section>

      {/* Feature 2: Break Screen Overlay */}
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
  );
}