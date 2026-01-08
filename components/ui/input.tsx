import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label className="text-xs font-medium text-neutral-600">
                    {label}
                </label>
            )}
            <input
                className={`rounded-lg border border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 ${className}`}
                {...props}
            />
        </div>
    );
}
