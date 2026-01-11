// hooks/useRequireDayContext.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasTodayContext } from "@/lib/dayContext";

export function useRequireDayContext() {
  const router = useRouter();

  useEffect(() => {
    if (!hasTodayContext()) {
      router.replace("/onboarding/day-context");
    }
  }, [router]);
}
