"use client";

import Link from "next/link";

export default function OnboardingDonePage() {
    return (
        <div className="min-h-screen bg-[#f6f6f8] font-display text-[#0e121b] flex flex-col">

            {/* Header */}
            <header className="flex items-center justify-between border-b border-[#e7ebf3] bg-white/80 backdrop-blur px-6 md:px-12 py-4 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">menu_book</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">
                        Harmony Planner
                    </h2>
                </div>

                <button className="flex items-center gap-2 text-sm font-medium text-[#4e6797] hover:text-primary transition">
                    <span className="material-symbols-outlined text-[20px]">help</span>
                    <span className="hidden sm:inline">Help</span>
                </button>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#e7ebf3] overflow-hidden">

                    <div className="p-8 sm:p-12 flex flex-col items-center">

                        {/* Success Icon */}
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-[40px]">
                                    task_alt
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-3">
                                You’re all set!
                            </h1>
                            <p className="text-[#4e6797] text-base max-w-sm mx-auto">
                                Your workspace is ready. We’ve organized your preferences into a personalized study flow.
                            </p>
                        </div>

                        {/* Setup Highlights */}
                        <div className="w-full bg-[#f8f9fc] rounded-xl p-6 mb-10 border border-[#e7ebf3]">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-4">
                                Setup Highlights
                            </h3>

                            <ul className="space-y-4">
                                <Highlight
                                    icon="calendar_today"
                                    title="Semester Active"
                                    subtitle="Spring 2024 configured"
                                    color="emerald"
                                />
                                <Highlight
                                    icon="category"
                                    title="Subjects Added"
                                    subtitle="Academic goals synchronized"
                                    color="amber"
                                />
                                <Highlight
                                    icon="auto_schedule"
                                    title="Weekly Timetable Set"
                                    subtitle="Optimal study blocks reserved"
                                    color="blue"
                                />
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="w-full space-y-4">
                            <Link
                                href="/dashboard"
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-lg shadow-primary/20 transition flex items-center justify-center gap-2 group"
                            >
                                Go to Dashboard
                                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                                    arrow_forward
                                </span>
                            </Link>

                            <Link
                                href="/schedule"
                                className="w-full h-12 border border-[#e7ebf3] text-[#4e6797] font-medium rounded-xl hover:bg-[#f8f9fc] transition flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">
                                    calendar_month
                                </span>
                                View My Schedule
                            </Link>
                        </div>

                        {/* Footer link */}
                        <button className="mt-8 text-xs text-[#94a3b8] hover:text-primary transition">
                            Need to change something?{" "}
                            <span className="underline underline-offset-4">
                                Review Settings
                            </span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 text-center text-xs text-[#94a3b8]/60">
                © 2024 Harmony Planner. All rights reserved.
            </footer>
        </div>
    );
}

/* Small helper component */
function Highlight({
    icon,
    title,
    subtitle,
    color,
}: {
    icon: string;
    title: string;
    subtitle: string;
    color: "emerald" | "amber" | "blue";
}) {
    const colorMap: Record<string, string> = {
        emerald: "bg-emerald-100 text-emerald-600",
        amber: "bg-amber-100 text-amber-600",
        blue: "bg-blue-100 text-blue-600",
    };

    return (
        <li className="flex items-center gap-4">
            <div className={`size-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
                <span className="material-symbols-outlined text-[18px]">
                    {icon}
                </span>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-xs text-[#4e6797]">{subtitle}</span>
            </div>
        </li>
    );
}