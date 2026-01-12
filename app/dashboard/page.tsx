// app/dashboard/page.tsx
"use client";

import { useTodayPlan } from "@/hooks/useTodayPlan";
import { TodayHeader } from "./components/TodayHeader";
import { FocusCard } from "./components/FocusCard";
import { UpcomingList } from "./components/UpcomingList";
import { useTodayContext } from "@/hooks/useTodayContext";

export default function DashboardPage() {
  const { plan, ready } = useTodayPlan();
  const { context } = useTodayContext();

  if (!ready || !plan || !context) return null;

  const nextBlock = plan.find(b => b.status === "active");

  return (
    <main className="px-6 md:px-12 py-10 bg-[#f6f6f8] min-h-screen">
      <TodayHeader context={context} />

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <FocusCard next={nextBlock} />
          <UpcomingList blocks={plan} />
        </div>

        <aside className="bg-white rounded-2xl p-6 border border-[#e7ebf3]">
          <h3 className="font-semibold text-sm">Quick stats</h3>
          <p className="mt-3 text-sm text-[#4e6797]">
            {plan.length} blocks planned today
          </p>
        </aside>
      </section>
    </main>
  );
}
