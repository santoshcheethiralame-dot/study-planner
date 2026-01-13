interface ProgressRingProps {
    completed: number;
    total: number;
}

export function ProgressRing({ completed, total }: ProgressRingProps) {
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    const circumference = 2 * Math.PI * 45; // radius = 45
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg className="transform -rotate-90" width="120" height="120">
                {/* Background circle */}
                <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx="60"
                    cy="60"
                    r="45"
                    stroke="url(#progressGradient)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700 ease-out"
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{Math.round(percentage)}%</span>
                <span className="text-xs text-gray-500 mt-1">
                    {completed}/{total}
                </span>
            </div>
        </div>
    );
}