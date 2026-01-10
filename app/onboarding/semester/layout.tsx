"use client";

export default function SemesterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-[#f6f6f8] text-[#0e121b] font-display">
            {children}
        </div>
    );
}
