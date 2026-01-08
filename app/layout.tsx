import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Harmony Planner",
  description: "Plan your study. One day at a time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Noto+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#f6f6f8] text-[#0e121b] antialiased">
        {children}
      </body>
    </html>
  );
}