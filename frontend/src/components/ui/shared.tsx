"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  message = "Analyzing…",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader2
        className={`${sizeClasses[size]} text-[var(--brand-500)] animate-spin`}
      />
      {message && (
        <p className="text-sm text-[var(--text-secondary)] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
      <div className="text-[var(--text-muted)]">{icon}</div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="text-sm text-[var(--text-secondary)] max-w-md">
        {description}
      </p>
      {action}
    </div>
  );
}

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="glass-card border-red-500/20 p-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-red-400 text-sm font-bold">!</span>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-400 mb-1">
            Something went wrong
          </h4>
          <p className="text-sm text-[var(--text-secondary)]">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 btn-secondary text-xs py-2 px-4"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="mb-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
            {icon}
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      </div>
      <p className="text-[var(--text-secondary)] ml-0 md:ml-13">
        {description}
      </p>
    </div>
  );
}
