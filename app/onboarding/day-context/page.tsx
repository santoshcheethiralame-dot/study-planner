"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingGuard } from "@/hooks/onBoardingGuard";
import { DAY_CONTEXT_KEY } from "@/lib/constants";

type Mood = "low" | "normal" | "high";
type ExamPhase = "none" | "ISA" | "ESA";

const helperMessages = {
  normal_none: "We’ll plan a steady, balanced study day.",
  normal_exam: "We’ll focus on exams while keeping load balanced.",
  high_none: "We’ll plan ambitious blocks while energy is high.",
  high_exam: "We’ll push key exam topics while energy is high.",
  low_none: "We’ll keep today light and focus on essentials.",
  low_exam: "We’ll prioritise exams but keep the load light.",
  default: "Tell us how today feels — we’ll plan the rest.",
};

// Bar: Highlighted side bar
function SideBar() {
  return (
    <div className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full bg-primary/30 pointer-events-none" />
  );
}

// Helper: Shows the contextual helper text
function Helper({ text }: { text: string }) {
  return (
    <p className="text-sm mt-1 min-h-[22px] text-primary/70 text-center">{text}</p>
  );
}

// Card: Main interactive content
function DayContextCard({
  mood,
  setMoodAndTouch,
  examPhase,
  setExamAndTouch,
  specials,
  toggleSpecial,
}: {
  mood: Mood;
  setMoodAndTouch: (m: Mood) => void;
  examPhase: ExamPhase;
  setExamAndTouch: (e: ExamPhase) => void;
  specials: { holiday: boolean; sick: boolean; bunked: boolean };
  toggleSpecial: (key: keyof typeof specials) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Mood */}
      <section className="flex flex-col gap-1">
        <label className="text-sm font-medium">How are you feeling?</label>

        <div className="flex gap-2">
          <button
            type="button"
            aria-pressed={mood === "low"}
            onClick={() => setMoodAndTouch("low")}
            onKeyDown={(e) => e.key === "Enter" && setMoodAndTouch("low")}
            className={`flex-1 h-10 rounded-full text-sm font-medium border transition ${mood === "low"
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-white border-[#e2e4e9] text-[#0e121b]"
              }`}
          >
            Low 😔
          </button>

          <button
            type="button"
            aria-pressed={mood === "normal"}
            onClick={() => setMoodAndTouch("normal")}
            onKeyDown={(e) => e.key === "Enter" && setMoodAndTouch("normal")}
            className={`flex-1 h-10 rounded-full text-sm font-medium border transition ${mood === "normal"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-white border-[#e2e4e9] text-[#0e121b]"
              }`}
          >
            Normal 🙂
          </button>

          <button
            type="button"
            aria-pressed={mood === "high"}
            onClick={() => setMoodAndTouch("high")}
            onKeyDown={(e) => e.key === "Enter" && setMoodAndTouch("high")}
            className={`flex-1 h-10 rounded-full text-sm font-medium border transition ${mood === "high"
                ? "bg-green-50 border-green-500 text-green-700"
                : "bg-white border-[#e2e4e9] text-[#0e121b]"
              }`}
          >
            High 🔥
          </button>
        </div>
      </section>

      {/* Exam phase */}
      <section className="flex flex-col gap-1">
        <label className="text-sm font-medium">Any exams going on?</label>

        <div className="flex gap-2">
          <button
            type="button"
            aria-pressed={examPhase === "none"}
            onClick={() => setExamAndTouch("none")}
            onKeyDown={(e) => e.key === "Enter" && setExamAndTouch("none")}
            className={`flex-1 h-10 rounded-full text-sm font-medium border transition ${examPhase === "none"
                ? "bg-primary/10 border-primary text-primary"
                : "bg-white border-[#e2e4e9] text-[#0e121b]"
              }`}
          >
            None
          </button>

          <button
            type="button"
            aria-pressed={examPhase === "ISA"}
            onClick={() => setExamAndTouch("ISA")}
            onKeyDown={(e) => e.key === "Enter" && setExamAndTouch("ISA")}
            className={`flex-1 h-10 rounded-full text-sm font-medium border transition ${examPhase === "ISA"
                ? "bg-amber-100 text-amber-700 border-amber-300"
                : "bg-white border-[#e2e4e9] text-[#0e121b]"
              }`}
          >
            ISA
          </button>

          <button
            type="button"
            aria-pressed={examPhase === "ESA"}
            onClick={() => setExamAndTouch("ESA")}
            onKeyDown={(e) => e.key === "Enter" && setExamAndTouch("ESA")}
            className={`flex-1 h-10 rounded-full text-sm font-medium border transition ${examPhase === "ESA"
                ? "bg-rose-100 text-rose-700 border-rose-300"
                : "bg-white border-[#e2e4e9] text-[#0e121b]"
              }`}
          >
            ESA
          </button>
        </div>
      </section>

      {/* Specials: stable grid for layout */}
      <section className="flex flex-col gap-1">
        <label className="text-sm font-medium">Anything special today?</label>
        <div className="mt-1 grid grid-cols-3 gap-3 sm:grid-cols-3">
          <button
            type="button"
            aria-pressed={specials.holiday}
            onClick={() => toggleSpecial("holiday")}
            onKeyDown={(e) => e.key === "Enter" && toggleSpecial("holiday")}
            className={`w-full h-9 px-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition ${specials.holiday
                ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                : "bg-white border-[#e2e4e9] text-[#0e121b]"
              }`}
          >
            <span className="material-symbols-outlined text-[16px]">calendar_month</span>
            Holiday
          </button>
          <button
            type="button"
            aria-pressed={specials.sick}
            onClick={() => toggleSpecial("sick")}
            onKeyDown={(e) => e.key === "Enter" && toggleSpecial("sick")}
            className={`w-full h-9 px-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition ${specials.sick
                ? "bg-rose-50 border-rose-300 text-rose-600"
                : "bg-white border-[#e2e4e9] text-[#0e121b]"
              }`}
          >
            <span className="material-symbols-outlined text-[16px]">sick</span>
            Sick
          </button>
          <button
            type="button"
            aria-pressed={specials.bunked}
            onClick={() => toggleSpecial("bunked")}
            onKeyDown={(e) => e.key === "Enter" && toggleSpecial("bunked")}
            className={`w-full h-9 px-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition ${specials.bunked
                ? "bg-primary/10 border-primary text-primary"
                : "bg-white border-[#e2e4e9] text-[#0e121b]"
              }`}
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            Bunked
          </button>
        </div>
      </section>
    </div>
  )
}

// Continue: Continue button/CTA
function ContinueButton({
  onContinue,
  loadingSave,
  isPrefilled
}: {
  onContinue: () => void;
  loadingSave: boolean;
  isPrefilled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onContinue}
      disabled={loadingSave}
      aria-disabled={loadingSave}
      className={`w-full h-12 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${loadingSave
          ? "bg-primary/70 text-white cursor-wait"
          : "bg-primary text-white hover:bg-primary/90"
        }`}
    >
      {isPrefilled ? "Update & continue" : "Continue to dashboard"}
      <span className="material-symbols-outlined">arrow_forward</span>
    </button>
  );
}

export default function DayContextPage() {
  useOnboardingGuard("require");
  const router = useRouter();
  const [mood, setMood] = useState<Mood>("normal");
  const [examPhase, setExamPhase] = useState<ExamPhase>("none");
  const [specials, setSpecials] = useState({
    holiday: false,
    sick: false,
    bunked: false,
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DAY_CONTEXT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.date === todayKey()) {
        setMood(parsed.mood ?? "normal");
        setExamPhase(parsed.examPhase ?? "none");
        setSpecials(parsed.specials ?? specials);
        setIsPrefilled(true);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSpecial = (key: keyof typeof specials) =>
    setSpecials((s) => ({ ...s, [key]: !s[key] }));

  const handleContinue = () => {
    if (loadingSave) return;
    setLoadingSave(true);
    try {
      localStorage.setItem(DAY_CONTEXT_KEY, JSON.stringify({
        date: todayKey(),
        mood,
        examPhase,
        specials
      }));
    } finally {
      setTimeout(() => {
        setLoadingSave(false);
        router.push("/dashboard");
      }, 160);
    }
  };

  const getHelperText = () => {
    if (!userInteracted) return helperMessages.default;
    if (mood === "normal" && examPhase === "none") return helperMessages.normal_none;
    if (mood === "normal") return helperMessages.normal_exam;
    if (mood === "high" && examPhase === "none") return helperMessages.high_none;
    if (mood === "high") return helperMessages.high_exam;
    if (mood === "low" && examPhase === "none") return helperMessages.low_none;
    return helperMessages.low_exam;
  };

  function setMoodAndTouch(m: Mood) {
    setUserInteracted(true);
    setMood(m);
  }
  function setExamAndTouch(e: ExamPhase) {
    setUserInteracted(true);
    setExamPhase(e);
  }

  return (
    <main className="flex-1 flex items-center justify-center px-6 min-h-screen">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl border border-[#e7ebf3] p-12 sm:p-14 relative">
          {/* Side bar */}
          <SideBar />
          {/* Top title & helper */}
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <h1 className="text-3xl md:text-3xl font-bold tracking-tight">
                Quick check-in for today
              </h1>
              <Helper text={getHelperText()} />
            </div>
            {/* Interactive card section */}
            <DayContextCard
              mood={mood}
              setMoodAndTouch={setMoodAndTouch}
              examPhase={examPhase}
              setExamAndTouch={setExamAndTouch}
              specials={specials}
              toggleSpecial={toggleSpecial}
            />
            {/* Continue button */}
            <div>
              <ContinueButton
                onContinue={handleContinue}
                loadingSave={loadingSave}
                isPrefilled={isPrefilled}
              />
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-[#94a3b8] text-center">
          Harmony Planner © {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
