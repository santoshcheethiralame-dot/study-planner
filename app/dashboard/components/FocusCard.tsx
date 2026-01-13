"use client";

import type { StudyBlock } from "@/lib/types";

interface FocusCardProps {
  next: StudyBlock;
  onStart: () => void;
}

export function FocusCard({ next, onStart }: FocusCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
            ⚡ Up Next
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            {next.title}
          </h2>
          <div className="flex items-center gap-4 text-neutral-600">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {next.durationMin} minutes
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">bookmark</span>
              {next.subjectCode}
            </span>
          </div>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-2xl">
          <span className="material-symbols-outlined text-4xl">school</span>
        </div>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
      >
        <span className="material-symbols-outlined group-hover:animate-pulse">play_circle</span>
        Start Focus Session
      </button>
    </div>
  );
}