"use client";

import { useEffect, useState } from "react";
import { DayContext } from "@/lib/types";
import { DAY_CONTEXT_KEY } from "@/lib/constants";

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

      const parsed: DayContext = JSON.parse(raw);

      if (!parsed?.date) {
        setReady(true);
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      if (parsed.date !== today) {
        setReady(true);
        return;
      }

      setContext(parsed);
      setReady(true);
    } catch {
      setReady(true);
    }
  }, []);

  return { context, ready };
}
