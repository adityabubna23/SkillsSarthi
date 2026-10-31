/** Merge CSS class names, filtering out falsy values. */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Format a number as a percentage string. */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Capitalize the first letter of a string. */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Truncate text to a maximum length with ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Get a color class based on importance/priority level. */
export function importanceColor(importance: string): string {
  switch (importance.toLowerCase()) {
    case "critical":
      return "text-red-400";
    case "high":
      return "text-orange-400";
    case "medium":
      return "text-yellow-400";
    case "low":
      return "text-green-400";
    default:
      return "text-slate-400";
  }
}

/** Get a badge color class based on difficulty. */
export function difficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "hard":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "medium":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "easy":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
}

/** Get a badge color class based on category. */
export function categoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case "technical":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "hr":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    case "project":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    case "conceptual":
      return "bg-amber-500/20 text-amber-300 border-amber-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
}
