"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useOnboardingGuard(type: "require" | "skip") {
    const router = useRouter();

    useEffect(() => {
        // 🔓 DEV OVERRIDE
        if (process.env.NODE_ENV === "development") return;

        const completed =
            localStorage.getItem("onboarding_completed") === "true";

        if (type === "require" && !completed) {
            router.replace("/onboarding/semester");
        }

        if (type === "skip" && completed) {
            router.replace("/dashboard");
        }
    }, [router, type]);
}
