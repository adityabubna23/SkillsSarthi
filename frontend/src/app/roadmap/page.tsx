"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Route,
  ArrowRight,
  BookOpen,
  Target,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import type { SkillGapAnalysis, SkillRecommendation } from "@/types/api";
import {
  PageHeader,
  LoadingSpinner,
  ErrorDisplay,
} from "@/components/ui/shared";
import { importanceColor } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";

function SkillCard({ rec, index }: { rec: SkillRecommendation; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card p-5">
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3">
          <span className="text-xs font-bold text-[var(--brand-400)] bg-[var(--brand-600)]/15 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
            {index + 1}
          </span>
          <div>
            <h3 className="text-sm font-semibold text-white">{rec.skill_name}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs font-medium ${importanceColor(rec.importance)}`}>
                {rec.importance.toUpperCase()}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                Priority: {rec.priority}/10
              </span>
            </div>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-[var(--text-muted)]" />
        ) : (
          <ChevronDown size={16} className="text-[var(--text-muted)]" />
        )}
      </div>

      {expanded && (
        <div className="mt-4 space-y-4 pl-10 border-l-2 border-[var(--glass-border)] ml-3">
          {rec.existing_evidence.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-green-400 mb-1 flex items-center gap-1">
                <Target size={12} /> What you already have
              </h4>
              <ul className="space-y-1">
                {rec.existing_evidence.map((e, i) => (
                  <li key={i} className="text-xs text-[var(--text-secondary)]">• {e}</li>
                ))}
              </ul>
            </div>
          )}

          {rec.missing_knowledge.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-orange-400 mb-1 flex items-center gap-1">
                <BookOpen size={12} /> Knowledge gaps
              </h4>
              <ul className="space-y-1">
                {rec.missing_knowledge.map((m, i) => (
                  <li key={i} className="text-xs text-[var(--text-secondary)]">• {m}</li>
                ))}
              </ul>
            </div>
          )}

          {rec.learning_objectives.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-[var(--brand-400)] mb-1 flex items-center gap-1">
                <Target size={12} /> Learning objectives
              </h4>
              <ul className="space-y-1">
                {rec.learning_objectives.map((l, i) => (
                  <li key={i} className="text-xs text-[var(--text-secondary)]">• {l}</li>
                ))}
              </ul>
            </div>
          )}

          {rec.practice_projects.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-emerald-400 mb-1 flex items-center gap-1">
                🛠️ Practice projects
              </h4>
              <ul className="space-y-1">
                {rec.practice_projects.map((p, i) => (
                  <li key={i} className="text-xs text-[var(--text-secondary)]">• {p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RoadmapPage() {
  const { resumeText, jobDescription, setResumeText, setJobDescription, hasResume, hasJobDescription } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SkillGapAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError("Both resume text and job description are required.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await api.analyzeSkillGap(resumeText, jobDescription);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Skill Roadmap"
        description="Get a personalized learning path to bridge skill gaps between your profile and target roles."
        icon={<Route size={22} className="text-white" />}
      />

      {/* Input Form */}
      {!result && (
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Session indicator */}
          {hasResume && hasJobDescription && (
            <div className="flex items-center gap-2 text-sm text-[var(--brand-400)] glass-card py-3 px-4">
              <CheckCircle2 size={14} />
              <span>Resume and job description loaded from your session.</span>
            </div>
          )}
          {hasResume && !hasJobDescription && (
            <div className="flex items-center gap-2 text-sm text-[var(--brand-400)] glass-card py-3 px-4">
              <CheckCircle2 size={14} />
              <span>Resume text loaded. Add a job description below.</span>
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
                id="roadmap-resume-input"
                className="textarea-field"
                rows={10}
                placeholder="Paste your resume text here…"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Target Job Description
              </label>
              <textarea
                id="roadmap-jd-input"
                className="textarea-field"
                rows={10}
                placeholder="Paste the job description you're targeting…"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              id="generate-roadmap-btn"
              className="btn-primary"
              disabled={!resumeText.trim() || !jobDescription.trim() || loading}
              onClick={handleAnalyze}
            >
              {loading ? "Generating…" : "Generate Roadmap"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {loading && (
        <LoadingSpinner message="AI is building your personalized skill roadmap…" />
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
              New Analysis
            </button>
          </div>

          {/* Summary & Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 md:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-[var(--brand-400)]" />
                Learning Path Summary
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {result.learning_path_summary}
              </p>
            </div>
            <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
              <Clock size={28} className="text-[var(--accent-400)] mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">Estimated Timeline</h3>
              <p className="text-sm text-[var(--accent-400)] font-medium">
                {result.estimated_timeline}
              </p>
            </div>
          </div>

          {/* Skill Recommendations */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">
              Skill Recommendations ({result.recommendations.length})
            </h2>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <SkillCard key={i} rec={rec} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
