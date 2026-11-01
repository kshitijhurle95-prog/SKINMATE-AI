import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getScoreGrade(score: number): {
  label: string;
  colorClass: string;
  bgClass: string;
} {
  if (score >= 80) {
    return {
      label: "Optimal",
      colorClass: "text-emerald-700 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40",
    };
  }
  if (score >= 65) {
    return {
      label: "Mild Concern",
      colorClass: "text-emerald-700 dark:text-emerald-400",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40",
    };
  }
  if (score >= 50) {
    return {
      label: "Moderate Concern",
      colorClass: "text-amber-700 dark:text-amber-400",
      bgClass: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
    };
  }
  return {
    label: "High Attention",
    colorClass: "text-red-700 dark:text-red-400",
    bgClass: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/40",
  };
}
