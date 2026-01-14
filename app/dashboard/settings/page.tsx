"use client";

import { useState, useEffect } from "react";
import { useGoals } from "@/hooks/useGoals";
import { useToast } from "@/contexts/ToastContext";
import type { Goals } from "@/lib/goals";

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { goals, updateGoals } = useGoals();
  const { showToast } = useToast();
  const [localGoals, setLocalGoals] = useState<Goals | null>(null);

  useEffect(() => {
    setMounted(true);
    if (goals) {
      setLocalGoals(goals);
    }
  }, [goals]);

  if (!mounted || !localGoals) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSave = () => {
    updateGoals(localGoals);
    showToast("Settings saved successfully!", "success");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings?")) {
      localStorage.clear();
      showToast("All data cleared. Redirecting to onboarding...", "info");
      setTimeout(() => {
        window.location.href = "/onboarding/semester";
      }, 2000);
    }
  };

  const handleExport = () => {
    const data = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      data: {
        dayContexts: localStorage.getItem("harmony_day_context_v1"),
        subjects: localStorage.getItem("subjects"),
        plans: localStorage.getItem("harmony_today_plan_v1"),
        goals: localStorage.getItem("harmony_goals_v1"),
        streak: localStorage.getItem("harmony_streak_v1"),
        notes: localStorage.getItem("harmony_block_notes_v1"),
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `harmony-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup downloaded!", "success");
  };

  return (
    <main className="px-6 md:px-12 py-10 bg-[#f6f6f8] min-h-screen max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-neutral-600">Customize your study experience</p>
      </header>

      {/* Daily Goals */}
      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📊 Daily Goals</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Target Blocks Per Day
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={localGoals.daily.targetBlocks}
              onChange={(e) =>
                setLocalGoals({
                  ...localGoals,
                  daily: {
                    ...localGoals.daily,
                    targetBlocks: parseInt(e.target.value) || 1,
                  },
                })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Target Minutes Per Day
            </label>
            <input
              type="number"
              min="30"
              max="480"
              step="30"
              value={localGoals.daily.targetMinutes}
              onChange={(e) =>
                setLocalGoals({
                  ...localGoals,
                  daily: {
                    ...localGoals.daily,
                    targetMinutes: parseInt(e.target.value) || 30,
                  },
                })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {Math.floor(localGoals.daily.targetMinutes / 60)}h{" "}
              {localGoals.daily.targetMinutes % 60}m
            </p>
          </div>
        </div>
      </section>

      {/* Weekly Goals */}
      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📅 Weekly Goals</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Target Blocks Per Week
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={localGoals.weekly.targetBlocks}
              onChange={(e) =>
                setLocalGoals({
                  ...localGoals,
                  weekly: {
                    ...localGoals.weekly,
                    targetBlocks: parseInt(e.target.value) || 5,
                  },
                })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Target Minutes Per Week
            </label>
            <input
              type="number"
              min="180"
              max="3000"
              step="60"
              value={localGoals.weekly.targetMinutes}
              onChange={(e) =>
                setLocalGoals({
                  ...localGoals,
                  weekly: {
                    ...localGoals.weekly,
                    targetMinutes: parseInt(e.target.value) || 180,
                  },
                })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {Math.floor(localGoals.weekly.targetMinutes / 60)}h{" "}
              {localGoals.weekly.targetMinutes % 60}m
            </p>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">💾 Data Management</h2>
        
        <div className="space-y-3">
          <button
            onClick={handleExport}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            <span>📥</span>
            Export Backup
          </button>

          <button
            onClick={handleReset}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            <span>🗑️</span>
            Clear All Data
          </button>
        </div>

        <p className="text-xs text-neutral-500 mt-4">
          Export creates a JSON backup of all your data. Clear All Data will delete
          everything and restart onboarding.
        </p>
      </section>

      {/* About */}
      <section className="bg-white rounded-2xl border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">ℹ️ About</h2>
        <div className="space-y-2 text-sm text-neutral-600">
          <p>
            <strong>Harmony Planner</strong> v1.0.0
          </p>
          <p>A smart study planning app for students</p>
          <p className="text-xs text-neutral-400 mt-4">
            Built with Next.js, React, and Tailwind CSS
          </p>
        </div>
      </section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg transition shadow-lg"
      >
        💾 Save Settings
      </button>
    </main>
  );
}