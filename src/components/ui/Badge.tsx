import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "sage" | "terracotta" | "sand" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-surface-subtle text-content-primary border-border-subtle",
    sage: "bg-brand-sage-50 text-brand-sage-700 border-brand-sage-200",
    terracotta: "bg-brand-terracotta-50 text-brand-terracotta-600 border-brand-terracotta-100",
    sand: "bg-brand-sand-100 text-content-muted border-border-subtle",
    outline: "bg-transparent text-content-primary border-border-subtle",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
