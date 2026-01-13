"use client";

import { useState } from "react";
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

export default function DashboardPage() {
  useOnboardingGuard("require");

  const { context, ready: contextReady } = useTodayContext();
  const { plan, ready: planReady, completeBlock, deleteBlock, addBlock } = useTodayPlan();
  const [activeBlock, setActiveBlock] = useState<StudyBlock | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);

  const { recordCompletion } = useStreak();

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-neutral-600">Please complete your day context check-in</p>
        </div>
      </div>
    );
  }

  const nextBlock = plan?.find((b) => b.status !== "done");
  const completedCount = plan?.filter((b) => b.status === "done").length || 0;
  const totalCount = plan?.length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addBlock(newTaskTitle, 45, "MISC");
    setNewTaskTitle("");
  };

  const handleBlockComplete = (blockId: string) => {
    completeBlock(blockId);

    // Make a plan copy with the just-completed block marked as "done"
    const updatedPlan = plan?.map(b =>
      b.id === blockId ? { ...b, status: "done" as const } : b
    );
    const allDone = updatedPlan?.every(b => b.status === "done");

    if (allDone) {
      recordCompletion();
    } else {
      // Show break screen if more blocks remain
      setIsOnBreak(true);
    }

    setShowConfetti(true);
    setActiveBlock(null);
  };

  return (
    <main className="px-6 md:px-12 py-10 bg-[#f6f6f8] min-h-screen">
      {/* Header with Context and Streak */}
      <div className="flex items-center justify-between mb-6">
        <TodayHeader context={context} />
        <StreakBadge />
      </div>

      {/* Focus Session Overlay */}
      {activeBlock && (
        <FocusSession
          block={activeBlock}
          onExit={() => setActiveBlock(null)}
          onComplete={() => handleBlockComplete(activeBlock.id)}
        />
      )}

      {/* Progress Summary */}
      <div className="mt-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Today's Progress</h3>
            <p className="text-sm text-neutral-500 mt-1">
              {completedCount} of {totalCount} blocks completed
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Progress Ring */}
            <div className="relative w-20 h-20">
              <svg className="transform -rotate-90 w-20 h-20">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#4e6797"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={226}
                  strokeDashoffset={226 - (226 * completionPercentage) / 100}
                  className="transition-all duration-700"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{completionPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Next Block Focus Card */}
          {nextBlock ? (
            <FocusCard
              next={nextBlock}
              onStart={() => setActiveBlock(nextBlock)}
            />
          ) : (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-800">All done for today!</h2>
              <p className="text-green-600 mt-2">
                Great work! You completed all {totalCount} blocks.
              </p>
            </div>
          )}

          {/* Quick Add Input */}
          <form onSubmit={handleQuickAdd} className="flex gap-2">
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a quick task..."
              className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
            <button
              type="submit"
              className="bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-neutral-50 transition"
            >
              + Add
            </button>
          </form>

          {/* Upcoming Blocks List */}
          <UpcomingList blocks={plan || []} onDelete={deleteBlock} />
        </div>

        {/* Sidebar */}
        <aside>
          <TimetableWidget />
        </aside>
      </section>

      {/* Break Screen */}
      {isOnBreak && (
        <BreakScreen
          duration={5}
          onComplete={() => setIsOnBreak(false)}
          onSkip={() => setIsOnBreak(false)}
        />
      )}
    </main>
  );
}