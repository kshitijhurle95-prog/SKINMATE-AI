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
    return { label: "Optimal", colorClass: "text-emerald-700", bgClass: "bg-emerald-50 border-emerald-200" };
  }
  if (score >= 65) {
    return { label: "Mild Concern", colorClass: "text-brand-sage-700", bgClass: "bg-brand-sage-50 border-brand-sage-200" };
  }
  if (score >= 50) {
    return { label: "Moderate Concern", colorClass: "text-amber-700", bgClass: "bg-amber-50 border-amber-200" };
  }
  return { label: "High Attention", colorClass: "text-brand-terracotta-600", bgClass: "bg-brand-terracotta-50 border-brand-terracotta-100" };
}
