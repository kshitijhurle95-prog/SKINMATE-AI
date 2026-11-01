"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { saveStoredProfile, DEFAULT_PROFILE } from "@/lib/store/local-store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoActive, setDemoActive] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Persist session locally and simulate clean authentication
    setTimeout(() => {
      saveStoredProfile({
        ...DEFAULT_PROFILE,
        id: "auth-user-" + Date.now(),
        displayName: email.split("@")[0] || "User",
      });
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleJudgeBypass = () => {
    setDemoActive(true);
    saveStoredProfile(DEFAULT_PROFILE);
    setTimeout(() => {
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="mb-4">
            <Logo size="lg" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-600 mt-1">
            Access your personalized skin diagnostics, routines, and progress tracking.
          </p>
        </div>

        {/* Hackathon Judge Quick-Start Banner */}
        <div className="mb-6 p-4 rounded-xl bg-forest-50 border border-forest-200/80 shadow-xs">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-forest-900 block mb-0.5">Hackathon Judge & Evaluator Fast Access</span>
              <p className="text-forest-800 leading-relaxed mb-2.5">
                Bypass registration to test the YouCam Skin AI diagnostics, active ingredient safety guard, and routine optimizer instantly.
              </p>
              <button
                type="button"
                onClick={handleJudgeBypass}
                disabled={demoActive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-600 hover:bg-forest-700 text-cream-50 font-medium text-xs transition shadow-xs cursor-pointer"
              >
                {demoActive ? "Loading Demo Profile..." : "One-Click Judge Demo Sign-In"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 sm:p-8 bg-cream-50 border border-sand-200 shadow-sm">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("For demo purposes, click 'One-Click Judge Demo Sign-In' or enter any password."); }} className="text-xs text-forest-700 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In to SKINMATE"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-sand-200 text-center">
            <p className="text-xs text-slate-600">
              Don&apos;t have an account yet?{" "}
              <Link href="/signup" className="text-forest-700 font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </Card>

        {/* Privacy Note */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0" />
          <span>Biometric privacy: Facial scans are never shared without explicit permission.</span>
        </div>
      </div>
    </div>
  );
}
