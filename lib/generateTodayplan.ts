// lib/generateTodayPlan.ts
import type { DayContext } from "@/lib/types";
import type { StudyBlock } from "@/lib/types";

export function generateTodayPlan(
  context: DayContext
): StudyBlock[] {
  const baseLoad =
    context.mood === "high" ? 5 :
    context.mood === "normal" ? 4 : 3;

  const blocks: StudyBlock[] = [];

  for (let i = 0; i < baseLoad; i++) {
    blocks.push({
      id: crypto.randomUUID(),
      subjectCode: "CS101",
      title:
        context.examPhase !== "none"
          ? "Exam-focused revision"
          : "Focused study block",
      durationMin:
        context.mood === "low" ? 30 : 50,
      type:
        context.examPhase !== "none" ? "exam" : "study",
      status: i === 0 ? "active" : "pending",
    });
  }

  return blocks;
}
