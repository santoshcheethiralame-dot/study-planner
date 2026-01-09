"use client";

import { useState, useEffect } from "react";

type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

type TimeSlot =
    | "08:00"
    | "09:00"
    | "10:00"
    | "11:00"
    | "12:00"
    | "13:00"
    | "14:00"
    | "15:00";

type Subject = {
    name: string;
    code: string;
    credits: string;
    difficulty: string;
    notes: string;
};

type TimetableClass = {
    id: string;
    subjectName: string;
    subjectCode: string;
    location: string;
    day: Day;
    time: TimeSlot;
    color: string;
};

const PREVIEW_CLASSES: TimetableClass[] = [
    { id: "p1", subjectName: "Math 101", subjectCode: "", location: "Room 302", day: "Mon", time: "08:00", color: "blue" },
    { id: "p2", subjectName: "Chemistry", subjectCode: "", location: "Lab 1", day: "Mon", time: "11:00", color: "teal" },
    { id: "p3", subjectName: "History", subjectCode: "", location: "Hall A", day: "Tue", time: "09:00", color: "orange" },
    { id: "p4", subjectName: "Biology", subjectCode: "", location: "Lab 4", day: "Wed", time: "08:00", color: "purple" },
    { id: "p5", subjectName: "Physics", subjectCode: "", location: "Lab 2", day: "Wed", time: "10:00", color: "red" },
    { id: "p6", subjectName: "English",subjectCode:"", location: "Room 101", day: "Thu", time: "11:00", color: "indigo" },
    { id: "p7", subjectName: "Gym", subjectCode:"", location: "Main Court", day: "Fri", time: "09:00", color: "green" },
];

const COLOR_OPTIONS = [
    "blue", "purple", "orange", "green", "red", "teal", "pink", "indigo"
];

const COLOR_STYLES: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const TILE_HEIGHT = "h-[72px]"; // fixed tile height

export default function TimetablePage() {
    const [showWeekends, setShowWeekends] = useState(false);
    const [classes, setClasses] = useState<TimetableClass[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ day: Day; time: TimeSlot } | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("subjects");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setSubjects(parsed.filter((s: Subject) => s.name));
                }
            } catch { }
        }
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("timetable");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setClasses(parsed);
                    if (parsed.length > 0) setIsPreviewMode(false);
                }
            } catch { }
        }
    }, []);

    useEffect(() => {
        if (classes.length > 0) {
            localStorage.setItem("timetable", JSON.stringify(classes));
        }
    }, [classes]);

    const TIMES: TimeSlot[] = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
    ];

    const WEEKDAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const WEEKENDS: Day[] = ["Sat", "Sun"];

    const activeClasses = isPreviewMode ? PREVIEW_CLASSES : classes;

    const getClassForSlot = (day: Day, time: TimeSlot) => {
        return activeClasses.find(
            (c) => c.day === day && c.time === time
        );
    };

    const handleSlotClick = (day: Day, time: TimeSlot) => {
        if (isPreviewMode) {
            setIsPreviewMode(false);
            setClasses([]);
            setSelectedSlot({ day, time });
            setShowAddModal(true);
            return;
        }
        setSelectedSlot({ day, time });
        setShowAddModal(true);
    };

    const handleAddClass = (subjectName: string, location: string) => {
        if (!selectedSlot) return;

        const colorIndex = classes.length % COLOR_OPTIONS.length;
        const newClass: TimetableClass = {
            id: `${selectedSlot.day}-${selectedSlot.time}-${Date.now()}`,
            subjectName,
            subjectCode: subjects.find(s => s.name === subjectName)?.code || "",
            location,
            day: selectedSlot.day,
            time: selectedSlot.time,
            color: COLOR_OPTIONS[colorIndex],
        };

        const updatedClasses = [...classes, newClass];
        setClasses(updatedClasses);
        localStorage.setItem("timetable", JSON.stringify(updatedClasses));
        setShowAddModal(false);
        setSelectedSlot(null);
    };

    return (
        <div className="min-h-screen w-full bg-[#f6f6f8] text-[#0e121b] font-display">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[#e7ebf3] px-6 md:px-12 py-4 bg-white sticky top-0 z-50">
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
                    <div className="w-full max-w-[645px] flex flex-col gap-4">
                        <div className="flex justify-between items-end">
                            <p className="text-lg font-medium">Step 3 of 4</p>
                            <p className="text-md text-[#4e6797]">Timetable</p>
                        </div>
                        <div className="h-3 w-full rounded-full bg-[#d0d7e7] overflow-hidden">
                            <div className="h-full w-3/4 bg-primary transition-all duration-500" />
                        </div>
                    </div>

                    {/* Card */}
                    <div className="w-full max-w-[1500px] bg-white rounded-2xl shadow-xl border border-[#e7ebf3] p-8 md:p-12 flex flex-col gap-10">
                        {/* Heading */}
                        <div className="flex flex-col gap-2 max-w-2xl">
                            <h1 className="text-3xl md:text-[36px] font-bold tracking-tight">
                                What does your week look like?
                            </h1>
                            <p className="text-base text-[#4e6797]">
                                Add your fixed classes so we can plan study time around them.
                                Click a slot to add.
                            </p>
                        </div>

                        {/* Timetable */}
                        <div className="rounded-2xl border border-[#e7ebf3] bg-white shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#e7ebf3]">
                                            <th className="sticky left-0 z-10 w-24 bg-white px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                                                Day
                                            </th>
                                            {TIMES.map((time) => (
                                                <th
                                                    key={time}
                                                    className="px-4 py-3 text-center text-xs font-medium tracking-wide text-[#4e6797]"
                                                >
                                                    {time}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e7ebf3]">
                                        {[...WEEKDAYS, ...(showWeekends ? WEEKENDS : [])].map(
                                            (day) => (
                                                <tr
                                                    key={day}
                                                    className="group hover:bg-[#f8f9fc]"
                                                >
                                                    <td className="sticky left-0 z-10 bg-[#f8f9fc] px-4 py-4 text-sm font-semibold text-[#0e121b]">
                                                        {day}
                                                    </td>
                                                    {TIMES.map((time) => {
                                                        const slot = getClassForSlot(day, time);
                                                        return (
                                                            <td
                                                                key={time}
                                                                className="h-20 p-1 align-top border-l border-dashed border-[#e7ebf3]"
                                                            >
                                                                <button
                                                                    onClick={() => handleSlotClick(day, time)}
                                                                    className={`
                                                                        w-full ${TILE_HEIGHT}
                                                                        rounded-lg border
                                                                        transition
                                                                        flex items-center justify-center group/slot
                                                                        ${slot
                                                                            ? COLOR_STYLES[slot.color ?? "blue"]
                                                                            : "border-2 border-dashed border-[#d0d7e7] hover:border-primary hover:bg-primary/5"}
                                                                    `}
                                                                >
                                                                    <div className="w-full h-full flex flex-col justify-center px-3">
                                                                        {!slot ? (
                                                                            <span className="material-symbols-outlined text-[#94a3b8] opacity-0 group-hover/slot:opacity-100 transition mx-auto">
                                                                                add
                                                                            </span>
                                                                        ) : (
                                                                            <>
                                                                                <p className="text-sm font-semibold truncate">
                                                                                    {slot.subjectName}
                                                                                </p>
                                                                                <p className="text-xs opacity-80 truncate">
                                                                                    {slot.location}
                                                                                </p>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Weekend Toggle */}
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowWeekends((v) => !v)}
                                className="text-sm font-medium text-[#4e6797] hover:text-primary transition"
                            >
                                {showWeekends
                                    ? "− Hide weekends"
                                    : "+ Show weekends (optional)"}
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 pt-6 border-t border-[#f0f2f7]">
                            <button className="flex items-center gap-2 text-lg font-medium text-primary hover:text-primary/80 transition border border-primary rounded-xl h-14 px-6 hover:bg-primary/5">
                                <span className="material-symbols-outlined text-lg">
                                    arrow_back
                                </span>
                                Go back
                            </button>

                            <div className="flex items-center gap-4">
                                <button className="h-14 px-6 rounded-xl border border-primary text-lg font-medium text-primary hover:bg-primary/5 transition">
                                    Skip for now
                                </button>
                                <button className="h-14 px-8 rounded-xl bg-primary text-white font-semibold text-lg shadow-sm hover:shadow-md transition flex items-center gap-2">
                                    Continue
                                    <span className="material-symbols-outlined text-lg">
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

            {/* Add Class Modal */}
            {showAddModal && (
                <AddClassModal
                    subjects={subjects}
                    onAdd={handleAddClass}
                    onClose={() => {
                        setShowAddModal(false);
                        setSelectedSlot(null);
                    }}
                />
            )}
        </div>
    );
}

function AddClassModal({
    subjects,
    onAdd,
    onClose,
}: {
    subjects: Subject[];
    onAdd: (subjectName: string, location: string) => void;
    onClose: () => void;
}) {
    const [selectedSubject, setSelectedSubject] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSubject) {
            onAdd(selectedSubject, location);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">Add Class</h3>
                    <button
                        onClick={onClose}
                        className="text-[#94a3b8] hover:text-[#0e121b] transition"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="h-14 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg text-lg"
                            required
                        >
                            <option value="">Select a subject</option>
                            {subjects.map((subject, idx) => (
                                <option key={idx} value={subject.name}>
                                    {subject.name} {subject.code && `(${subject.code})`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-medium">Location (optional)</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="h-14 px-4 bg-[#f8f9fc] border border-[#d0d7e7] rounded-lg text-lg"
                            placeholder="e.g. Room 302, Lab 4"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-14 rounded-xl border border-[#d0d7e7] text-lg font-medium text-[#4e6797] hover:bg-[#f8f9fc] transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-14 rounded-xl bg-primary text-white font-semibold text-lg shadow-sm hover:shadow-md transition"
                        >
                            Add Class
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
