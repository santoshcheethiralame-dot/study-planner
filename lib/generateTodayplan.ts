import type { DayContext, StudyBlock } from "@/lib/types";

// Keep your safe UUID fallback from before
const generateId = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

export function generateTodayPlan(context: DayContext, subjects: any[]): StudyBlock[] {
  // Fallback if user somehow has no subjects
  const availableSubjects = subjects.length > 0 
    ? subjects.filter(s => s.name.trim() !== "") // only use valid subjects
    : [{ name: "General Study", code: "GEN" }];

  const baseLoad =
    context.mood === "high" ? 5 :
    context.mood === "normal" ? 4 : 3;

  const blocks: StudyBlock[] = [];

  for (let i = 0; i < baseLoad; i++) {
    // This cycles through your subjects (Subject 1, Subject 2, etc.)
    const subject = availableSubjects[i % availableSubjects.length];

    blocks.push({
      id: generateId(),
      subjectCode: subject.code || "N/A",
      title: context.examPhase !== "none" 
        ? `Exam Prep: ${subject.name}` 
        : `Focus: ${subject.name}`,
      durationMin: context.mood === "low" ? 30 : 50,
      type: context.examPhase !== "none" ? "exam" : "study",
      status: i === 0 ? "active" : "pending",
    });
  }

  return blocks;
}