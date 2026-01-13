import { useMemo } from "react";
import { getTodayKey } from "@/lib/dayContext";
import type { StudyBlock } from "@/lib/types";

export function useStats() {
  return useMemo(() => {
    const todayKey = getTodayKey();
    const planKey = "harmony_today_plan_v1";

    try {
      const stored = localStorage.getItem(planKey);
      if (!stored) {
        return {
          completionRate: 0,
          totalMinutes: 0,
          blocksDone: 0,
          totalPlanned: 0,
        };
      }

      const data = JSON.parse(stored);

      // Only calculate for today's plan
      if (data.date !== todayKey) {
        return {
          completionRate: 0,
          totalMinutes: 0,
          blocksDone: 0,
          totalPlanned: 0,
        };
      }

      const blocks: StudyBlock[] = data.blocks || [];
      const totalPlanned = blocks.length;
      const blocksDone = blocks.filter((b) => b.status === "done").length;
      const completionRate = totalPlanned > 0
        ? Math.round((blocksDone / totalPlanned) * 100)
        : 0;
      const totalMinutes = blocks
        .filter((b) => b.status === "done")
        .reduce((sum, b) => sum + b.durationMin, 0);

      return {
        completionRate,
        totalMinutes,
        blocksDone,
        totalPlanned,
      };
    } catch (error) {
      console.error("Error calculating stats:", error);
      return {
        completionRate: 0,
        totalMinutes: 0,
        blocksDone: 0,
        totalPlanned: 0,
      };
    }
  }, []); // Recalculate when called
}