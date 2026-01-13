"use client";

import { useStreak } from "@/hooks/useStreak";

export function StreakBadge() {
  const { streak } = useStreak();

  if (!streak || streak.currentStreak === 0) return null;

  const getFlameColor = () => {
    if (streak.currentStreak >= 30) return "text-yellow-500"; // Gold
    if (streak.currentStreak >= 7) return "text-orange-500"; // Orange
    return "text-red-500"; // Red
  };

  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-neutral-200 shadow-sm">
      <span className={`text-2xl ${getFlameColor()}`}>🔥</span>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-neutral-900">
          {streak.currentStreak}
        </span>
        <span className="text-xs text-neutral-500">day streak</span>
      </div>
      {streak.currentStreak >= 7 && (
        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-semibold">
          🔥 Hot!
        </span>
      )}
    </div>
  );
}