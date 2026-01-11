// hooks/useTodayContext.ts
"use client";

import { useEffect, useState } from "react";
import { DayContext } from "@/lib/types";
import { getTodayContext } from "@/lib/dayContext";

export function useTodayContext() {
  const [context, setContext] = useState<DayContext | null>(null);

  useEffect(() => {
    setContext(getTodayContext());
  }, []);

  return { context };
}
