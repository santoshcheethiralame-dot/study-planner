import { useTodaysClasses } from "@/hooks/useTodayClasses";

export function TimetableWidget() {
    const { classes, loading } = useTodaysClasses();

    if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded-2xl" />;

    return (
        <div className="bg-white rounded-2xl p-6 border border-[#e7ebf3]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-sm">Classes Today</h3>
                <span className="text-xs text-neutral-400 font-medium">
                    {classes.length} sessions
                </span>
            </div>

            {classes.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-sm text-neutral-400">No classes today 🎉</p>
                    <p className="text-xs text-neutral-300 mt-1">Time to focus!</p>
                </div>
            ) : (
                <ul className="space-y-0">
                    {classes.map((c, i) => (
                        <li key={c.id} className="relative flex gap-4 py-3 group">
                            {/* Timeline Connector Line */}
                            {i !== classes.length - 1 && (
                                <div className="absolute left-[19px] top-8 bottom-[-12px] w-[2px] bg-neutral-100 group-hover:bg-primary/10 transition-colors" />
                            )}

                            {/* Time Column */}
                            <div className="flex flex-col items-center min-w-[40px]">
                                <span className="text-xs font-bold text-neutral-500 bg-neutral-50 px-1.5 py-0.5 rounded border border-neutral-100">
                                    {c.time}
                                </span>
                            </div>

                            {/* Details Column */}
                            <div>
                                <p className="text-sm font-semibold text-neutral-900 leading-none">
                                    {c.subjectName}
                                </p>
                                <p className="text-xs text-neutral-400 mt-1.5 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">location_on</span>
                                    {c.location || "No location"}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}