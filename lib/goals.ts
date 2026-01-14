import { getTodayKey } from "./dayContext";

const GOALS_KEY = "harmony_goals_v1";

export interface Goals {
    daily: {
        targetBlocks: number;
        targetMinutes: number;
    };
    weekly: {
        targetBlocks: number;
        targetMinutes: number;
    };
}

export const DEFAULT_GOALS: Goals = {
    daily: {
        targetBlocks: 4,
        targetMinutes: 180, // 3 hours
    },
    weekly: {
        targetBlocks: 25,
        targetMinutes: 1200, // 20 hours
    },
};

export function getGoals(): Goals {
    try {
        const stored = localStorage.getItem(GOALS_KEY);
        return stored ? JSON.parse(stored) : DEFAULT_GOALS;
    } catch {
        return DEFAULT_GOALS;
    }
}

export function saveGoals(goals: Goals): void {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function getWeekProgress(): {
    blocksCompleted: number;
    minutesCompleted: number;
    weekStart: string;
} {
    const weekStart = getWeekStartDate();
    let blocksCompleted = 0;
    let minutesCompleted = 0;

    // Get all plans for this week
    for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        const dateKey = formatDate(date);

        try {
            const planKey = "harmony_today_plan_v1";
            const stored = localStorage.getItem(planKey);
            if (stored) {
                const data = JSON.parse(stored);
                if (data.date === dateKey && data.blocks) {
                    const completed = data.blocks.filter((b: any) => b.status === "done");
                    blocksCompleted += completed.length;
                    minutesCompleted += completed.reduce(
                        (sum: number, b: any) => sum + b.durationMin,
                        0
                    );
                }
            }
        } catch (e) {
            // Skip errors
        }
    }

    return {
        blocksCompleted,
        minutesCompleted,
        weekStart: formatDate(new Date(weekStart)),
    };
}

function getWeekStartDate(): Date {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    return new Date(today.setDate(diff));
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}