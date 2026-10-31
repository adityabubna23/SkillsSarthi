"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  ArrowRight,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import type { JobMatchResult } from "@/types/api";
import {
  PageHeader,
  LoadingSpinner,
  ErrorDisplay,
} from "@/components/ui/shared";
import { formatPercent } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";

export default function JobsPage() {
  const { resumeText, jobDescription, setResumeText, setJobDescription, hasResume } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Both resume text and job description are required.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const matchResult = await api.matchJob(resumeText, jobDescription);
      setResult(matchResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Matching failed");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    if (score >= 25) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <>
      <PageHeader
        title="Job Matcher"
        description="Compare your profile against any job description to see how well you match."
        icon={<Briefcase size={22} className="text-white" />}
      />

      {/* Input Form */}
      {!result && (
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Session indicator */}
          {hasResume && (
            <div className="flex items-center gap-2 text-sm text-[var(--brand-400)] glass-card py-3 px-4">
              <CheckCircle2 size={14} />
              <span>Resume text loaded from your analysis session.</span>
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
                Resume Text
              </label>
              <textarea
                id="job-resume-input"
                className="textarea-field"
                rows={10}
                placeholder="Paste your resume text here…"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Job Description
              </label>
              <textarea
                id="job-description-input"
                className="textarea-field"
                rows={10}
                placeholder="Paste the full job description here…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Include requirements, responsibilities, and qualifications.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              id="match-job-btn"
              className="btn-primary"
              disabled={!resumeText.trim() || !jobDescription.trim() || loading}
              onClick={handleMatch}
            >
              {loading ? "Matching…" : "Match Against Job"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <LoadingSpinner message="AI is comparing your profile against the job… This may take 15-30 seconds." />
      )}

      {error && (
        <div className="mt-6">
          <ErrorDisplay message={error} onRetry={() => setError(null)} />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 stagger-children">
          <div className="flex items-center justify-end">
            <button
              className="btn-secondary text-xs py-2 px-4"
              onClick={() => setResult(null)}
            >
              New Match
            </button>
          </div>

          {/* Score */}
          <div className="glass-card p-8 text-center">
            <div className="flex flex-col items-center">
              <div
                className="score-ring mb-4"
                style={{ "--score": result.compatibility_score } as React.CSSProperties}
              >
                <span className={`text-3xl font-bold ${scoreColor(result.compatibility_score)}`}>
                  {formatPercent(result.compatibility_score)}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Compatibility Score
              </h2>
              <p className="text-sm text-[var(--text-secondary)] max-w-lg">
                {result.score_explanation}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-3 italic">
                This is a heuristic estimate, not an ATS score or hiring prediction.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{result.matching_skills.length}</p>
              <p className="text-xs text-[var(--text-muted)]">Matching Skills</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{result.missing_skills.length}</p>
              <p className="text-xs text-[var(--text-muted)]">Missing Skills</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {result.mandatory_requirements.filter(r => r.met).length}/{result.mandatory_requirements.length}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Mandatory Met</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">
                {result.relevant_projects.length}
              </p>
              <p className="text-xs text-[var(--text-muted)]">Relevant Projects</p>
            </div>
          </div>

          {/* Matching Skills */}
          {result.matching_skills.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400" />
                Matching Skills
              </h2>
              <div className="space-y-2">
                {result.matching_skills.map((skill, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                    <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-white">{skill.skill}</p>
                      <p className="text-xs text-[var(--text-muted)]">{skill.evidence}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {result.missing_skills.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <XCircle size={18} className="text-red-400" />
                Missing Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.map((skill, i) => (
                  <span key={i} className="badge bg-red-500/15 text-red-300 border-red-500/25">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {(result.mandatory_requirements.length > 0 || result.preferred_requirements.length > 0) && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target size={18} className="text-[var(--brand-400)]" />
                Requirements Breakdown
              </h2>
              <div className="space-y-2">
                {result.mandatory_requirements.map((req, i) => (
                  <div key={`m-${i}`} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-800)]/50">
                    {req.met ? (
                      <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{req.requirement}</p>
                        <span className="badge bg-red-500/15 text-red-300 border-red-500/25 text-[0.6rem]">mandatory</span>
                      </div>
                      {req.evidence && <p className="text-xs text-[var(--text-muted)] mt-1">{req.evidence}</p>}
                    </div>
                  </div>
                ))}
                {result.preferred_requirements.map((req, i) => (
                  <div key={`p-${i}`} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--surface-800)]/50">
                    {req.met ? (
                      <CheckCircle2 size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{req.requirement}</p>
                        <span className="badge bg-blue-500/15 text-blue-300 border-blue-500/25 text-[0.6rem]">preferred</span>
                      </div>
                      {req.evidence && <p className="text-xs text-[var(--text-muted)] mt-1">{req.evidence}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gaps & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.gaps.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-400" />
                  Potential Gaps
                </h2>
                <ul className="space-y-2">
                  {result.gaps.map((gap, i) => (
                    <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                      <span className="text-orange-400">•</span> {gap}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.suggestions.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb size={18} className="text-[var(--brand-400)]" />
                  Improvement Suggestions
                </h2>
                <ul className="space-y-2">
                  {result.suggestions.map((sug, i) => (
                    <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                      <span className="text-[var(--brand-400)]">•</span> {sug}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
