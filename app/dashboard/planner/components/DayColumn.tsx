"use client";

import type { DayPlan } from "@/lib/weekPlanning";

interface DayColumnProps {
  day: DayPlan;
  onDragStart: (blockId: string, fromDate: string) => void;
  onDrop: (toDate: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function DayColumn({
  day,
  onDragStart,
  onDrop,
  onDragEnd,
  isDragging,
}: DayColumnProps) {
  const today = new Date().toISOString().slice(0, 10);
  const isToday = day.date === today;
  const isPast = day.date < today;

  const dayName = new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
  });
  const dayNumber = new Date(day.date + "T00:00:00").getDate();
  const monthName = new Date(day.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { month: "short" }
  );

  const completedBlocks = day.blocks.filter((b) => b.status === "done").length;
  const totalBlocks = day.blocks.length;

  return (
    <div
      className={`bg-white rounded-2xl border-2 p-4 min-h-[500px] transition-all ${
        isToday
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-neutral-200 shadow-sm"
      } ${isPast ? "opacity-60" : ""} ${
        isDragging && !isPast
          ? "ring-2 ring-blue-300 ring-offset-2"
          : ""
      }`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => !isPast && onDrop(day.date)}
    >
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-neutral-600 uppercase">
            {dayName}
          </span>
          <div className="text-right">
            <div
              className={`text-2xl font-bold ${
                isToday ? "text-blue-600" : "text-neutral-900"
              }`}
            >
              {dayNumber}
            </div>
            <div className="text-xs text-neutral-500">{monthName}</div>
          </div>
        </div>

        {isToday && (
          <div className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full inline-block font-semibold">
            Today
          </div>
        )}

        {/* Progress Indicator */}
        {totalBlocks > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
              <span>Progress</span>
              <span>
                {completedBlocks}/{totalBlocks}
              </span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{
                  width: `${(completedBlocks / totalBlocks) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Blocks */}
      <div className="space-y-2">
        {day.blocks.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm">
            <div className="text-3xl mb-2">📅</div>
            <p>No blocks scheduled</p>
          </div>
        ) : (
          day.blocks.map((block) => (
            <div
              key={block.id}
              draggable={!isPast && block.status !== "done"}
              onDragStart={() => onDragStart(block.id, day.date)}
              onDragEnd={onDragEnd}
              className={`p-3 rounded-xl border-2 transition-all ${
                block.status === "done"
                  ? "bg-green-50 border-green-300 shadow-sm"
                  : "bg-white border-neutral-300"
              } ${
                !isPast && block.status !== "done"
                  ? "cursor-move hover:shadow-md hover:scale-[1.02] active:scale-95"
                  : "cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm text-neutral-900 line-clamp-2 flex-1">
                  {block.title}
                </p>
                {block.status === "done" && (
                  <span className="text-green-600 text-xl ml-2 flex-shrink-0">
                    ✓
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    schedule
                  </span>
                  {block.durationMin}m
                </span>
                <span>•</span>
                <span className="bg-neutral-100 px-2 py-0.5 rounded-full font-medium">
                  {block.subjectCode}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Block Placeholder */}
      {!isPast && (
        <button
          className="w-full mt-4 py-3 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition text-sm font-medium flex items-center justify-center gap-2"
          onClick={() => {
            // TODO: Implement add block modal
            alert(
              `Add block for ${dayName}, ${monthName} ${dayNumber}. Coming soon!`
            );
          }}
        >
          <span className="text-xl">+</span>
          Add Block
        </button>
      )}
    </div>
  );
}