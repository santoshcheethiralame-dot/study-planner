// lib/dayContext.ts
import { DAY_CONTEXT_KEY } from "./constants";
import type { DayContext } from "./types";

export function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
}

// Logic: Always store as a dictionary { "2026-01-13": { ...data } }
export function saveDayContext(context: DayContext) {
    if (typeof window === "undefined") return;
    const all = getAllDayContexts();
    all[getTodayKey()] = context;
    localStorage.setItem(DAY_CONTEXT_KEY, JSON.stringify(all));
}

export function getTodayContext(): DayContext | null {
    if (typeof window === "undefined") return null;
    const all = getAllDayContexts();
    return all[getTodayKey()] ?? null;
}

function getAllDayContexts(): Record<string, DayContext> {
    try {
        return JSON.parse(localStorage.getItem(DAY_CONTEXT_KEY) || "{}");
    } catch {
        return {};
    }
}

export function hasTodayContext(): boolean {
    return !!getTodayContext();
}