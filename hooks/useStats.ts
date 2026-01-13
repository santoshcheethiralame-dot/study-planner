"use client";

import { useTodayPlan } from "./useTodayPlan";

export function useStats() {
  const { plan } = useTodayPlan();

  if (!plan || plan.length === 0) {
    return { completionRate: 0, totalMinutes: 0, blocksDone: 0 };
  }

  const doneBlocks = plan.filter(b => b.status === "done");
  const blocksDone = doneBlocks.length;
  const completionRate = Math.round((blocksDone / plan.length) * 100);
  
  const totalMinutes = doneBlocks.reduce((acc, curr) => acc + curr.durationMin, 0);

  return {
    completionRate,
    totalMinutes,
    blocksDone,
    totalPlanned: plan.length
  };
}