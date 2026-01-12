import { DayContext } from "@/lib/types";

export function TodayHeader({ context }: { context: DayContext }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Good day 👋
      </h1>
      <p className="text-sm text-[#4e6797]">
        Mood: {context.mood} · Exams: {context.examPhase}
      </p>
    </div>
  );
}
