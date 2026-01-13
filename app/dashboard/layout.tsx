"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", icon: "grid_view", href: "/dashboard" },
  { label: "Planner", icon: "calendar_today", href: "/dashboard/planner" },
  { label: "Progress", icon: "bar_chart", href: "/dashboard/stats" },
  { label: "Settings", icon: "settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#f6f6f8] font-display text-[#0e121b]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#e7ebf3] flex-col p-6 fixed h-full">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">school</span>
          </div>
          <h2 className="font-bold text-lg tracking-tight">Harmony</h2>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4 bg-neutral-50 rounded-2xl">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Premium</p>
          <p className="text-xs text-neutral-600 mt-1">Upgrade for AI insights</p>
        </div>
      </aside>

      {/* Main content - add margin to account for fixed sidebar */}
      <div className="flex-1 md:ml-64">
        {children}
      </div>
    </div>
  );
}