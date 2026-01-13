"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTodayContext } from "@/hooks/useTodayContext";
import { useTodayPlan } from "@/hooks/useTodayPlan";
import { TodayHeader } from "./components/TodayHeader";
import { FocusCard } from "./components/FocusCard";
import { UpcomingList } from "./components/UpcomingList";
import { FocusSession } from "./components/FocusSession";
import { StudyBlock } from "@/lib/types";
import { TimetableWidget } from "./components/TimetableWidget";

export default function DashboardPage() {
  const router = useRouter();
  const { context, ready } = useTodayContext();
  const { plan, completeBlock, deleteBlock, addBlock } = useTodayPlan();
  const [activeBlock, setActiveBlock] = useState<StudyBlock | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // ... (Your existing useEffect guard) ...
  // Re-add your existing guard here if you lost it, 
  // or keep the one you had. It is crucial for redirecting.

  if (!ready || !context || !plan) return <div>Loading...</div>;

  const nextBlock = plan.find(b => b.status !== "done");

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addBlock(newTaskTitle, 45, "MISC");
    setNewTaskTitle("");
  };

  return (
    <main className="px-6 md:px-12 py-10 bg-[#f6f6f8] min-h-screen">
      {activeBlock && (
        <FocusSession
          block={activeBlock}
          onExit={() => setActiveBlock(null)}
          onComplete={() => {
            completeBlock(activeBlock.id);
            setActiveBlock(null);
          }}
        />
      )}

      <TodayHeader context={context} />

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {nextBlock ? (
            <FocusCard
              next={nextBlock}
              onStart={() => setActiveBlock(nextBlock)}
            />
          ) : (
            <div className="bg-green-100 p-8 rounded-2xl border border-green-200 text-center">
              <h2 className="text-2xl font-bold text-green-800">All done for today! 🎉</h2>
            </div>
          )}

          {/* Quick Add Input */}
          <form onSubmit={handleQuickAdd} className="flex gap-2">
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a quick task..."
              className="flex-1 px-4 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
            <button
              type="submit"
              className="bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-neutral-50"
            >
              +
            </button>
          </form>

          <UpcomingList 
            blocks={plan} 
            onDelete={deleteBlock} 
          />
        </div>

        <aside>
          <TimetableWidget />
        </aside>
      </section>
    </main>
  );
}