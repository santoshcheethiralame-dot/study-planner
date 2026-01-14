import { getTodayKey } from "./dayContext";
import type { StudyBlock, DayContext } from "./types";

const WEEK_PLAN_KEY = "harmony_week_plan_v1";

export interface DayPlan {
  date: string;
  blocks: StudyBlock[];
  context?: DayContext;
}

export function getWeekPlan(startDate?: Date): DayPlan[] {
  const start = startDate || getWeekStart();
  const days: DayPlan[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateKey = formatDate(date);

    days.push({
      date: dateKey,
      blocks: getDayBlocks(dateKey),
      context: getDayContext(dateKey),
    });
  }

  return days;
}

function getWeekStart(): Date {
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

function getDayBlocks(date: string): StudyBlock[] {
  try {
    const stored = localStorage.getItem("harmony_today_plan_v1");
    if (!stored) return [];
    const data = JSON.parse(stored);
    return data.date === date ? data.blocks : [];
  } catch {
    return [];
  }
}

function getDayContext(date: string): DayContext | undefined {
  try {
    const stored = localStorage.getItem("harmony_day_context_v1");
    if (!stored) return undefined;
    const contexts = JSON.parse(stored);
    return contexts[date];
  } catch {
    return undefined;
  }
}

export function saveDayBlocks(date: string, blocks: StudyBlock[]) {
  const key = "harmony_today_plan_v1";
  localStorage.setItem(key, JSON.stringify({ date, blocks }));
}

export function moveBlockBetweenDays(
  blockId: string,
  fromDate: string,
  toDate: string
): boolean {
  const fromBlocks = getDayBlocks(fromDate);
  const toBlocks = getDayBlocks(toDate);

  const blockIndex = fromBlocks.findIndex((b) => b.id === blockId);
  if (blockIndex === -1) return false;

  const [block] = fromBlocks.splice(blockIndex, 1);
  toBlocks.push(block);

  saveDayBlocks(fromDate, fromBlocks);
  saveDayBlocks(toDate, toBlocks);

  return true;
}