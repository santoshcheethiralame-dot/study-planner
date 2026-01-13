"use client";

import { useEffect, useState } from "react";

export type ClassSession = {
  id: string;
  subjectName: string;
  location: string;
  day: string;
  time: string;
  color?: string;
};

export function useTodaysClasses() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get today's day name (matching the "Mon", "Tue" format from onboarding)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const todayName = days[new Date().getDay()];

    // 2. Fetch all classes
    try {
      const all: ClassSession[] = JSON.parse(localStorage.getItem("timetable") || "[]");
      
      // 3. Filter for today
      const todayClasses = all.filter((c) => c.day === todayName);

      // 4. Sort by time (e.g. "09:00" before "10:00")
      todayClasses.sort((a, b) => a.time.localeCompare(b.time));

      setClasses(todayClasses);
    } catch (e) {
      console.error("Failed to load classes", e);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { classes, loading };
}