import { StudyBlock } from "@/lib/types";

// Add onDelete to the props
export function UpcomingList({ 
  blocks, 
  onDelete 
}: { 
  blocks: StudyBlock[]; 
  onDelete: (id: string) => void 
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e7ebf3]">
      <h3 className="font-semibold text-sm mb-4">Today’s Schedule</h3>

      <ul className="space-y-4">
        {blocks.map((b) => {
          const isDone = b.status === "done";
          return (
            <li key={b.id} className={`flex justify-between items-center group transition-all ${isDone ? 'opacity-50' : ''}`}>
              <div className="flex flex-col">
                <span className={`font-medium text-neutral-900 ${isDone ? 'line-through text-neutral-400' : ''}`}>
                  {b.title}
                </span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  {b.subjectCode}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2 py-1 rounded">
                  {b.durationMin}m
                </span>
                
                {/* Delete Button - only shows if block isn't done */}
                {!isDone && (
                  <button 
                    onClick={() => onDelete(b.id)}
                    className="text-neutral-300 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}