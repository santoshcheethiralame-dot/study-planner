"use client";

import type { DayPlan } from "@/lib/weekPlanning";

interface DayColumnProps {
  day: DayPlan;
  // Remove drag and drop related props
}

export function DayColumn({
  day,
}: DayColumnProps) {
  const today = new Date().toISOString().slice(0, 10);
  const isToday = day.date === today;
  const isPast = day.date < today;

  // Use noon to avoid timezone issues
  const dateObj = new Date(day.date + "T12:00:00");
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
  const dayNumber = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString("en-US", { month: "short" });

  const completedBlocks = day.blocks.filter((b) => b.status === "done").length;
  const totalBlocks = day.blocks.length;
  const progressPercent = totalBlocks > 0 ? (completedBlocks / totalBlocks) * 100 : 0;

  return (
    <div
      className={`flex flex-col gap-3 rounded-3xl p-3 shadow-sm h-full min-h-[600px] transition-all ${
        isToday
          ? "bg-primary/5 ring-2 ring-primary shadow-lg relative overflow-hidden"
          : "bg-white border border-gray-100"
      } ${isPast ? "opacity-60" : ""}`}
      // Remove drag event handlers  
    >
      {/* Background Accent for Today */}
      {isToday && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
      )}

      {/* Header */}
      <div className={`flex flex-col gap-1 px-2 pt-3 pb-1 ${isToday ? "relative z-10" : ""}`}>
        <div className="flex justify-between items-center">
          <p
            className={`text-xs font-bold tracking-widest uppercase ${
              isToday ? "text-primary" : isPast ? "text-gray-400" : "text-[#616189]"
            }`}
          >
            {dayName}
          </p>
          {isToday && (
            <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm shadow-primary/30">
              TODAY
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <h3
            className={`text-3xl font-black ${
              isToday ? "text-primary" : isPast ? "text-gray-500" : "text-[#111118]"
            }`}
          >
            {dayNumber}
          </h3>
          <span
            className={`text-sm font-medium ${
              isToday ? "text-primary/60" : "text-gray-400"
            }`}
          >
            {monthName}
          </span>
        </div>

        {/* Progress Bar */}
        {totalBlocks > 0 && (
          <div
            className={`mt-2 h-1.5 w-full rounded-full overflow-hidden ${
              isToday ? "bg-white/50" : "bg-gray-100"
            }`}
          >
            <div
              className={`h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 ${
                isToday && progressPercent > 0 ? "shadow-[0_0_10px_rgba(16,185,129,0.5)]" : ""
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Blocks */}
      <div className={`flex flex-col gap-2 flex-1 ${isToday ? "relative z-10" : ""}`}>
        {day.blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
            <span className="text-4xl mb-2 opacity-30">📅</span>
            <p className="text-gray-400 text-sm font-medium">No blocks planned</p>
          </div>
        ) : (
          day.blocks.map((block) => (
            <div
              key={block.id}
              // remove draggable, onDragStart, onDragEnd
              className={`group relative flex flex-col gap-3 rounded-2xl p-3 transition-all ${
                block.status === "done"
                  ? "bg-green-50/50 border border-green-100"
                  : isToday
                  ? "bg-white p-4 border border-primary/20 shadow-md shadow-primary/5"
                  : "bg-white border border-gray-200"
              } ${
                !isPast && block.status !== "done"
                  ? ""
                  : "cursor-not-allowed"
              }`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    block.status === "done"
                      ? "bg-green-200/40 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {block.subjectCode}
                </span>
                {block.status === "done" ? (
                  <span className="text-green-600 text-[18px]">✓</span>
                ) : (
                  !isPast && (
                    <span className="text-gray-300 group-hover:text-primary transition-colors text-lg">
                      ⋮⋮
                    </span>
                  )
                )}
              </div>
              <p
                className={`text-sm font-semibold ${
                  block.status === "done"
                    ? "line-through opacity-60 text-[#111118]"
                    : isToday
                    ? "text-base font-bold text-[#111118]"
                    : "text-[#111118]"
                }`}
              >
                {block.title}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <span className="text-[14px]">⏱</span>
                <span>{block.durationMin}m</span>
              </div>
            </div>
          ))
        )}

        {/* Drag indicator when dragging */}
        {/* Removed drag indicator */}
      </div>

      {/* Add Block Button */}
      {!isPast && (
        <button
          className={`mt-auto w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-1 transition-all ${
            isToday
              ? "bg-white border border-primary/20 text-primary shadow-sm shadow-primary/10 hover:shadow-md hover:bg-primary hover:text-white relative z-10"
              : "border-2 border-dashed border-gray-200 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5"
          }`}
          onClick={() => {
            alert(
              `Add block for ${dayName}, ${monthName} ${dayNumber}. Coming soon!`
            );
          }}
        >
          <span className="text-[18px]">+</span>
          Add Block
        </button>
      )}
    </div>
  );
}