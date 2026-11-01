"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Upload, Sparkles, Shield, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CameraCapture } from "@/components/scan/CameraCapture";
import { saveStoredCurrentAnalysis } from "@/lib/store/local-store";

const SAMPLE_PRESETS = [
  {
    id: "preset-1",
    label: "Combination Skin Sample",
    desc: "Visible pores & mild T-zone shine",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "preset-2",
    label: "Dry & Sensitive Sample",
    desc: "Dehydration signs & mild redness",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "preset-3",
    label: "Blemish Prone Sample",
    desc: "Surface congestion & texture marks",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ScanPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"choose" | "camera" | "preview" | "analyzing">("choose");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisPhase, setAnalysisPhase] = useState<string>("Initializing...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg("Selected photograph exceeds the 10MB size limit.");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMode("preview");
      setErrorMsg(null);
    }
  };

  const handleSelectPreset = async (presetUrl: string) => {
    setPreviewUrl(presetUrl);
    setMode("preview");
    setSelectedFile(null);
  };

  const handleCameraCapture = (blob: Blob, url: string) => {
    const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
    setSelectedFile(file);
    setPreviewUrl(url);
    setMode("preview");
  };

  const handleStartAnalysis = async () => {
    setMode("analyzing");
    setErrorMsg(null);

    try {
      setAnalysisPhase("Preparing image buffer & client validation...");
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisPhase("Submitting photograph to YouCam Skin AI engine...");

      let bodyData: any;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const res = await fetch("/api/skin-analysis", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("API analysis request failed");
        bodyData = await res.json();
      } else if (previewUrl) {
        // Preset image analysis
        const res = await fetch("/api/skin-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageUrl: previewUrl,
            fileName: "preset_scan.jpg",
            imageBase64: "dGVzdF9kZW1v", // Demo identifier
          }),
        });
        if (!res.ok) throw new Error("API analysis request failed");
        bodyData = await res.json();
      }

      setAnalysisPhase("Extracting 16 skin health metrics & heatmap masks...");
      await new Promise((r) => setTimeout(r, 800));

      setAnalysisPhase("Generating personalized insights & routine guidance...");
      await new Promise((r) => setTimeout(r, 600));

      if (bodyData && bodyData.data) {
        saveStoredCurrentAnalysis({
          ...bodyData.data,
          imageUrl: previewUrl || undefined,
        });
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response format received from backend");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || "Failed to complete analysis. Please try again.");
      setMode("preview");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 sm:py-18">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-sage-700 bg-brand-sage-50 px-3 py-1 rounded-full border border-brand-sage-200">
          Step 01: Computer Vision
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-content-primary">
          AI Facial Skin Scan
        </h1>
        <p className="text-sm text-content-muted leading-relaxed">
          Capture or upload a clear, front-facing selfie. The YouCam Skin AI pipeline evaluates 16 visible cosmetic metrics from pores to barrier hydration.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-brand-terracotta-50 border border-brand-terracotta-200 text-brand-terracotta-700 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* --- MODE 1: CHOOSE INPUT METHOD --- */}
      {mode === "choose" && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Camera Option */}
            <div
              onClick={() => setMode("camera")}
              className="rounded-3xl border border-border-subtle bg-white p-8 shadow-card hover:shadow-hover hover:border-brand-sage-400 transition-all cursor-pointer flex flex-col items-center text-center space-y-4 group"
            >
              <div className="h-16 w-16 rounded-2xl bg-brand-sage-50 border border-brand-sage-200 flex items-center justify-center text-brand-sage-600 group-hover:scale-110 transition-transform">
                <Camera className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-content-primary">Use Device Camera</h3>
              <p className="text-xs text-content-muted leading-relaxed max-w-xs">
                Open your webcam with our interactive face-alignment oval and real-time lighting guide.
              </p>
              <Button size="md" variant="primary" className="rounded-xl w-full mt-2">
                Open Camera
              </Button>
            </div>

            {/* Upload Option */}
            <label className="rounded-3xl border border-border-subtle bg-white p-8 shadow-card hover:shadow-hover hover:border-brand-sage-400 transition-all cursor-pointer flex flex-col items-center text-center space-y-4 group">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="h-16 w-16 rounded-2xl bg-brand-sand-100 border border-border-subtle flex items-center justify-center text-brand-sage-700 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-content-primary">Upload Photograph</h3>
              <p className="text-xs text-content-muted leading-relaxed max-w-xs">
                Select an existing front-facing selfie from your computer or phone (JPG, PNG up to 10MB).
              </p>
              <span className="inline-flex items-center justify-center font-medium transition-all duration-200 h-11 px-5 text-sm rounded-xl gap-2 bg-surface-subtle text-content-primary hover:bg-brand-sand-200 border border-border-subtle w-full mt-2">
                Choose Image File
              </span>
            </label>
          </div>

          {/* Quick-Test Presets for Hackathon Judges */}
          <div className="p-6 rounded-3xl bg-surface-subtle/70 border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-sage-500" />
                <h4 className="font-semibold text-xs text-content-primary uppercase tracking-wider">
                  Hackathon Judge Presets (Instant 1-Click Evaluation)
                </h4>
              </div>
              <span className="text-[11px] text-content-muted">No webcam required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.url)}
                  className="p-3 rounded-2xl border border-border-subtle bg-white hover:border-brand-sage-400 hover:shadow-soft transition-all text-left flex items-center gap-3 group"
                >
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden shrink-0 border border-border-subtle">
                    <Image
                      src={preset.url}
                      alt={preset.label}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-content-primary truncate">{preset.label}</p>
                    <p className="text-[10px] text-content-muted truncate">{preset.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Best Practice Tips */}
          <div className="rounded-2xl border border-border-subtle/80 bg-white p-5 flex items-start gap-3.5 text-xs text-content-muted">
            <Shield className="h-5 w-5 text-brand-sage-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-content-primary">Photography Instructions for Accuracy: </span>
              Face a natural, even light source. Keep your face centered, hair off the forehead, and remove glasses. Avoid applying heavy makeup or filters prior to analysis.
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 2: WEBCAM CAPTURE --- */}
      {mode === "camera" && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={() => setMode("choose")}
        />
      )}

      {/* --- MODE 3: PREVIEW & CONFIRM --- */}
      {mode === "preview" && previewUrl && (
        <div className="max-w-md mx-auto rounded-3xl border border-border-subtle bg-white p-6 shadow-2xl space-y-6">
          <h3 className="font-semibold text-base text-content-primary text-center">
            Confirm Your Photo for AI Skin Analysis
          </h3>

          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-border-subtle shadow-inner">
            <Image
              src={previewUrl}
              alt="Scan Preview"
              fill
              sizes="400px"
              className="object-cover object-center"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                setMode("choose");
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className="flex-1"
            >
              Choose Different
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleStartAnalysis}
              className="flex-1 gap-2 shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze with YouCam</span>
            </Button>
          </div>
        </div>
      )}

      {/* --- MODE 4: ANALYZING STATE --- */}
      {mode === "analyzing" && (
        <div className="max-w-md mx-auto rounded-3xl border border-border-subtle bg-white p-10 shadow-2xl text-center space-y-6">
          <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-brand-sage-100 animate-ping opacity-30" />
            <div className="h-16 w-16 rounded-full bg-brand-sage-50 border-2 border-brand-sage-500 flex items-center justify-center text-brand-sage-600 shadow-soft">
              <RefreshCw className="h-7 w-7 animate-spin" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-content-primary">
              Analyzing Facial Skin
            </h3>
            <p className="text-xs text-brand-sage-700 font-medium animate-pulse">
              {analysisPhase}
            </p>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="h-2 w-2 rounded-full bg-brand-sage-500 animate-bounce" />
            <span className="h-2 w-2 rounded-full bg-brand-sage-400 animate-bounce delay-100" />
            <span className="h-2 w-2 rounded-full bg-brand-sage-300 animate-bounce delay-200" />
          </div>

          <p className="text-[11px] text-content-faint">
            Communication with YouCam REST API server is encrypted. Processing usually takes 2–5 seconds.
          </p>
        </div>
      )}
    </div>
  );
}
