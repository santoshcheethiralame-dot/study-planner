// app/onboarding/HeaderClient.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";

const STEPS = [
    { path: "/onboarding/semester", label: "Semester" },
    { path: "/onboarding/subjects", label: "Subjects" },
    { path: "/onboarding/timetable", label: "Timetable" },
];

/**
 * Header used in onboarding layout. Hides the step/status bar on specific routes.
 */
export default function HeaderClient() {
    const pathname = usePathname() || "";

    // Hide status bar completely on Done page
    const isDonePage = pathname.startsWith("/onboarding/done");

    // routes where we DON'T want to show the step/status bar
    const hideStepBarOn = ["/onboarding/day-context"];

    // Find step index safely
    const stepIndex = STEPS.findIndex((step) =>
        pathname.startsWith(step.path)
    );

    // Clamp step to minimum 1
    const currentStep = stepIndex >= 0 ? stepIndex + 1 : 1;
    const totalSteps = STEPS.length;
    const progressPercentage = (currentStep / totalSteps) * 100;

    const showStepBar =
        !hideStepBarOn.includes(pathname) && !isDonePage && stepIndex >= 0;

    return (
        <>
            <header className="flex items-center justify-between border-b border-[#e7ebf3] bg-white px-6 md:px-12 py-4 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">school</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">Harmony Planner</h2>
                </div>

                {/* right side icons (help etc) - keep unchanged */}
                <div className="flex items-center gap-3">
                    <button className="text-sm text-[#94a3b8]">?</button>
                </div>
            </header>

            {showStepBar && (
                <div className="sticky top-[73px] z-40">
                    <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-4 pb-6">
                        <div className="flex justify-between items-end mb-3">
                            <p className="text-lg font-medium">
                                Step {currentStep} of {totalSteps}
                            </p>
                            <p className="text-md text-[#4e6797]">
                                {STEPS[stepIndex]?.label}
                            </p>
                        </div>
                        <div className="w-full bg-[#e9eefb] h-3 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
