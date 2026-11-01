"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Scan, Calendar, ShoppingBag, TrendingUp, Sparkles, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/scan", label: "Skin Analysis", icon: Scan },
  { href: "/routine", label: "My Routine", icon: Calendar },
  { href: "/products", label: "Products", icon: ShoppingBag },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

export function Navbar({ onOpenChat }: { onOpenChat?: () => void }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-800 shadow-2xs transition-colors duration-300">
      {/* 100% Width Container */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-20 sm:h-22 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo with Circular Border & Transparent Emblem */}
        <Link href="/" className="group shrink-0">
          <Logo size="md" />
        </Link>

        {/* Center: Wider, Spacious Floating Pill Navbar with Home + Dashboard & Fully Rounded Buttons */}
        <nav className="hidden lg:flex items-center gap-2 lg:gap-3 bg-white/95 dark:bg-zinc-900/90 px-3 py-2 rounded-full border border-slate-200/90 dark:border-zinc-800 shadow-md shrink-0 transition-colors duration-200">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive ? "true" : undefined}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-md font-bold px-6 py-2.5"
                    : "text-slate-700 dark:text-white hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 font-medium"
                )}
              >
                <Icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-white dark:text-black" : "text-slate-600 dark:text-white")} />
                <span className={isActive ? "text-white dark:text-black" : "text-slate-700 dark:text-white"}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Corner: Ask AI + Theme Mode Toggle & User Avatar */}
        <div className="hidden md:flex items-center gap-3.5 shrink-0">
          {onOpenChat ? (
            <button
              onClick={onOpenChat}
              className="flex items-center gap-2 px-5 py-2.5 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all hover:scale-102"
            >
              <Sparkles className="h-4 w-4 text-emerald-200" />
              <span>Ask AI</span>
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </button>
          ) : (
            <Link
              href="/assistant"
              className="flex items-center gap-2 px-5 py-2.5 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition-all"
            >
              <Sparkles className="h-4 w-4 text-emerald-200" />
              <span>Ask AI</span>
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </Link>
          )}

          {/* Connected Capsule: Dark/Light Mode Animated Toggle + Portrait Avatar */}
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 rounded-full p-1 pl-2 shadow-sm">
            <ThemeToggle />

            <Link
              href="/profile"
              aria-label="Profile and Settings"
              className="relative h-9 w-9 rounded-full overflow-hidden border border-slate-200 dark:border-zinc-700 hover:ring-2 hover:ring-emerald-500 transition-all shrink-0"
            >
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="User Profile"
                fill
                sizes="36px"
                className="object-cover"
              />
            </Link>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              aria-label="Open AI Assistant"
              className="p-2.5 rounded-full text-white bg-emerald-600 shadow-xs"
            >
              <Sparkles className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2.5 rounded-full text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-full text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white"
                )}
              >
                <Icon className={cn("h-4.5 w-4.5", isActive ? "text-white dark:text-slate-950" : "text-slate-500 dark:text-slate-400")} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-200 font-semibold"
            >
              <div className="relative h-8 w-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <span>Profile & Preferences</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenChat) onOpenChat();
              }}
              className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs"
            >
              Ask AI
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
