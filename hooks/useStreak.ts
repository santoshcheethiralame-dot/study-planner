import { useEffect, useState } from "react";
import { getStreakData, updateStreak, type StreakData } from "@/lib/streaks";

export function useStreak() {
  const [streak, setStreak] = useState<StreakData | null>(null);

  useEffect(() => {
    setStreak(getStreakData());
  }, []);

  const recordCompletion = () => {
    const updated = updateStreak();
    setStreak(updated);
    return updated;
  };

  return { streak, recordCompletion };
}