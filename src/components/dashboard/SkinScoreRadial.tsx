"use client";

import React from "react";
import { Sparkles, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getScoreGrade } from "@/lib/utils";

interface SkinScoreRadialProps {
  score: number;
  skinType: string;
  analysisDate?: string;
  isDemoData?: boolean;
}

export function SkinScoreRadial({
  score,
  skinType,
  analysisDate,
  isDemoData = false,
}: SkinScoreRadialProps) {
  const grade = getScoreGrade(score);
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-white p-7 shadow-card flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-sage-500 animate-pulse" />
          <h2 className="text-sm uppercase tracking-wider font-semibold text-content-primary">
            Overall Skin Health Index
          </h2>
        </div>

        {isDemoData ? (
          <Badge variant="sand" className="text-[10px] bg-brand-sand-100/80">
            Demo Dataset
          </Badge>
        ) : (
          <Badge variant="sage" className="text-[10px]">
            YouCam AI Live
          </Badge>
        )}
      </div>

      {/* Main Radial Progress Display */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 my-6">
        <div className="relative h-44 w-44 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#F0EEE8"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="#3B5E4F"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Numeric Value */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-bold tracking-tight text-content-primary">
              {score}
            </span>
            <span className="text-xs text-content-muted font-medium">/ 100</span>
          </div>
        </div>

        {/* Diagnostic Metadata Column */}
        <div className="space-y-3 text-center sm:text-left">
          <div>
            <span className="text-xs text-content-muted uppercase tracking-wider font-medium">
              Diagnostic Classification
            </span>
            <p className="text-xl font-bold text-content-primary capitalize">
              {grade.label}
            </p>
          </div>

          <div>
            <span className="text-xs text-content-muted uppercase tracking-wider font-medium">
              Assessed Skin Phototype
            </span>
            <p className="text-base font-semibold text-brand-sage-700 capitalize flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-sage-500" />
              <span>{skinType} Skin Profile</span>
            </p>
          </div>

          {analysisDate && (
            <p className="text-xs text-content-faint flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="h-3 w-3" />
              <span>Scanned {new Date(analysisDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </p>
          )}
        </div>
      </div>

      {/* Action Footer Callout */}
      <div className="pt-4 border-t border-border-subtle/70 text-xs text-content-muted leading-relaxed">
        Your facial profile reflects steady barrier strength. Routine adjustments below are prioritized for your specific skin concerns.
      </div>
    </div>
  );
}
