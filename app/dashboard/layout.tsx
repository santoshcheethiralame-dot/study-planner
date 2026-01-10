"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-[#f6f6f8] font-display text-[#0e121b]">
      {/* Sidebar placeholder */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#e7ebf3] p-6">
        <div className="font-bold text-lg">
          Harmony Planner
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
