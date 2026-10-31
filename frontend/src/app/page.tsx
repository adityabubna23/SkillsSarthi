import Link from "next/link";
import {
  Sparkles,
  FileText,
  Briefcase,
  Route,
  GraduationCap,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: <FileText size={24} />,
    title: "Resume Analyzer",
    description:
      "Upload your PDF resume and get AI-powered analysis with structured extraction of skills, experience, and actionable improvement recommendations.",
    href: "/resume",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    icon: <Briefcase size={24} />,
    title: "Job Matcher",
    description:
      "Paste any job description and instantly see how your profile matches — skills alignment, gaps, and a detailed compatibility breakdown.",
    href: "/jobs",
    gradient: "from-purple-600 to-purple-400",
  },
  {
    icon: <Route size={24} />,
    title: "Skill Roadmap",
    description:
      "Get a personalized learning path with prioritized skill recommendations, practice projects, and realistic timelines.",
    href: "/roadmap",
    gradient: "from-emerald-600 to-emerald-400",
  },
  {
    icon: <GraduationCap size={24} />,
    title: "Interview Prep",
    description:
      "Generate tailored interview questions based on your actual experience and target role — technical, HR, project-based, and conceptual.",
    href: "/interview",
    gradient: "from-amber-600 to-amber-400",
  },
  {
    icon: <MessageCircle size={24} />,
    title: "Career Assistant",
    description:
      "Chat with an AI career companion for personalized guidance on resume writing, skill development, and career planning.",
    href: "/career",
    gradient: "from-rose-600 to-rose-400",
  },
];

const principles = [
  {
    icon: <CheckCircle2 size={20} />,
    title: "Skills Over Pedigree",
    description: "We evaluate based on demonstrated skills, projects, and knowledge — never college prestige.",
  },
  {
    icon: <Zap size={20} />,
    title: "Actionable Guidance",
    description: "Every analysis comes with concrete next steps you can take today.",
  },
  {
    icon: <Shield size={20} />,
    title: "Honest & Transparent",
    description: "AI scores are heuristic estimates. We never guarantee hiring outcomes.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--glass-border)] bg-[var(--surface-900)]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between" style={{ padding: "0 48px" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">SkillSathi AI</span>
          </div>
          <Link href="/dashboard" className="btn-primary text-sm py-2.5 px-5">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ paddingTop: "160px", paddingBottom: "100px", paddingLeft: "48px", paddingRight: "48px" }}>
        {/* Decorative orbs */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--brand-600)]/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[var(--accent-500)]/8 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--brand-600)]/10 border border-[var(--brand-600)]/20 text-[var(--brand-400)] text-sm font-medium mb-6 animate-fade-in-up">
            <Sparkles size={14} />
            AI-Powered Career Companion
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] animate-fade-in-up" style={{ marginBottom: "24px", animationDelay: "0.1s" }}>
            Your Skills.{" "}
            <span className="bg-gradient-to-r from-[var(--brand-400)] to-[var(--accent-400)] bg-clip-text text-transparent">
              Your Future.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto animate-fade-in-up" style={{ marginBottom: "40px", animationDelay: "0.2s" }}>
            Understand your strengths, identify your gaps, and become better
            prepared for meaningful career opportunities — powered by AI that
            values your skills over your pedigree.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/resume" className="btn-primary text-base py-3.5 px-6">
              Analyze Your Resume <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-base py-3.5 px-6">
              Explore Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: "80px 48px" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center" style={{ marginBottom: "56px" }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ marginBottom: "16px" }}>
              Everything you need to level up
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              From resume analysis to interview preparation — a complete career toolkit built for students and job seekers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="glass-card group cursor-pointer"
                style={{ padding: "32px" }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  style={{ marginBottom: "20px" }}
                >
                  <span className="text-white">{feature.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-[var(--brand-400)] transition-colors" style={{ marginBottom: "8px" }}>
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center gap-1 text-sm text-[var(--brand-400)] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ marginTop: "20px" }}>
                  Get started <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-[var(--glass-border)]" style={{ padding: "80px 48px" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center" style={{ marginBottom: "48px" }}>
            Built on principles that matter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "40px" }}>
            {principles.map((principle, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-600)]/15 flex items-center justify-center mx-auto text-[var(--brand-400)]" style={{ marginBottom: "16px" }}>
                  {principle.icon}
                </div>
                <h3 className="text-base font-semibold text-white" style={{ marginBottom: "8px" }}>
                  {principle.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--glass-border)]" style={{ padding: "40px 48px" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--brand-400)]" />
            <span className="text-sm font-semibold text-white">
              SkillSathi AI
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Open source · MIT License · AI results are estimates, not guarantees
          </p>
        </div>
      </footer>
    </div>
  );
}
