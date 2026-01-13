import React from "react";
import { useFocusTimer } from "@/hooks/useFocusTimer";
import type { StudyBlock } from "@/lib/types";

interface FocusSessionProps {
    block: StudyBlock;
    onExit: () => void;
    onComplete: () => void;
}

export function FocusSession({ block, onExit, onComplete }: FocusSessionProps) {
    // TEMP: Always use 1 minute for the timer
    const { timeLeft, isActive, toggleTimer, formatTime } = useFocusTimer(
        1,
        onComplete
    );

    // Progress for 1 min timer (60 seconds)
    const progress = ((60 - timeLeft) / 60) * 100;

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6">
            {/* Subject Badge */}
            <div className="mb-8 flex flex-col items-center gap-2">
                <span className="text-sm font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {block.subjectCode}
                </span>
                <h2 className="text-2xl font-semibold text-neutral-900">{block.title}</h2>
            </div>

            {/* Timer Display */}
            <div className="relative flex items-center justify-center w-64 h-64">
                {/* Breathing background pulse when active */}
                {isActive && (
                    <div className="absolute inset-0 bg-primary/5 rounded-full animate-ping opacity-20" />
                )}

                {/* Progress Ring */}
                <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="128" cy="128" r="120" stroke="#e2e4e9" strokeWidth="8" fill="none" />
                    <circle
                        cx="128"
                        cy="128"
                        r="120"
                        stroke="#4e6797"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={754}
                        strokeDashoffset={754 - (754 * progress) / 100}
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className={`text-6xl font-bold font-mono transition-colors duration-500 ${isActive ? 'text-primary' : 'text-neutral-400'}`}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Controls */}
            <div className="mt-12 flex gap-4">
                <button
                    onClick={onExit}
                    className="px-6 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-100 transition"
                >
                    Exit
                </button>
                <button
                    onClick={toggleTimer}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition shadow-lg ${isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary/90"
                        }`}
                >
                    {isActive ? "Pause" : "Start Focus"}
                </button>
            </div>
        </div>
    );
}