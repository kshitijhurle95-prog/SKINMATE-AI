import React from "react";
import Image from "next/image";

export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textClassName?: string;
}

export function Logo({
  className = "",
  size = "md",
  showText = true,
  textClassName = "",
}: LogoProps) {
  const dimensions = {
    sm: { img: 22, box: "h-8 w-8", title: "text-lg", border: "border" },
    md: { img: 28, box: "h-10 w-10", title: "text-xl", border: "border-[1.5px]" },
    lg: { img: 38, box: "h-13 w-13", title: "text-2xl", border: "border-2" },
    xl: { img: 50, box: "h-16 w-16", title: "text-3xl", border: "border-2" },
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular rounded container with border and transparent bg */}
      <div
        className={`relative ${dimensions.box} rounded-full ${dimensions.border} border-black dark:border-white bg-transparent flex items-center justify-center p-1 shrink-0 transition-transform group-hover:scale-105`}
      >
        <Image
          src="/skinmate-logo.png"
          alt="SKINMATE AI Logo"
          width={dimensions.img}
          height={dimensions.img}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className={`flex items-center gap-1.5 ${textClassName}`}>
          <span className={`font-sans font-bold ${dimensions.title} tracking-tight text-black dark:text-white transition-colors duration-200`}>
            SKINMATE
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-600 text-white font-sans uppercase font-bold tracking-wider">
            AI
          </span>
        </div>
      )}
    </div>
  );
}
