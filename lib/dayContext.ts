// lib/dayContext.ts
import type { DayContext } from "./types";

// Exported functions for managing day context

const STORAGE_KEY = "day_context";

export function getTodayKey() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function saveDayContext(context: DayContext) {
    const all = getAllDayContexts();
    all[context.date] = context;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getTodayContext(): DayContext | null {
    const all = getAllDayContexts();
    return all[getTodayKey()] ?? null;
}

export function hasTodayContext(): boolean {
    return !!getTodayContext();
}

function getAllDayContexts(): Record<string, DayContext> {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}
