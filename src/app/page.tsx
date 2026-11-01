"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Scan, ArrowRight, ShieldCheck, IndianRupee, Layers, CheckCircle2, HeartHandshake, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold shadow-2xs">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>YouCam Skin AI Hackathon • Perfect Corp</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.08]">
                Your Skin Deserves <br />
                <span className="text-emerald-600 font-serif italic">A Smarter Routine.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Understand your visible skin concerns with precision AI facial analysis. Build a dermatologist-safe routine and discover verified skincare products that strictly respect your budget.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/scan" className="w-full sm:w-auto">
                  <Button size="lg" variant="primary" className="w-full sm:w-auto h-14 px-8 text-base font-semibold gap-3 shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl">
                    <Scan className="h-5 w-5" />
                    <span>Start Skin Analysis</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold gap-2.5 border-slate-300 hover:border-emerald-600 hover:text-emerald-700 rounded-2xl">
                    <IndianRupee className="h-4 w-4 text-emerald-600" />
                    <span>Explore Marketplace</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-slate-600">
                <span className="flex items-center gap-2 font-medium">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> 16 Concern Metrics
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Zero Medical Hallucinations
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <IndianRupee className="h-5 w-5 text-emerald-600" /> Budget-Conscious Curation
                </span>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                <Image
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80"
                  alt="AI Facial Analysis Demo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  priority
                  className="object-cover object-center"
                />

                {/* Overlay Badge Card */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200/90 shadow-md flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900">Skin Score 78/100</span>
                    <p className="text-[11px] text-slate-500">Combination • Balanced Barrier</p>
                  </div>
                </div>

                {/* Floating Budget Routine Callout */}
                <div className="absolute bottom-6 inset-x-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl border border-slate-200/90 shadow-card flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
                      Budget Regimen Solved
                    </span>
                    <p className="text-base font-bold text-slate-900">Cleanser + Cream + SPF</p>
                    <p className="text-xs text-slate-500">Total: ₹1,031 (Under ₹1,500 Cap)</p>
                  </div>
                  <Link href="/routine">
                    <Button size="sm" variant="secondary" className="text-xs h-9 px-4 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (4 STEPS) --- */}
      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="text-center max-w-2xl mx-auto space-y-3.5 mb-16">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
            The Connected Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            From Scan to Shelf in Four Guided Steps
          </h2>
          <p className="text-base text-slate-600">
            Traditional skincare starts with random hype. SKINMATE AI begins with your skin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {[
            {
              step: "01",
              title: "Analyse Your Skin",
              desc: "Upload or capture a front-facing selfie. The YouCam Skin AI engine assesses up to 16 visible concern areas.",
              icon: Scan,
            },
            {
              step: "02",
              title: "Understand Insights",
              desc: "View diagnostic scores in plain English, with heatmap overlays revealing pores, texture, and blemish clusters.",
              icon: Eye,
            },
            {
              step: "03",
              title: "Build Your Routine",
              desc: "Receive an essential 3-step morning and evening routine with automatic ingredient clash detection.",
              icon: Layers,
            },
            {
              step: "04",
              title: "Shop Within Budget",
              desc: "Discover real catalog products in INR, with one-click affordable alternatives to prevent overspending.",
              icon: IndianRupee,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-card space-y-4 hover:border-emerald-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-serif text-3xl font-bold text-slate-300">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- CORE DIFFERENTIATORS / HIGHLIGHTS --- */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3.5">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800">
              Why SKINMATE AI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Intelligence That Solves Real Shopping Confusion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-card space-y-5 hover:border-emerald-300 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-2xl">
                ₹
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Combinatorial Budget Optimizer
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Set a budget cap of ₹500, ₹1,500, or ₹3,000. Our deterministic solver computes the most effective 3-step routine (Cleanser + Moisturiser + Sunscreen) without exceeding your limit.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-card space-y-5 hover:border-emerald-300 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Smart Active Conflict Guard
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Prevents barrier damage by flagging contraindicated actives (e.g. Salicylic Acid + Retinol in the same step) and enforces daytime SPF whenever exfoliating acids are present.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-card space-y-5 hover:border-emerald-300 transition-colors">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Agentic Shopping Concierge
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Conversational assistant equipped with real tools: search products, compare formulas, recalculate budgets, and generate interactive action cards with human confirmation safeguards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION BANNER --- */}
      <section className="max-w-[1480px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="rounded-3xl bg-slate-950 text-white p-10 sm:p-16 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 border border-slate-800">
          <div className="space-y-3.5 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Ready to Understand Your Skin?
            </h2>
            <p className="text-base text-slate-300 max-w-xl leading-relaxed">
              Take your first scan or set up your skincare profile in under 2 minutes. Completely free during the hackathon evaluation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
            <Link href="/scan" className="w-full sm:w-auto">
              <Button size="lg" variant="white" className="w-full sm:w-auto h-14 px-8 text-base font-semibold gap-2.5 bg-emerald-600 text-white hover:bg-emerald-700 border-none rounded-2xl">
                <span>Start Free Scan</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-transparent text-white border-slate-700 hover:bg-white/10 rounded-2xl">
                <span>Create Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
