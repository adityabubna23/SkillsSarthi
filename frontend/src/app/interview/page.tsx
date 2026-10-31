"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import type { InterviewPrep, InterviewQuestion } from "@/types/api";
import {
  PageHeader,
  LoadingSpinner,
  ErrorDisplay,
} from "@/components/ui/shared";
import { difficultyColor, categoryColor, capitalize } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";

function QuestionCard({
  question,
  index,
}: {
  question: InterviewQuestion;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-5">
      <div
        className="flex items-start justify-between cursor-pointer gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1">
          <span className="text-xs font-bold text-[var(--brand-400)] bg-[var(--brand-600)]/15 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-white leading-relaxed">
              {question.question}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`badge text-[0.65rem] ${categoryColor(question.category)}`}>
                {capitalize(question.category)}
              </span>
              <span className={`badge text-[0.65rem] ${difficultyColor(question.difficulty)}`}>
                {capitalize(question.difficulty)}
              </span>
            </div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-[var(--text-muted)] flex-shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-[var(--text-muted)] flex-shrink-0" />
        )}
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 pl-10 border-l-2 border-[var(--glass-border)] ml-3">
          <div>
            <h4 className="text-xs font-medium text-[var(--text-muted)] mb-1 uppercase tracking-wider">
              Why this question
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {question.context}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-[var(--brand-400)] mb-1 uppercase tracking-wider">
              How to structure your answer
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {question.suggested_answer_structure}
            </p>
          </div>

          {question.follow_ups.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-amber-400 mb-1 uppercase tracking-wider">
                Possible follow-ups
              </h4>
              <ul className="space-y-1">
                {question.follow_ups.map((fu, i) => (
                  <li key={i} className="text-xs text-[var(--text-secondary)]">
                    • {fu}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InterviewPage() {
  const { resumeText, jobDescription, setResumeText, setJobDescription, hasResume, hasJobDescription } = useSession();
  const [focusArea, setFocusArea] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewPrep | null>(null);

  const handleGenerate = async () => {
    if (!resumeText.trim()) {
      setError("Resume text is required.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const prep = await api.generateInterview(
        resumeText,
        jobDescription || undefined,
        focusArea !== "all" ? focusArea : undefined
      );
      setResult(prep);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Interview Prep"
        description="Generate tailored interview questions based on your experience and target role."
        icon={<GraduationCap size={22} className="text-white" />}
      />

      {/* Input Form */}
      {!result && (
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Session indicator */}
          {hasResume && (
            <div className="flex items-center gap-2 text-sm text-[var(--brand-400)] glass-card py-3 px-4">
              <CheckCircle2 size={14} />
              <span>
                Resume text loaded from your session.
                {hasJobDescription && " Job description also available."}
              </span>
            </div>
          )}
          {!hasResume && (
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] glass-card py-3 px-4">
              <FileText size={14} />
              <span>
                Tip: <Link href="/resume" className="text-[var(--brand-400)] hover:underline">Analyze your resume</Link> first to auto-populate the text here.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Resume Text <span className="text-red-400">*</span>
              </label>
              <textarea
                id="interview-resume-input"
                className="textarea-field"
                rows={10}
                placeholder="Paste your resume text here…"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Job Description <span className="text-[var(--text-muted)]">(optional)</span>
                </label>
                <textarea
                  id="interview-jd-input"
                  className="textarea-field"
                  rows={6}
                  placeholder="Paste the target job description for more relevant questions…"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Focus Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["all", "technical", "hr", "project"].map((area) => (
                    <button
                      key={area}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border transition-all ${focusArea === area
                          ? "bg-[var(--brand-600)]/20 border-[var(--brand-500)] text-[var(--brand-400)]"
                          : "bg-transparent border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
                        }`}
                      onClick={() => setFocusArea(area)}
                    >
                      {capitalize(area)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              id="generate-interview-btn"
              className="btn-primary"
              disabled={!resumeText.trim() || loading}
              onClick={handleGenerate}
            >
              {loading ? "Generating…" : "Generate Questions"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <LoadingSpinner message="AI is generating interview questions based on your experience…" />
      )}

      {error && (
        <div className="mt-6">
          <ErrorDisplay message={error} onRetry={() => setError(null)} />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 stagger-children">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Generated <span className="text-white font-medium">{result.questions.length} questions</span>
            </p>
            <button
              className="btn-secondary text-xs py-2 px-4"
              onClick={() => setResult(null)}
            >
              Generate New
            </button>
          </div>

          {/* Category filter summary */}
          <div className="flex flex-wrap gap-3">
            {["technical", "hr", "project", "conceptual"].map((cat) => {
              const count = result.questions.filter(
                (q) => q.category.toLowerCase() === cat
              ).length;
              if (count === 0) return null;
              return (
                <div
                  key={cat}
                  className="glass-card py-2 px-4 flex items-center gap-2"
                >
                  <span className={`badge text-[0.65rem] ${categoryColor(cat)}`}>
                    {capitalize(cat)}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {count} questions
                  </span>
                </div>
              );
            })}
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {result.questions.map((q, i) => (
              <QuestionCard key={i} question={q} index={i} />
            ))}
          </div>

          {/* General Tips */}
          {result.general_tips.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb size={18} className="text-amber-400" />
                General Interview Tips
              </h2>
              <div className="space-y-2">
                {result.general_tips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 rounded-lg bg-[var(--surface-800)]/50"
                  >
                    <span className="text-amber-400 text-xs mt-0.5">💡</span>
                    <p className="text-sm text-[var(--text-secondary)]">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
