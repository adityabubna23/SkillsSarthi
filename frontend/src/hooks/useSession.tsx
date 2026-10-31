"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ResumeAnalysis } from "@/types/api";

interface SessionState {
  /** Raw text extracted from the uploaded resume */
  resumeText: string;
  /** Job description pasted by the user */
  jobDescription: string;
  /** Full resume analysis result from the backend */
  resumeAnalysis: ResumeAnalysis | null;
  /** Whether the session has resume data available */
  hasResume: boolean;
  /** Whether the session has a JD available */
  hasJobDescription: boolean;
}

interface SessionActions {
  setResumeText: (text: string) => void;
  setJobDescription: (text: string) => void;
  setResumeAnalysis: (analysis: ResumeAnalysis | null) => void;
  /** Build a simple text representation from a ResumeAnalysis */
  populateResumeTextFromAnalysis: (analysis: ResumeAnalysis) => void;
  clearSession: () => void;
}

type SessionContextType = SessionState & SessionActions;

const SessionContext = createContext<SessionContextType | null>(null);

/**
 * Build a readable text representation from a ResumeAnalysis object.
 * This is what gets sent as `resume_text` to backend endpoints.
 */
function buildResumeTextFromAnalysis(analysis: ResumeAnalysis): string {
  const { parsed_data: d } = analysis;
  const parts: string[] = [];

  if (d.name) parts.push(`Name: ${d.name}`);
  if (d.email) parts.push(`Email: ${d.email}`);
  if (d.phone) parts.push(`Phone: ${d.phone}`);

  if (d.education.length > 0) {
    parts.push("\nEducation:");
    d.education.forEach((edu) => {
      const line = [edu.degree, edu.field, edu.institution, edu.year]
        .filter(Boolean)
        .join(" | ");
      parts.push(`  - ${line}`);
      if (edu.grade) parts.push(`    Grade: ${edu.grade}`);
    });
  }

  if (d.skills.length > 0) {
    parts.push(`\nSkills: ${d.skills.join(", ")}`);
  }

  if (d.experience.length > 0) {
    parts.push("\nExperience:");
    d.experience.forEach((exp) => {
      parts.push(`  - ${exp.title} at ${exp.organization}${exp.duration ? ` (${exp.duration})` : ""}`);
      exp.description.forEach((desc) => parts.push(`    • ${desc}`));
    });
  }

  if (d.internships.length > 0) {
    parts.push("\nInternships:");
    d.internships.forEach((exp) => {
      parts.push(`  - ${exp.title} at ${exp.organization}${exp.duration ? ` (${exp.duration})` : ""}`);
      exp.description.forEach((desc) => parts.push(`    • ${desc}`));
    });
  }

  if (d.projects.length > 0) {
    parts.push("\nProjects:");
    d.projects.forEach((proj) => {
      parts.push(`  - ${proj.name}: ${proj.description}`);
      if (proj.technologies.length > 0) {
        parts.push(`    Technologies: ${proj.technologies.join(", ")}`);
      }
    });
  }

  if (d.certifications.length > 0) {
    parts.push(`\nCertifications: ${d.certifications.join(", ")}`);
  }

  if (d.achievements.length > 0) {
    parts.push(`\nAchievements: ${d.achievements.join(", ")}`);
  }

  return parts.join("\n");
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysis | null>(
    null
  );

  const populateResumeTextFromAnalysis = useCallback(
    (analysis: ResumeAnalysis) => {
      setResumeAnalysis(analysis);
      setResumeText(buildResumeTextFromAnalysis(analysis));
    },
    []
  );

  const clearSession = useCallback(() => {
    setResumeText("");
    setJobDescription("");
    setResumeAnalysis(null);
  }, []);

  return (
    <SessionContext.Provider
      value={{
        resumeText,
        jobDescription,
        resumeAnalysis,
        hasResume: resumeText.trim().length > 0,
        hasJobDescription: jobDescription.trim().length > 0,
        setResumeText,
        setJobDescription,
        setResumeAnalysis,
        populateResumeTextFromAnalysis,
        clearSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
