"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("skinmate_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("skinmate_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("skinmate_theme", "light");
    }
  };

  if (!mounted) {
    return <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800" />;
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`relative h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
        isDark
          ? "bg-slate-800 text-amber-300 hover:bg-slate-700 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-2xs"
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon */}
        <Sun
          className={`h-4.5 w-4.5 absolute transition-all duration-500 transform ${
            isDark
              ? "opacity-0 rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100 text-amber-500"
          }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`h-4.5 w-4.5 absolute transition-all duration-500 transform ${
            isDark
              ? "opacity-100 rotate-0 scale-100 text-amber-300"
              : "opacity-0 -rotate-90 scale-50"
          }`}
        />
      </div>
    </button>
  );
}
