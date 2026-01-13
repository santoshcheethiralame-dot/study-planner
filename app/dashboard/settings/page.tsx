"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/card";

export default function SettingsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);

  // Load existing data
  useEffect(() => {
    setSubjects(JSON.parse(localStorage.getItem("subjects") || "[]"));
    setTimetable(JSON.parse(localStorage.getItem("timetable") || "[]"));
  }, []);

  const saveSubjects = (updated: any[]) => {
    setSubjects(updated);
    localStorage.setItem("subjects", JSON.stringify(updated));
  };

  const deleteSubject = (name: string) => {
    const updated = subjects.filter(s => s.name !== name);
    saveSubjects(updated);
  };

  const deleteClass = (id: string) => {
    const updated = timetable.filter(c => c.id !== id);
    setTimetable(updated);
    localStorage.setItem("timetable", JSON.stringify(updated));
  };

  const factoryReset = () => {
    if (confirm("This will delete ALL data and take you back to onboarding. Are you sure?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  // 1. Group the classes by day
  const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const groupedClasses = daysOrder.reduce((acc, day) => {
    const dayClasses = timetable
      .filter((c) => c.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));

    if (dayClasses.length > 0) acc[day] = dayClasses;
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <main className="p-10 max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-neutral-500">Manage your semester data</p>
      </header>

      {/* Subject Management */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">book</span> Subjects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((s) => (
            <Card key={s.name} className="flex justify-between items-center p-4">
              <div>
                <p className="font-bold">{s.name}</p>
                <p className="text-xs text-primary font-mono uppercase">{s.code}</p>
              </div>
              <button onClick={() => deleteSubject(s.name)} className="text-neutral-300 hover:text-red-500">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </Card>
          ))}
        </div>
      </section>

      {/* Timetable Management */}
      <section>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">schedule</span> Class Schedule
        </h2>
        <div className="space-y-8">
          {daysOrder.map((day) => {
            const classes = groupedClasses[day];
            if (!classes) return null; // Don't show empty days
            return (
              <div key={day} className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 ml-1">
                  {day}
                </h3>
                <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-neutral-100">
                      {classes.map((c) => (
                        <tr key={c.id} className="hover:bg-neutral-50/50 group">
                          <td className="px-6 py-4 font-mono text-primary font-bold w-24">
                            {c.time}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-neutral-900">{c.subjectName}</div>
                            <div className="text-xs text-neutral-400">{c.location || "No location"}</div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => deleteClass(c.id)} 
                              className="text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="pt-10 border-t border-neutral-200">
        <button 
          onClick={factoryReset}
          className="text-red-500 text-sm font-medium flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-xl transition"
        >
          <span className="material-symbols-outlined text-sm">restart_alt</span>
          Reset All Application Data
        </button>
      </div>
    </main>
  );
}