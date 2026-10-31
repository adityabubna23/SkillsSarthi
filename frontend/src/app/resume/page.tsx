"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  GraduationCap,
  Code2,
  Building2,
  FolderKanban,
  Award,
  Trophy,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  ShieldCheck,
  Briefcase,
  Route,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import type { ResumeAnalysis } from "@/types/api";
import {
  PageHeader,
  LoadingSpinner,
  ErrorDisplay,
} from "@/components/ui/shared";
import { useSession } from "@/hooks/useSession";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);

  const { populateResumeTextFromAnalysis, hasResume } = useSession();

  const handleFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are accepted.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File too large. Maximum size is 10 MB.");
      return;
    }
    setFile(f);
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const analysis = await api.analyzeResume(file);
      setResult(analysis);
      // Save to shared session so other pages can use it
      populateResumeTextFromAnalysis(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Resume Analyzer"
        description="Upload your PDF resume for AI-powered analysis and recommendations."
        icon={<FileText size={22} className="text-white" />}
      />

      {/* Upload Area */}
      {!result && (
        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div
            className={`upload-area ${isDragOver ? "drag-over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() =>
              document.getElementById("resume-file-input")?.click()
            }
          >
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <Upload
              size={40}
              className="mx-auto mb-4 text-[var(--text-muted)]"
            />
            <p className="text-lg font-semibold text-white mb-2">
              {file ? file.name : "Drop your resume here"}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {file
                ? `${(file.size / 1024).toFixed(0)} KB · Ready to analyze`
                : "PDF files up to 10 MB"}
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <button
              id="analyze-resume-btn"
              className="btn-primary"
              disabled={!file || loading}
              onClick={handleAnalyze}
            >
              {loading ? "Analyzing…" : "Analyze Resume"}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <LoadingSpinner message="AI is analyzing your resume… This may take 15-30 seconds." />
      )}

      {/* Error State */}
      {error && (
        <div className="mt-6">
          <ErrorDisplay message={error} onRetry={() => setError(null)} />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 stagger-children">
          {/* Action to re-upload */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing analysis for <span className="text-white font-medium">{file?.name}</span>
            </p>
            <button
              className="btn-secondary text-xs py-2 px-4"
              onClick={() => {
                setResult(null);
                setFile(null);
              }}
            >
              Analyze Another
            </button>
          </div>

          {/* Quick Navigate Banner */}
          <div className="glass-card p-4 border-[var(--brand-500)]/20 bg-[var(--brand-600)]/5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[var(--brand-400)]">
                <CheckCircle2 size={16} />
                <span className="font-medium">Resume saved to session</span>
              </div>
              <span className="text-[var(--text-muted)] text-xs">—</span>
              <span className="text-xs text-[var(--text-secondary)]">Now use it across all features:</span>
              <div className="flex flex-wrap gap-2">
                <Link href="/jobs" className="badge bg-purple-500/15 text-purple-300 border-purple-500/25 hover:bg-purple-500/25 transition-colors cursor-pointer text-xs">
                  <Briefcase size={12} className="mr-1" /> Job Matcher
                </Link>
                <Link href="/roadmap" className="badge bg-emerald-500/15 text-emerald-300 border-emerald-500/25 hover:bg-emerald-500/25 transition-colors cursor-pointer text-xs">
                  <Route size={12} className="mr-1" /> Skill Roadmap
                </Link>
                <Link href="/interview" className="badge bg-amber-500/15 text-amber-300 border-amber-500/25 hover:bg-amber-500/25 transition-colors cursor-pointer text-xs">
                  <GraduationCap size={12} className="mr-1" /> Interview Prep
                </Link>
                <Link href="/career" className="badge bg-rose-500/15 text-rose-300 border-rose-500/25 hover:bg-rose-500/25 transition-colors cursor-pointer text-xs">
                  <Sparkles size={12} className="mr-1" /> Career Chat
                </Link>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-3">
              📝 Summary
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Contact Info */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              👤 Extracted Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {result.parsed_data.name && (
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} className="text-[var(--brand-400)]" />
                  <span className="text-[var(--text-secondary)]">Name:</span>
                  <span className="text-white">{result.parsed_data.name}</span>
                </div>
              )}
              {result.parsed_data.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-[var(--brand-400)]" />
                  <span className="text-[var(--text-secondary)]">Email:</span>
                  <span className="text-white">{result.parsed_data.email}</span>
                </div>
              )}
              {result.parsed_data.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-[var(--brand-400)]" />
                  <span className="text-[var(--text-secondary)]">Phone:</span>
                  <span className="text-white">{result.parsed_data.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {result.parsed_data.skills.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code2 size={18} className="text-[var(--brand-400)]" />
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.parsed_data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="badge bg-[var(--brand-600)]/15 text-[var(--brand-400)] border-[var(--brand-600)]/25"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {result.parsed_data.education.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <GraduationCap size={18} className="text-[var(--accent-400)]" />
                Education
              </h2>
              <div className="space-y-3">
                {result.parsed_data.education.map((edu, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[var(--surface-800)]/50">
                    <p className="text-sm font-medium text-white">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{edu.institution}{edu.year ? ` · ${edu.year}` : ""}</p>
                    {edu.grade && <p className="text-xs text-[var(--text-muted)] mt-1">Grade: {edu.grade}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {result.parsed_data.experience.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-purple-400" />
                Experience
              </h2>
              <div className="space-y-3">
                {result.parsed_data.experience.map((exp, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[var(--surface-800)]/50">
                    <p className="text-sm font-medium text-white">{exp.title}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{exp.organization}{exp.duration ? ` · ${exp.duration}` : ""}</p>
                    {exp.description.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.description.map((d, j) => (
                          <li key={j} className="text-xs text-[var(--text-muted)] flex gap-2">
                            <span className="text-[var(--text-muted)]">•</span> {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {result.parsed_data.projects.length > 0 && (
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FolderKanban size={18} className="text-emerald-400" />
                Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.parsed_data.projects.map((proj, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[var(--surface-800)]/50">
                    <p className="text-sm font-medium text-white">{proj.name}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{proj.description}</p>
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((t, j) => (
                          <span key={j} className="text-[0.65rem] px-2 py-0.5 rounded bg-[var(--surface-700)] text-[var(--text-muted)]">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications & Achievements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.parsed_data.certifications.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Award size={18} className="text-amber-400" />
                  Certifications
                </h2>
                <ul className="space-y-2">
                  {result.parsed_data.certifications.map((cert, i) => (
                    <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                      <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0 mt-0.5" /> {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.parsed_data.achievements.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Trophy size={18} className="text-yellow-400" />
                  Achievements
                </h2>
                <ul className="space-y-2">
                  {result.parsed_data.achievements.map((ach, i) => (
                    <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                      <Trophy size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" /> {ach}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Strengths & Missing Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-green-400" />
                Strengths
              </h2>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                    <CheckCircle2 size={14} className="text-green-400 flex-shrink-0 mt-0.5" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <XCircle size={18} className="text-orange-400" />
                Missing Information
              </h2>
              <ul className="space-y-2">
                {result.missing_info.map((m, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                    <AlertTriangle size={14} className="text-orange-400 flex-shrink-0 mt-0.5" /> {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lightbulb size={18} className="text-[var(--brand-400)]" />
              Recommendations
            </h2>
            <div className="space-y-2">
              {result.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-lg bg-[var(--surface-800)]/50"
                >
                  <span className="text-xs font-bold text-[var(--brand-400)] bg-[var(--brand-600)]/15 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[var(--text-secondary)]">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Unreadable Sections */}
          {result.unreadable_sections.length > 0 && (
            <div className="glass-card p-6 border-amber-500/20">
              <h2 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
                <AlertTriangle size={18} />
                Unreadable Sections
              </h2>
              <ul className="space-y-1">
                {result.unreadable_sections.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--text-muted)]">• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
}
