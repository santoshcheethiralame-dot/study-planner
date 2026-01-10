"use client";

import { useEffect, useState } from "react";

export function useDashboardData() {
    const [semester, setSemester] = useState<any>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [timetable, setTimetable] = useState<any[]>([]);

    useEffect(() => {
        try {
            setSemester(JSON.parse(localStorage.getItem("semester") || "null"));
            setSubjects(JSON.parse(localStorage.getItem("subjects") || "[]"));
            setTimetable(JSON.parse(localStorage.getItem("timetable") || "[]"));
        } catch { }
    }, []);

    return {
        semester,
        subjects,
        timetable,
    };
}
