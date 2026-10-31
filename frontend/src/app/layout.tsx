import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "SkillSathi AI — Your Skills. Your Future.",
  description:
    "AI-powered career companion that helps students, graduates and job seekers identify strengths, improve resumes, understand job requirements, bridge skill gaps and prepare for employment.",
  keywords: [
    "career",
    "resume",
    "AI",
    "skills",
    "job matching",
    "interview preparation",
    "India",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
