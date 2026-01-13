"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/card";
import { getTodayKey } from "@/lib/dayContext";

export default function PlannerPage() {
  const [weeklyOverview, setWeeklyOverview] = useState<any[]>([]);
  const todayKey = getTodayKey();

  useEffect(() => {
    // For now, we show the current week's status
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const planData = JSON.parse(localStorage.getItem("harmony_today_plan_v1") || "{}");
    
    setWeeklyOverview(days.map(day => ({
      name: day,
      isToday: new Date().toLocaleDateString('en-US', { weekday: 'short' }) === day,
      hasPlan: planData.date ? true : false // We'll expand this for full weekly storage later
    })));
  }, []);

  return (
    <main className="p-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Weekly Planner</h1>
        <p className="text-neutral-500">View and manage your long-term study schedule</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weeklyOverview.map((day) => (
          <div key={day.name} className="space-y-4">
            <div className={`text-center p-2 rounded-lg font-bold text-sm ${day.isToday ? 'bg-primary text-white' : 'text-neutral-400'}`}>
              {day.name}
            </div>
            
            <Card className={`h-64 border-dashed flex flex-col items-center justify-center p-4 text-center ${day.isToday ? 'border-primary/30 bg-primary/5' : 'border-neutral-200'}`}>
              {day.isToday ? (
                <>
                  <span className="material-symbols-outlined text-primary mb-2">event_repeat</span>
                  <p className="text-xs font-medium text-primary">Active Plan</p>
                  <button 
                    onClick={() => {
                      if(confirm("Regenerate today's plan? Current progress will be lost.")) {
                        localStorage.removeItem("harmony_today_plan_v1");
                        window.location.href = "/dashboard";
                      }
                    }}
                    className="mt-4 text-[10px] uppercase font-bold tracking-widest text-neutral-400 hover:text-red-500 transition"
                  >
                    Reset Plan
                  </button>
                </>
              ) : (
                <p className="text-[10px] text-neutral-300 font-bold uppercase">No Plan Yet</p>
              )}
            </Card>
          </div>
        ))}
      </div>

      <section className="mt-12 bg-white rounded-3xl p-8 border border-neutral-200">
        <h3 className="font-bold text-lg mb-4">Semester Goals</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
               <span className="material-symbols-outlined text-sm">auto_awesome</span>
            </div>
            <div>
              <p className="text-sm font-bold">Smart Load Balancing</p>
              <p className="text-xs text-neutral-500">Your plans are currently optimized for "Normal" mood.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}