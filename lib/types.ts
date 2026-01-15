// lib/types.ts


export type DayContext = {
  date: string; // YYYY-MM-DD
  mood: "low" | "normal" | "high";
  examPhase: "none" | "ISA" | "ESA";
  specials: {
    holiday: boolean;
    sick: boolean;
    bunked: boolean;
  };
  plan?: StudyBlock[];
};


export type Mood = "low" | "normal" | "high";
export type ExamPhase = "none" | "isa" | "esa";

export interface StudyBlock {
  id: string;
  title: string;
  subjectCode: string;
  durationMin: number;
  status: "pending" | "done" | "skipped";
  createdAt: string; // ISO timestamp when block was created
  completedAt?: string; // ISO timestamp when marked done
  scheduledTime?: string; // HH:MM format (e.g., "09:00")
}
  