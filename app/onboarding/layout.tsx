// app/onboarding/layout.tsx (partial)

import HeaderClient from "./HeaderClient";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#f6f6f8]">
            <HeaderClient />
            <main>{children}</main>
        </div>
    );
}
