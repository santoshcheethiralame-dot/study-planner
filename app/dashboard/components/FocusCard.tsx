import { StudyBlock } from "@/lib/types";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

export function FocusCard({ next, onStart }: { next?: StudyBlock; onStart?: () => void }) {
  if (!next) return null;

  return (
    <Card className="border-l-4 border-l-neutral-900 flex flex-col gap-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary/80 mb-1 block">
            Up Next
          </span>
          <h2 className="text-2xl font-bold text-neutral-900 leading-tight">
            {next.title}
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            {next.subjectCode} • {next.durationMin} mins
          </p>
        </div>
      </div>
      
      <Button onClick={onStart}>
        Start Session
      </Button>
    </Card>
  );
}