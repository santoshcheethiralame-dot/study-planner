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

  

export type StudyBlock = {
    id: string;
    subjectCode: string;
    title: string;
    durationMin: number;
    type: "study" | "revision" | "exam" | "break";
    status: "pending" | "active" | "done";
  };
  