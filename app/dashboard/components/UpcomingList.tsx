import { StudyBlock } from "@/lib/types";

export function UpcomingList({ blocks }: { blocks: StudyBlock[] }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e7ebf3]">
      <h3 className="font-semibold text-sm mb-4">Today’s plan</h3>

      <ul className="space-y-3">
        {blocks.map((b) => (
          <li key={b.id} className="flex justify-between text-sm">
            <span>{b.title}</span>
            <span className="text-[#6b7280]">
              {b.durationMin}m
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
