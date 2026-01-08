import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
    return (
        <div
            className={`rounded-xl border border-neutral-200 bg-white p-4 ${className}`}
        >
            {children}
        </div>
    );
}
