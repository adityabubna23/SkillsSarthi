"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Route,
  MessageCircle,
  GraduationCap,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Resume Analyzer",
    href: "/resume",
    icon: <FileText size={20} />,
  },
  {
    label: "Job Matcher",
    href: "/jobs",
    icon: <Briefcase size={20} />,
  },
  {
    label: "Skill Roadmap",
    href: "/roadmap",
    icon: <Route size={20} />,
  },
  {
    label: "Interview Prep",
    href: "/interview",
    icon: <GraduationCap size={20} />,
  },
  {
    label: "Career Assistant",
    href: "/career",
    icon: <MessageCircle size={20} />,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        id="mobile-menu-toggle"
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[var(--surface-800)] border border-[var(--glass-border)] lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn("sidebar", isOpen && "open")}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 px-6 py-6 border-b border-[var(--glass-border)]"
            onClick={() => setIsOpen(false)}
          >
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">
                SkillSathi
              </h1>
              <p className="text-[0.65rem] font-medium text-[var(--brand-400)] tracking-wider uppercase">
                Your Skills. Your Future.
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[var(--brand-600)]/15 text-[var(--brand-400)] border border-[var(--brand-600)]/20"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] border border-transparent"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-[var(--glass-border)]">
            <div className="glass-card p-4 text-center">
              <p className="text-xs text-[var(--text-muted)] mb-2">
                Powered by AI
              </p>
              <p className="text-[0.65rem] text-[var(--text-muted)]">
                Results are AI-generated estimates.
                <br />
                Not guaranteed outcomes.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
