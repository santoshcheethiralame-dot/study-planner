"use client";

import { useEffect, useState, useCallback } from "react";
import { generateTodayPlan } from "@/lib/generateTodayplan";
import { useTodayContext } from "./useTodayContext";
import type { StudyBlock } from "@/lib/types";
import { getTodayKey } from "@/lib/dayContext";

const PLAN_STORAGE_KEY = "harmony_today_plan_v1";

export function useTodayPlan() {
  const { context, ready: contextReady } = useTodayContext();
  const [plan, setPlan] = useState<StudyBlock[] | null>(null);
  const [ready, setReady] = useState(false);

  // 1. Load or Generate Plan
  useEffect(() => {
    if (!contextReady || !context) return;

    const todayKey = getTodayKey();
    const stored = localStorage.getItem(PLAN_STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if the stored plan is for TODAY. If yes, use it.
      if (parsed.date === todayKey) {
        setPlan(parsed.blocks);
        setReady(true);
        return;
      }
    }

    // If no plan or old plan: Generate New
    const storedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]");
    const newBlocks = generateTodayPlan(context, storedSubjects);

    // Save to storage
    const payload = { date: todayKey, blocks: newBlocks };
    localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(payload));

    setPlan(newBlocks);
    setReady(true);
  }, [contextReady, context]);

  // 1. Action: Delete a block
  const deleteBlock = useCallback((blockId: string) => {
    setPlan((prev) => {
      if (!prev) return null;
      const updated = prev.filter((b) => b.id !== blockId);
      const todayKey = getTodayKey();
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify({
        date: todayKey,
        blocks: updated
      }));
      return updated;
    });
  }, []);

  // 2. Action: Add a new custom block WITH SCHEDULED TIME
  const addBlock = useCallback((title: string, duration: number, subjectCode: string) => {
    setPlan((prev) => {
      const now = new Date();
      const lastBlock = prev?.[prev.length - 1];

      // Calculate scheduled time based on last block
      let scheduledTime = "09:00";
      if (lastBlock && (lastBlock as any).scheduledTime) {
        const [hours, minutes] = (lastBlock as any).scheduledTime.split(':').map(Number);
        const lastBlockEnd = new Date();
        lastBlockEnd.setHours(hours, minutes + lastBlock.durationMin);

        scheduledTime = `${lastBlockEnd.getHours().toString().padStart(2, '0')}:${lastBlockEnd.getMinutes().toString().padStart(2, '0')}`;
      }

      const newBlock: StudyBlock = {
        id: `block_${Date.now()}`,
        title,
        subjectCode,
        durationMin: duration,
        status: "pending",
        createdAt: now.toISOString(),
        scheduledTime, // ADD THIS
      };

      const updated = prev ? [...prev, newBlock] : [newBlock];
      const todayKey = getTodayKey();
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify({
        date: todayKey,
        blocks: updated
      }));
      return updated;
    });
  }, []);

  // Retain the existing action for marking a block as done, but add completedAt timestamp and update day-specific storage
  const completeBlock = (blockId: string) => {
    setPlan((prev) => {
      if (!prev) return null;

      return prev.map((block) =>
        block.id === blockId
          ? {
              ...block,
              status: "done" as const,
              completedAt: new Date().toISOString(),
            }
          : block
      );
    });

    // Also update localStorage with the timestamp
    try {
      const today = new Date().toISOString().slice(0, 10);
      const key = `harmony_today_plan_${today}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const data = JSON.parse(stored);
        data.blocks = data.blocks.map((b: StudyBlock) =>
          b.id === blockId
            ? { ...b, status: "done", completedAt: new Date().toISOString() }
            : b
        );
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      console.error("Failed to save completion timestamp", e);
    }
  };

  return { ready, plan, completeBlock, deleteBlock, addBlock };
}