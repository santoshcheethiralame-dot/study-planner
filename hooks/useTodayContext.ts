"use client";

import { useEffect, useState } from "react";
import { DayContext } from "@/lib/types";
import { DAY_CONTEXT_KEY } from "@/lib/constants";
import { getTodayKey } from "@/lib/dayContext";

type UseTodayContextReturn = {
  context: DayContext | null;
  ready: boolean;
};

export function useTodayContext(): UseTodayContextReturn {
  const [context, setContext] = useState<DayContext | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DAY_CONTEXT_KEY);
      if (!raw) {
        setReady(true);
        return;
      }

      // Parse as a dictionary of contexts
      const allContexts: Record<string, DayContext> = JSON.parse(raw);
      const todayKey = getTodayKey();
      
      // Get today's context from the dictionary
      const todayContext = allContexts[todayKey];
      
      if (todayContext) {
        setContext(todayContext);
      }
      
      setReady(true);
    } catch (error) {
      console.error("Error loading day context:", error);
      setReady(true);
    }
  }, []);

  return { context, ready };
}