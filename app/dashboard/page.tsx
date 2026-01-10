"use client";

import { useOnboardingGuard } from "@/hooks/onBoardingGuard";
import { useDashboardData } from "@/hooks/useDashboardData";

export default function DashboardPage() {
  useOnboardingGuard("require");

  const { semester, subjects, timetable } = useDashboardData();

  return (
    <main className="px-6 md:px-12 py-10">
      <h1 className="text-3xl font-bold">
        {semester?.semesterName || "Dashboard"}
      </h1>

      <p className="mt-2 text-[#4e6797]">
        {subjects.length} subjects · {timetable.length} fixed classes
      </p>
    </main>
  );
}
