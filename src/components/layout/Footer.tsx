import React from "react";
import Link from "next/link";
import { Shield, HeartHandshake } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/70 pt-20 pb-14 mt-24">
      <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-slate-200/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Understand Your Skin. Shop Smarter. Care Better. An intelligent skincare companion connecting YouCam AI facial diagnostics with transparent, budget-aware product recommendations.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>Developed for the YouCam API Skin AI & eCommerce VTO Hackathon (Perfect Corp)</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-content-primary">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-content-muted">
              <li>
                <Link href="/scan" className="hover:text-brand-sage-500 transition-colors">
                  AI Skin Scanner
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-brand-sage-500 transition-colors">
                  Intelligence Dashboard
                </Link>
              </li>
              <li>
                <Link href="/routine" className="hover:text-brand-sage-500 transition-colors">
                  Routine Generator
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-sage-500 transition-colors">
                  Curated Marketplace
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-brand-sage-500 transition-colors">
                  AI Skincare Assistant
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Ethics */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-content-primary">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-sm text-content-muted">
              <li>
                <Link href="/profile" className="hover:text-brand-sage-500 transition-colors">
                  Privacy & Data Controls
                </Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-brand-sage-500 transition-colors">
                  Skincare Profile
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.makeupar.com/develop/introduction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-sage-500 transition-colors"
                >
                  YouCam Skin AI Docs ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Medical Disclaimer */}
        <div className="pt-8 space-y-4">
          <div className="p-4 rounded-xl bg-brand-sand-100/60 border border-border-subtle/80 flex items-start gap-3 text-xs text-content-muted leading-relaxed">
            <HeartHandshake className="h-5 w-5 text-brand-sage-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-content-primary">Cosmetic Guidance Disclaimer: </span>
              SKINMATE AI provides cosmetic skin observations and product suggestions based on visible facial characteristics. It does not provide medical diagnoses, dermatological prescriptions, or medical treatment plans. For persistent, severe, or painful skin conditions, please consult a qualified healthcare professional or board-certified dermatologist.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-content-faint gap-2">
            <span>© 2026 SKINMATE AI. All rights reserved.</span>
            <span>Crafted with YouCam Skin AI, Next.js, TypeScript & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
