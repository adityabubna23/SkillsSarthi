"use client";

import Link from "next/link";
import {
  FileText,
  Briefcase,
  Route,
  GraduationCap,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Target,
  Brain,
} from "lucide-react";
import { PageHeader } from "@/components/ui/shared";

const quickActions = [
  {
    title: "Analyze Resume",
    description: "Upload your PDF and get AI-powered insights",
    href: "/resume",
    icon: <FileText size={22} />,
    gradient: "from-blue-600 to-blue-400",
  },
  {
    title: "Match Job",
    description: "Compare your profile against any job description",
    href: "/jobs",
    icon: <Briefcase size={22} />,
    gradient: "from-purple-600 to-purple-400",
  },
  {
    title: "Build Roadmap",
    description: "Get a personalized skill development plan",
    href: "/roadmap",
    icon: <Route size={22} />,
    gradient: "from-emerald-600 to-emerald-400",
  },
  {
    title: "Prep Interview",
    description: "Generate tailored interview questions",
    href: "/interview",
    icon: <GraduationCap size={22} />,
    gradient: "from-amber-600 to-amber-400",
  },
  {
    title: "Career Chat",
    description: "Get personalized career guidance",
    href: "/career",
    icon: <MessageCircle size={22} />,
    gradient: "from-rose-600 to-rose-400",
  },
];

const tips = [
  {
    icon: <TrendingUp size={18} />,
    title: "Start with your resume",
    description:
      "Upload your resume first — it powers all other features like job matching and interview prep.",
  },
  {
    icon: <Target size={18} />,
    title: "Add specific job descriptions",
    description:
      "Copy-paste actual job postings for the most relevant skill gap analysis and match scores.",
  },
  {
    icon: <Brain size={18} />,
    title: "Practice with real questions",
    description:
      "Use interview prep to generate questions based on your actual projects and target role.",
  },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Start your career preparation journey."
        icon={<TrendingUp size={22} className="text-white" />}
      />

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 stagger-children">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="glass-card p-5 group cursor-pointer flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-white">{action.icon}</span>
              </div>
              <ArrowRight
                size={16}
                className="text-[var(--text-muted)] group-hover:text-[var(--brand-400)] group-hover:translate-x-1 transition-all duration-300"
              />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-[var(--brand-400)] transition-colors">
              {action.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {action.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Getting Started Tips */}
      <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-lg font-semibold text-white mb-4">
          💡 Getting Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-xl bg-[var(--surface-800)]/50"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--brand-600)]/15 flex items-center justify-center flex-shrink-0 text-[var(--brand-400)]">
                {tip.icon}
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-1">
                  {tip.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
