"use client";

import type { Dispatch, SetStateAction } from "react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// ---- INLINE FIX FOR saveDayContext ----
type Mood = "low" | "normal" | "high";
type ExamPhase = "none" | "isa" | "esa";
type DayContext = {
  date: string;
  mood: Mood;
  examPhase: ExamPhase;
  isHoliday: boolean;
  isSick: boolean;
  bunkedClass: boolean;
};
function saveDayContext(context: DayContext) {
  try {
    localStorage.setItem("day_context", JSON.stringify(context));
  } catch { }
}
// ---- END PATCH ----

export default function DayContextPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const [mood, setMood] = useState<Mood>("normal");
  const [examPhase, setExamPhase] = useState<ExamPhase>("none");
  const [isHoliday, setIsHoliday] = useState(false);
  const [isSick, setIsSick] = useState(false);
  const [bunkedClass, setBunkedClass] = useState(false);

  const handleContinue = () => {
    const context: DayContext = {
      date: today,
      mood,
      examPhase,
      isHoliday,
      isSick,
      bunkedClass,
    };
    saveDayContext(context);
    router.push("/dashboard");
  };

  // <-- FIX: explicitly typed toggles array so TS knows children are strings only
  const toggles: {
    label: string;
    state: boolean;
    setter: Dispatch<SetStateAction<boolean>>;
  }[] = [
      { label: "Holiday", state: isHoliday, setter: setIsHoliday },
      { label: "Sick", state: isSick, setter: setIsSick },
      { label: "Bunked", state: bunkedClass, setter: setBunkedClass },
    ];

  return (
    <main className="min-h-screen flex items-start justify-center bg-[#f6f6f8] px-4 pt-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#e7ebf3] p-8 flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Quick check-in</h1>
          <p className="text-sm text-primary/70">This helps us plan today better.</p>
        </div>

        {/* Mood */}
        <div>
          <p className="text-sm font-medium mb-2">How’s your energy?</p>
          <div className="flex gap-2">
            {[
              ["low", "😔 Low"],
              ["normal", "🙂 Normal"],
              ["high", "🔥 High"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setMood(value as Mood)}
                className={`flex-1 h-10 rounded-full border text-sm font-medium transition
                  ${mood === value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-[#e7ebf3] hover:border-primary/50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Exam Phase */}
        <div>
          <p className="text-sm font-medium mb-2">Exam phase?</p>
          <div className="flex gap-2">
            {[
              ["none", "None"],
              ["isa", "ISA"],
              ["esa", "ESA"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setExamPhase(value as ExamPhase)}
                className={`flex-1 h-10 rounded-full border text-sm font-medium transition
                  ${examPhase === value
                    ? "border-primary bg-primary text-white"
                    : "border-[#e7ebf3] hover:border-primary/50"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles (inline, typed) */}
        <div className="grid grid-cols-3 gap-2">
          {toggles.map((t) => (
            <button
              key={t.label}
              onClick={() => t.setter(!t.state)}
              className={`h-10 rounded-lg border text-sm font-medium transition
                ${t.state
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-[#e7ebf3] hover:border-primary/50"
                }`}
              aria-pressed={t.state}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="h-12 bg-primary text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
        >
          Continue
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </main>
  );
}
