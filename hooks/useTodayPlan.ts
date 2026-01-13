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

  // 2. Action: Add a new custom block
  const addBlock = useCallback((title: string, duration: number, subjectCode: string) => {
    setPlan((prev) => {
      const newBlock: StudyBlock = {
        id: Math.random().toString(36).substring(2, 11),
        title,
        durationMin: duration,
        subjectCode,
        type: "study",
        status: "pending"
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

  // Retain the existing action for marking a block as done
  const completeBlock = useCallback((blockId: string) => {
    setPlan((prev) => {
      if (!prev) return null;
      
      const updated = prev.map((b) => 
        b.id === blockId ? { ...b, status: "done" as const } : b
      );
      
      const todayKey = getTodayKey();
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify({ 
        date: todayKey, 
        blocks: updated 
      }));

      return updated;
    });
  }, []);

  return { ready, plan, completeBlock, deleteBlock, addBlock };
}