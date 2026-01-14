"use client";

import { useGoals } from "@/hooks/useGoals";
import { useStats } from "@/hooks/useStats";

export function GoalsWidget() {
  const { goals, weekProgress } = useGoals();
  const { blocksDone, totalMinutes } = useStats();

  if (!goals) return null;

  const dailyBlocksProgress = (blocksDone / goals.daily.targetBlocks) * 100;
  const dailyMinutesProgress = (totalMinutes / goals.daily.targetMinutes) * 100;

  const weeklyBlocksProgress =
    (weekProgress.blocksCompleted / goals.weekly.targetBlocks) * 100;
  const weeklyMinutesProgress =
    (weekProgress.minutesCompleted / goals.weekly.targetMinutes) * 100;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Goals</h3>
        <span className="text-2xl">🎯</span>
      </div>

      {/* Daily Goals */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">Today</span>
          <span className="text-xs text-neutral-500">
            {blocksDone}/{goals.daily.targetBlocks} blocks
          </span>
        </div>
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(dailyBlocksProgress, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-3 mb-2">
          <span className="text-sm font-medium text-neutral-700">Time Today</span>
          <span className="text-xs text-neutral-500">
            {totalMinutes}/{goals.daily.targetMinutes} min
          </span>
        </div>
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(dailyMinutesProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Weekly Goals */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">This Week</span>
          <span className="text-xs text-neutral-500">
            {weekProgress.blocksCompleted}/{goals.weekly.targetBlocks} blocks
          </span>
        </div>
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(weeklyBlocksProgress, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-3 mb-2">
          <span className="text-sm font-medium text-neutral-700">
            Time This Week
          </span>
          <span className="text-xs text-neutral-500">
            {Math.floor(weekProgress.minutesCompleted / 60)}h{" "}
            {weekProgress.minutesCompleted % 60}m /{" "}
            {Math.floor(goals.weekly.targetMinutes / 60)}h
          </span>
        </div>
        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(weeklyMinutesProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Achievement Messages */}
      {dailyBlocksProgress >= 100 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-sm font-semibold text-green-800">
            🎉 Daily goal achieved!
          </p>
        </div>
      )}
    </div>
  );
}