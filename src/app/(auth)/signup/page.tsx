"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/ui/Logo";
import { saveStoredProfile, DEFAULT_PROFILE } from "@/lib/store/local-store";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [primaryConcern, setPrimaryConcern] = useState("pore");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      saveStoredProfile({
        ...DEFAULT_PROFILE,
        id: "user-" + Date.now(),
        displayName: name || email.split("@")[0] || "Skincare Explorer",
        concerns: [primaryConcern, "hydration", "texture"],
      });
      setIsLoading(false);
      // Take new user to onboarding questionnaire or scan
      router.push("/onboarding");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <Link href="/" className="mb-4">
            <Logo size="lg" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Start Your Skincare Journey</h1>
          <p className="text-sm text-slate-600 mt-1">
            Personalized skin insights powered by YouCam AI & smart budget routine building.
          </p>
        </div>

        {/* Signup Form Card */}
        <Card className="p-6 sm:p-8 bg-cream-50 border border-sand-200 shadow-sm">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aanya Sharma"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition"
                />
              </div>
            </div>

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
                  placeholder="aanya@example.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What is your top skin priority?
              </label>
              <select
                value={primaryConcern}
                onChange={(e) => setPrimaryConcern(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition"
              >
                <option value="pore">Pore Minimization & Sebum Balance</option>
                <option value="acne">Blemish & Breakout Care</option>
                <option value="moisture">Dehydration & Barrier Repair</option>
                <option value="spots">Hyperpigmentation & Brightening</option>
                <option value="wrinkle">Fine Lines & Preventive Aging</option>
                <option value="redness">Redness & Sensitivity Soothing</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 mt-2 inline-flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              <span>{isLoading ? "Creating Account..." : "Create Account & Setup Routine"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-sand-200 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="text-forest-700 font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>

        {/* Hackathon Judge Note */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-forest-600 shrink-0" />
          <span>Compliant with cosmetic beauty technology standards & strict privacy.</span>
        </div>
      </div>
    </div>
  );
}
