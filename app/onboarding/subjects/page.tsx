"use client";

import { useEffect, useRef, useState } from "react";

type Difficulty = "Easy" | "Medium" | "Hard" | "";

type Subject = {
    name: string;
    code: string;
    credits: string;
    difficulty: Difficulty;
    notes: string;
};

const EMPTY_SUBJECT: Subject = {
    name: "",
    code: "",
    credits: "",
    difficulty: "",
    notes: "",
};

export default function SubjectsOnboardingPage() {
    const [subjects, setSubjects] = useState<Subject[]>(
        Array.from({ length: 5 }, () => ({ ...EMPTY_SUBJECT }))
    );
    const [activeIndex, setActiveIndex] = useState(0);

    const subjectRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const isScrollable = subjects.length > 4;

    /* ---------------- persistence ---------------- */
    useEffect(() => {
        const stored = localStorage.getItem("subjects");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    const filled = [
                        ...parsed,
                        ...Array.from(
                            { length: Math.max(0, 5 - parsed.length) },
                            () => ({ ...EMPTY_SUBJECT })
                        ),
                    ];

                    setSubjects(filled);
                    setActiveIndex(0);
                }

            } catch { }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("subjects", JSON.stringify(subjects));
    }, [subjects]);

    /* ---------------- helpers ---------------- */
    const updateSubject = (
        index: number,
        field: keyof Subject,
        value: string
    ) => {
        setSubjects((prev) =>
            prev.map((s, i) =>
                i === index ? { ...s, [field]: value } : s
            )
        );
    };

    const addSubject = () => {
        setSubjects((prev) => [...prev, { ...EMPTY_SUBJECT }]);
        const newIndex = subjects.length;
        setActiveIndex(newIndex);

        requestAnimationFrame(() => {
            subjectRefs.current[newIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        });
    };

    const removeSubject = (index: number) => {
        const updated = subjects.filter((_, i) => i !== index);
        setSubjects(updated);
        setActiveIndex(Math.max(0, index - 1));
    };

    const activeSubject = subjects[activeIndex];

    /* ---------------- UI ---------------- */
    return (
        <div className="min-h-screen w-full bg-[#f6f6f8] text-[#0e121b] font-display">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[#e7ebf3] px-6 md:px-12 py-4 bg-white">
                <div className="flex items-center gap-3">
                    <div className="size-6 text-primary">
                        <span className="material-symbols-outlined text-2xl">
                            school
                        </span>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">
                        Harmony Planner
                    </h2>
                </div>
                <button className="text-[#4e6797] hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">help</span>
                </button>
            </header>

            <main className="flex justify-center px-6 md:px-12 py-12">
                <div className="w-full max-w-[1200px] flex flex-col items-center gap-8">
                    {/* Progress */}
                    <div className="w-full max-w-[572px] flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <p className="text-lg font-medium">Step 2 of 4</p>
                            <p className="text-md text-[#4e6797]">Courses</p>
                        </div>
                        <div className="h-3 w-full rounded-full bg-[#d0d7e7] overflow-hidden">
                            <div className="h-full bg-primary w-1/2 transition-all duration-500" />
                        </div>
                    </div>

                    {/* Card */}
                    <div className="w-full max-w-[780px] bg-white rounded-2xl shadow-xl border border-[#e7ebf3] p-8 md:p-12 flex flex-col gap-10">
                        {/* Heading */}
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl md:text-[36px] font-bold tracking-tight">
                                What are you studying?
                            </h1>
                            <p className="text-base md:text-md text-[16px   ] text-[#4e6797]">
                                Add the courses you are taking this semester.
                            </p>
                        </div>

                        {/* MASTER–DETAIL */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                            {/* LEFT COLUMN (height locked) */}
                            <div className="md:col-span-4 relative h-[460px]">
                                {/* Scrollable list */}
                                <div
                                    className={`flex flex-col gap-3 pr-1 ${isScrollable
                                        ? "overflow-y-auto max-h-[456px]"
                                        : ""
                                        }`}
                                >
                                    {subjects.map((s, idx) => (
                                        <button
                                            key={idx}
                                            ref={(el) => {
                                                subjectRefs.current[idx] = el;
                                            }}
                                            onClick={() => setActiveIndex(idx)}
                                            className={`h-16 flex-none px-4 rounded-lg text-left border transition flex flex-col justify-center
                                                ${idx === activeIndex
                                                    ? "border-primary bg-primary/10"
                                                    : "border-[#e7ebf3] hover:bg-[#f8f9fc]"
                                                }`}
                                        >
                                            <p className="text-md font-medium truncate">
                                                {s.name || `Subject ${idx + 1}`}
                                            </p>
                                            <p className="text-sm text-[#4e6797] truncate">
                                                {s.credits
                                                    ? `${s.credits} credits`
                                                    : "Not set"}
                                            </p>
                                        </button>
                                    ))}
                                </div>

                                {/* Add Subject — anchored INSIDE left column */}
                                <button
                                    onClick={addSubject}
                                    className={`absolute left-0 right-0 h-16 border-2 border-dashed border-[#d0d7e7] rounded-xl text-lg text-[#4e6797] hover:border-primary hover:text-primary transition
                                        ${isScrollable
                                            ? "bottom-0 bg-white"
                                            : "mt-3"
                                        }`}
                                >
                                    + Add subject
                                </button>
                            </div>

                            {/* RIGHT EDITOR */}
                            <div className="md:col-span-8 flex flex-col gap-7 border border-[#e7ebf3] rounded-xl p-6 relative">
                                {subjects.length > 1 && (
                                    <button
                                        onClick={() =>
                                            removeSubject(activeIndex)
                                        }
                                        className="absolute top-4 right-4 text-[#94a3b8] hover:text-red-500"
                                    >
                                        <span className="material-symbols-outlined">
                                            delete
                                        </span>
                                    </button>
                                )}

                                {/* Name */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-lg font-medium">
                                        Subject Name
                                    </label>
                                    <input
                                        className="w-full h-14 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg text-lg"
                                        value={activeSubject.name}
                                        onChange={(e) =>
                                            updateSubject(
                                                activeIndex,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Data Structures"
                                    />
                                </div>

                                {/* Code + Credits */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-medium">
                                            Code (optional)
                                        </label>
                                        <input
                                            className="w-full h-14 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg text-lg"
                                            value={activeSubject.code}
                                            onChange={(e) =>
                                                updateSubject(
                                                    activeIndex,
                                                    "code",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="CS201"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-lg font-medium">
                                            Credits
                                        </label>
                                        <input
                                            type="number"
                                            className="w-full h-14 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg text-lg"
                                            value={activeSubject.credits}
                                            onChange={(e) =>
                                                updateSubject(
                                                    activeIndex,
                                                    "credits",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="4"
                                        />
                                    </div>
                                </div>

                                {/* Difficulty */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-lg font-medium">
                                        Difficulty
                                    </label>

                                    <div className="grid grid-cols-3 gap-4 h-12">
                                        {(["Easy", "Medium", "Hard"] as Difficulty[]).map((level) => {
                                            const active = activeSubject.difficulty === level;

                                            const activeClass =
                                                level === "Easy"
                                                    ? "bg-green-100 text-green-700 border-green-300"
                                                    : level === "Medium"
                                                        ? "bg-amber-100 text-amber-700 border-amber-300"
                                                        : "bg-red-100 text-red-700 border-red-300";

                                            const hoverClass =
                                                level === "Easy"
                                                    ? "hover:bg-green-50"
                                                    : level === "Medium"
                                                        ? "hover:bg-amber-50"
                                                        : "hover:bg-red-50";

                                            return (
                                                <button
                                                    key={level}
                                                    type="button"
                                                    onClick={() =>
                                                        updateSubject(activeIndex, "difficulty", level)
                                                    }
                                                    className={`rounded-xl border text-lg font-medium transition
            ${active
                                                            ? activeClass
                                                            : `bg-[#f8f9fc] border-[#d0d7e7] ${hoverClass}`
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>


                                {/* Notes */}
                                <div className="flex flex-col gap-2">

                                    <textarea
                                        rows={4}
                                        className="w-full h-16 resize-none px-4 py-3 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg text-md placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        placeholder="About this course…"
                                        value={activeSubject.notes}
                                        onChange={(e) =>
                                            updateSubject(activeIndex, "notes", e.target.value)
                                        }
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Actions */}
                        {/* Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 w-full">

                            {/* Go back */}
                            <button className="flex items-center justify-center gap-2 text-lg font-medium text-primary border border-primary rounded-xl h-14 hover:bg-primary/5 transition">
                                <span className="material-symbols-outlined text-xl">arrow_back</span>
                                Go back
                            </button>

                            {/* Empty middle column (visual balance) */}
                            <div />

                            {/* Skip + Continue */}
                            <div className="flex gap-3 justify-end">
                                <button className="flex items-center justify-center h-14 px-6 min-w-[140px] whitespace-nowrap text-lg font-medium text-primary border border-primary rounded-xl hover:bg-primary/5 transition">
                                    Skip for now
                                </button>

                                <button className="flex items-center justify-center h-14 px-8 min-w-[160px] bg-primary text-white text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition">
                                    Continue
                                    <span className="material-symbols-outlined text-xl ml-2">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-lg text-[#94a3b8]">
                        Your data is saved automatically.
                    </p>
                </div>
            </main>
        </div>
    );
}