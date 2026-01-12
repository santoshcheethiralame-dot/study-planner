// hooks/useTodayPlan.ts
"use client";

import { useEffect, useState } from "react";
import { generateTodayPlan } from "@/lib/generateTodayplan";
import { useTodayContext } from "./useTodayContext";
import type { StudyBlock } from "@/lib/types";

export function useTodayPlan() {
  const { context, ready } = useTodayContext();
  const [plan, setPlan] = useState<StudyBlock[] | null>(null);

  useEffect(() => {
    if (!ready || !context) return;

    const generated = generateTodayPlan(context);
    setPlan(generated);
  }, [ready, context]);

  return {
    ready,
    plan,
  };
}
