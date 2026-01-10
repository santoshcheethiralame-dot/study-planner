"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SemesterOnboardingPage() {
    const router = useRouter();

    const [semesterName, setSemesterName] = useState("");
    const [major, setMajor] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const canContinue =
        semesterName.trim() !== "" &&
        major.trim() !== "" &&
        startDate !== "" &&
        endDate !== "";

    const handleContinue = () => {
        if (!canContinue) return;

        localStorage.setItem(
            "semester",
            JSON.stringify({
                semesterName,
                major,
                startDate,
                endDate,
            })
        );

        router.push("/onboarding/subjects");
    };

    const helperText = canContinue
        ? "Looks good! Ready to move on 🚀"
        : semesterName || major || startDate || endDate
            ? "Almost there…"
            : "This helps us plan smarter, not harder.";

    return (
        <main className="flex justify-center px-6 py-12">
            <div className="relative w-full max-w-[600px] bg-white rounded-2xl shadow-xl border border-[#e7ebf3] p-8 md:p-12 flex flex-col gap-10">

                <div className="absolute left-0 top-8 bottom-8 w-[3px] rounded-full bg-primary/30" />

                <div className="flex flex-col gap-3">
                    <h1 className="text-3xl md:text-[35px] font-bold tracking-tight">
                        Let’s set up your semester <span className="opacity-70">✨</span>
                    </h1>
                    <p className="text-sm text-primary/70 font-medium">
                        {helperText}
                    </p>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">
                            Semester Name
                        </label>
                        <input
                            className="h-16 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg text-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. Fall 2024"
                            value={semesterName}
                            onChange={e => setSemesterName(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">
                            Major / Branch
                        </label>
                        <input
                            className="h-16 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg text-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="e.g. Computer Science"
                            value={major}
                            onChange={e => setMajor(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-lg font-medium">
                                Start Date
                            </label>
                            <input
                                type="date"
                                className="h-16 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-lg font-medium">
                                End Date
                            </label>
                            <input
                                type="date"
                                className="h-16 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-1 pt-2">
                        <button
                            onClick={handleContinue}
                            disabled={!canContinue}
                            className={`h-14 px-10 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center gap-2
                                ${canContinue
                                    ? "bg-primary text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                                    : "bg-[#e5e9f2] text-[#94a3b8] cursor-not-allowed"
                                }`}
                        >
                            Continue to Subjects
                            <span className="material-symbols-outlined">
                                arrow_forward
                            </span>
                        </button>

                        {!canContinue && (
                            <p className="text-xs text-[#94a3b8] text-center">
                                Fill in all fields to continue
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
