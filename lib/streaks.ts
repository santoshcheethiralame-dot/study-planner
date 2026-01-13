import { getTodayKey } from "./dayContext";

const STREAK_KEY = "harmony_streak_v1";

export interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastCompletedDate: string | null;
    history: string[]; // Array of YYYY-MM-DD dates
}

export function getStreakData(): StreakData {
    try {
        const stored = localStorage.getItem(STREAK_KEY);
        if (!stored) {
            return {
                currentStreak: 0,
                longestStreak: 0,
                lastCompletedDate: null,
                history: [],
            };
        }
        return JSON.parse(stored);
    } catch {
        return {
            currentStreak: 0,
            longestStreak: 0,
            lastCompletedDate: null,
            history: [],
        };
    }
}

export function updateStreak(): StreakData {
    const today = getTodayKey();
    const data = getStreakData();

    // Already updated today
    if (data.lastCompletedDate === today) {
        return data;
    }

    // Check if yesterday was completed
    const yesterday = getYesterdayKey();
    const wasYesterdayCompleted = data.lastCompletedDate === yesterday;

    let newStreak: number;
    if (wasYesterdayCompleted) {
        // Continue streak
        newStreak = data.currentStreak + 1;
    } else if (data.lastCompletedDate === null) {
        // First day
        newStreak = 1;
    } else {
        // Streak broken, restart
        newStreak = 1;
    }

    const updated: StreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, data.longestStreak),
        lastCompletedDate: today,
        history: [...data.history, today],
    };

    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return updated;
}

function getYesterdayKey(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}