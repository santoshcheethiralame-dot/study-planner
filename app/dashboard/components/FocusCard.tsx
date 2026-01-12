import { StudyBlock } from "@/lib/types";

export function FocusCard({ next }: { next?: StudyBlock }) {
  if (!next) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#e7ebf3]">
        <p className="text-sm text-[#4e6797]">
          No blocks scheduled for today 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e7ebf3]">
      <h2 className="font-semibold text-lg">Up next</h2>
      <p className="mt-2">{next.title}</p>
      <p className="text-sm text-[#6b7280]">
        {next.durationMin} minutes
      </p>

      <button className="mt-4 bg-primary text-white px-4 py-2 rounded-lg">
        Start block
      </button>
    </div>
  );
}
