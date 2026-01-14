import { useState, useEffect } from "react";
import { getGoals, saveGoals, getWeekProgress, type Goals } from "@/lib/goals";

export function useGoals() {
  const [goals, setGoals] = useState<Goals | null>(null);
  const [weekProgress, setWeekProgress] = useState({
    blocksCompleted: 0,
    minutesCompleted: 0,
    weekStart: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGoals(getGoals());
      setWeekProgress(getWeekProgress());
    }
  }, []);

  const updateGoals = (newGoals: Goals) => {
    saveGoals(newGoals);
    setGoals(newGoals);
  };

  const refreshProgress = () => {
    if (typeof window !== "undefined") {
      setWeekProgress(getWeekProgress());
    }
  };

  return { goals, weekProgress, updateGoals, refreshProgress };
}
