"use client";

import { useState } from "react";

export default function SemesterOnboardingPage() {
    const [semesterName, setSemesterName] = useState("");
    const [major, setMajor] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Handler for Continue button (future: validation, navigation, api, etc.)
    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you might add validation or navigation logic
        // For now, just log the values
        // console.log({ semesterName, major, startDate, endDate });
    };

    return (
        <div className="min-h-screen w-full bg-[#f6f6f8] text-[#0e121b] font-display">
            {/* Top Navigation */}
            <header className="flex items-center justify-between border-b border-[#e7ebf3] px-6 md:px-12 py-4 bg-white">
                <div className="flex items-center gap-3">
                    <div className="size-6 text-primary">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">
                        Harmony Planner
                    </h2>
                </div>
                <button className="text-[#4e6797] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">help</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="flex justify-center px-6 md:px-12 py-12">
                <div className="w-full max-w-[1200px] flex flex-col items-center gap-8">

                    {/* Progress */}
                    <div className="w-full max-w-[645px] flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <p className="text-lg font-medium">Step 1 of 4</p>
                            <p className="text-md text-[#4e6797]">Semester Details</p>
                        </div>
                        <div className="h-3 md:h-3 w-full rounded-full bg-[#d0d7e7] overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: "25%" }}
                            />
                        </div>
                    </div>

                    {/* Card */}
                    <div className="w-full max-w-[650px] bg-white rounded-2xl shadow-xl border border-[#e7ebf3] p-8 md:p-12 flex flex-col gap-10">

                        {/* Heading */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-[40px] font-bold tracking-tight">
                                Define your academic term
                            </h1>
                            <p className="text-base md:text-md text-[#4e6797]">
                                We need these dates to generate your optimized study schedule.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="flex flex-col gap-8" onSubmit={handleContinue} autoComplete="off">

                            {/* Semester Name */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xl font-medium" htmlFor="semesterName">Semester Name</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] material-symbols-outlined">
                                        label
                                    </span>
                                    <input
                                        id="semesterName"
                                        name="semesterName"
                                        className="w-full h-16 pl-12 pr-4 bg-[#f8f9fc] border border-[#d0d7e7] text-xl rounded-lg placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g. Fall 2023"
                                        value={semesterName}
                                        onChange={(e) => setSemesterName(e.target.value)}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            {/* Major */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xl font-medium" htmlFor="major">Major / Branch</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] material-symbols-outlined">
                                        account_tree
                                    </span>
                                    <input
                                        id="major"
                                        name="major"
                                        className="w-full h-16 pl-12 pr-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg text-xl placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="e.g. Computer Science"
                                        value={major}
                                        onChange={(e) => setMajor(e.target.value)}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xl font-medium" htmlFor="startDate">Start Date</label>
                                    <input
                                        id="startDate"
                                        name="startDate"
                                        type="date"
                                        className="h-16 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xl font-medium" htmlFor="endDate">End Date</label>
                                    <input
                                        id="endDate"
                                        name="endDate"
                                        type="date"
                                        className="h-16 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </form>

                        {/* Actions */}
                        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
                            <button
                                type="button"
                                className="text-xl font-medium text-[#4e6797] hover:text-[#0e121b] transition"
                                tabIndex={-1}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="bg-primary text-white font-semibold h-15 px-10 rounded-xl flex items-center gap-3 text-base md:text-lg shadow-sm hover:shadow-md transition"
                            >

                                Continue to Subjects
                                <span className="material-symbols-outlined text-xl">
                                    arrow_forward
                                </span>
                            </button>
                        </div>
                    </div>

                    <p className="text-lg text-[#94a3b8]">
                        Your data is saved automatically as you type.
                    </p>
                </div>
            </main>
        </div>
    );
}
