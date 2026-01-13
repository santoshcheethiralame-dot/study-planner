"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTodayContext } from "@/hooks/useTodayContext";
import { useTodayPlan } from "@/hooks/useTodayPlan";
import { TodayHeader } from "../components/TodayHeader";
import { FocusCard } from "../components/FocusCard";
import { UpcomingList } from "../components/UpcomingList";
import { FocusSession } from "../components/FocusSession";
import { StudyBlock } from "@/lib/types";
import { TimetableWidget } from "../components/TimetableWidget";
import { useStats } from "@/hooks/useStats";
import Card from "@/components/ui/card";

export default function DashboardPage() {
    const router = useRouter();
    const { context, ready } = useTodayContext();
    const { plan, completeBlock, deleteBlock, addBlock } = useTodayPlan();
    const [activeBlock, setActiveBlock] = useState<StudyBlock | null>(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [breakTime, setBreakTime] = useState<number | null>(null);

    const { completionRate, totalMinutes, blocksDone, totalPlanned } = useStats();

    // ... (Your existing useEffect guard)
    // Re-add your existing guard here if you lost it.

    if (!ready || !context || !plan) return <div>Loading...</div>;

    const nextBlock = plan.find(b => b.status !== "done");

    const handleQuickAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        addBlock(newTaskTitle, 45, "MISC");
        setNewTaskTitle("");
    };

    return (
        <main className="p-10 max-w-5xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-bold">Your Progress</h1>
                <p className="text-neutral-500">How your study habits are trending</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col gap-2 p-8">
                    <span className="text-neutral-500 text-sm font-medium">Daily Completion</span>
                    <div className="text-4xl font-bold text-primary">{completionRate}%</div>
                    <div className="w-full bg-neutral-100 h-2 rounded-full mt-2">
                        <div
                            className="bg-primary h-full rounded-full transition-all duration-1000"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                </Card>

                <Card className="p-8">
                    <span className="text-neutral-500 text-sm font-medium">Blocks Completed</span>
                    <div className="text-4xl font-bold text-neutral-900">{blocksDone} / {totalPlanned}</div>
                    <p className="text-xs text-neutral-400 mt-2">Items cleared from your plan</p>
                </Card>

                <Card className="p-8">
                    <span className="text-neutral-500 text-sm font-medium">Total Focus Time</span>
                    <div className="text-4xl font-bold text-neutral-900">{totalMinutes}m</div>
                    <p className="text-xs text-neutral-400 mt-2">Minutes of pure concentration</p>
                </Card>
            </div>

            <div className="mt-10 bg-white border border-neutral-200 rounded-3xl p-20 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-amber-500">military_tech</span>
                </div>
                <h3 className="text-xl font-bold">Consistency Streak</h3>
                <p className="text-neutral-500 mt-2">Finish all blocks 3 days in a row to unlock your first badge.</p>
            </div>
        </main>
    );
}