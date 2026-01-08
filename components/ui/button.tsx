import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
}

export default function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}: ButtonProps) {
    const base =
        "w-full rounded-lg px-4 py-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary:
            "bg-neutral-900 text-white hover:bg-neutral-800 focus:ring-neutral-900",
        secondary:
            "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-300",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
