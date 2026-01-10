"use client";

import { usePathname } from "next/navigation";

const STEPS = [
    { path: "/onboarding/semester", label: "Semester" },
    { path: "/onboarding/subjects", label: "Subjects" },
    { path: "/onboarding/timetable", label: "Timetable" },
];

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Hide status bar completely on Done page
    const isDonePage = pathname.startsWith("/onboarding/done");

    // Find step index safely
    const stepIndex = STEPS.findIndex(step =>
        pathname.startsWith(step.path)
    );

    // Clamp step to minimum 1
    const currentStep = stepIndex >= 0 ? stepIndex + 1 : 1;
    const totalSteps = STEPS.length;

    return (
        <div className="min-h-screen bg-[#f6f6f8] font-display text-[#0e121b]">

            {/* NAVBAR */}
            <header className="flex items-center justify-between border-b border-[#e7ebf3] bg-white px-6 md:px-12 py-4 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                            school
                        </span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">
                        Harmony Planner
                    </h2>
                </div>

                <button className="text-[#4e6797] hover:text-primary transition">
                    <span className="material-symbols-outlined">
                        help
                    </span>
                </button>
            </header>

            {/* STATUS BAR (hidden on Done) */}
            {!isDonePage && (
                <div className="max-w-[1200px] mx-auto px-6 md:px-12 pt-8">
                    <div className="flex justify-between items-end mb-3">
                        <p className="text-lg font-medium">
                            Step {currentStep} of {totalSteps}
                        </p>
                        <p className="text-md text-[#4e6797]">
                            {STEPS[currentStep - 1]?.label}
                        </p>
                    </div>

                    <div className="h-3 w-full rounded-full bg-[#d0d7e7] overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-500"
                            style={{
                                width: `${(currentStep / totalSteps) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* PAGE CONTENT */}
            <main className="pt-10">
                {children}
            </main>
        </div>
    );
}
