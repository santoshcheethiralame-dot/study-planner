"use client";

import { useEffect, useState } from "react";

interface BreakScreenProps {
    duration: number; // minutes
    onComplete: () => void;
    onSkip: () => void;
}

const BREAK_ACTIVITIES = [
    "💧 Drink some water",
    "🚶 Take a short walk",
    "👀 Look away from screen (20-20-20 rule)",
    "🧘 Stretch your arms and legs",
    "🍎 Have a healthy snack",
    "🪟 Step outside for fresh air",
];

export function BreakScreen({ duration, onComplete, onSkip }: BreakScreenProps) {
    const [secondsLeft, setSecondsLeft] = useState(duration * 60);
    const [canSkip, setCanSkip] = useState(false);
    const [activity] = useState(
        BREAK_ACTIVITIES[Math.floor(Math.random() * BREAK_ACTIVITIES.length)]
    );

    useEffect(() => {
        // Allow skip after 60 seconds
        const skipTimer = setTimeout(() => setCanSkip(true), 60000);

        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearTimeout(skipTimer);
            clearInterval(interval);
        };
    }, [onComplete]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-6">☕</div>
                <h2 className="text-3xl font-bold text-amber-900 mb-2">Break Time!</h2>
                <p className="text-amber-700 mb-8">You've earned a rest. Try this:</p>

                <div className="bg-white p-6 rounded-2xl border border-amber-200 mb-8">
                    <p className="text-xl font-semibold text-neutral-900">{activity}</p>
                </div>

                <div className="text-5xl font-bold font-mono text-amber-900 mb-8">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>

                <div className="flex gap-3 justify-center">
                    {canSkip ? (
                        <button
                            onClick={onSkip}
                            className="bg-white text-amber-900 px-6 py-3 rounded-xl font-semibold border border-amber-200 hover:bg-amber-50 transition"
                        >
                            Skip Break
                        </button>
                    ) : (
                        <p className="text-sm text-amber-600">
                            Minimum 1 minute rest required...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}