import { useState, useEffect } from "react";
import { getWeekPlan, moveBlockBetweenDays, type DayPlan } from "@/lib/weekPlanning";

export function useWeekPlan() {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWeek = () => {
    if (typeof window !== "undefined") {
      const plan = getWeekPlan();
      setWeekPlan(plan);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeek();
  }, []);

  const moveBlock = (blockId: string, fromDate: string, toDate: string) => {
    const success = moveBlockBetweenDays(blockId, fromDate, toDate);
    if (success) {
      loadWeek(); // Refresh
    }
    return success;
  };

  const refreshWeek = () => {
    loadWeek();
  };

  return { weekPlan, loading, moveBlock, refreshWeek };
}