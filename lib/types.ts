// lib/types.ts

export type Mood = "low" | "normal" | "high";
export type ExamPhase = "none" | "isa" | "esa";

export type DayContext = {
    date: string; // YYYY-MM-DD
    mood: Mood;
    examPhase: ExamPhase;
    isHoliday: boolean;
    isSick: boolean;
    bunkedClass: boolean;
};

export type StudyBlock = {
    id: string;
    subject: string;
    unit: string;
    plannedMinutes: number;
    completedMinutes: number;
    status: "pending" | "in_progress" | "completed" | "skipped";
    reason: string;
};
