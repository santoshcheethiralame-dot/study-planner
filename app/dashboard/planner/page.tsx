"use client";

import { useState, useEffect } from "react";
import { useWeekPlan } from "@/hooks/useWeekPlan";
import { DayColumn } from "./components/DayColumn";

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false);
  const { weekPlan, loading, moveBlock, refreshWeek } = useWeekPlan();
  const [draggedBlock, setDraggedBlock] = useState<{
    blockId: string;
    fromDate: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your week...</p>
        </div>
      </div>
    );
  }

  const handleDragStart = (blockId: string, fromDate: string) => {
    setDraggedBlock({ blockId, fromDate });
  };

  const handleDrop = (toDate: string) => {
    if (!draggedBlock) return;

    const today = new Date().toISOString().slice(0, 10);
    if (toDate < today) {
      alert("Cannot schedule blocks in the past");
      setDraggedBlock(null);
      return;
    }

    moveBlock(draggedBlock.blockId, draggedBlock.fromDate, toDate);
    setDraggedBlock(null);
  };

  const handleDragEnd = () => {
    setDraggedBlock(null);
  };

  return (
    <main className="px-6 md:px-12 py-10 bg-[#f6f6f8] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Week Planner</h1>
        <p className="text-neutral-600">
          Drag blocks between days to reschedule your study sessions
        </p>
      </div>

      {/* Week Grid - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-4">
        <div className="grid grid-cols-7 gap-4 min-w-[1200px]">
          {weekPlan.map((day) => (
            <DayColumn
              key={day.date}
              day={day}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
              isDragging={!!draggedBlock}
            />
          ))}
        </div>
      </div>
    </main>
  );
}