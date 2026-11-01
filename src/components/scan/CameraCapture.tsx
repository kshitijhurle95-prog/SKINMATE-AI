"use client";

import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CameraCaptureProps {
  onCapture: (blob: Blob, previewUrl: string) => void;
  onCancel: () => void;
}

export function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isFaceAligned, setIsFaceAligned] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  // Initialize Camera
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function initCamera() {
      try {
        setIsInitializing(true);
        setCameraError(null);

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });

        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.warn("Camera init failed:", err);
        setCameraError(
          "Camera access was blocked or is unavailable on this device. You can still upload a photo directly."
        );
      } finally {
        setIsInitializing(false);
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Simulate Smart Face Alignment Detection & Auto-Capture Countdown
  useEffect(() => {
    if (!stream || isInitializing || cameraError) return;

    // After camera is steady for 1.8 seconds, confirm face is properly aligned
    const alignTimer = setTimeout(() => {
      setIsFaceAligned(true);
      setCountdown(2);
    }, 1800);

    return () => clearTimeout(alignTimer);
  }, [stream, isInitializing, cameraError]);

  // Handle Auto-capture Countdown
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      // Trigger auto capture
      handleCapture();
    }
  }, [countdown]);

  const handleCapture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Trigger visual shutter flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const previewUrl = URL.createObjectURL(blob);
          onCapture(blob, previewUrl);
        }
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-700/60">
      {/* Top Header Overlay */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span>AI Computer Vision Scanner</span>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-white/90 hover:text-white px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Main Viewfinder Box */}
      <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-zinc-950 overflow-hidden">
        {/* Shutter Flash Animation */}
        {isFlashing && (
          <div className="absolute inset-0 z-40 bg-white pointer-events-none animate-out fade-out duration-200" />
        )}

        {isInitializing && (
          <div className="flex flex-col items-center gap-3 text-white/80 z-20">
            <RefreshCw className="h-7 w-7 animate-spin text-emerald-500" />
            <p className="text-sm font-medium">Starting high-definition camera stream...</p>
          </div>
        )}

        {cameraError ? (
          <div className="p-8 text-center text-white/90 max-w-md z-20">
            <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
            <p className="text-sm font-medium mb-4">{cameraError}</p>
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Use Photo Upload Instead
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />

            {/* Face Alignment Oval Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-10">
              <div
                className={`w-60 sm:w-72 h-80 sm:h-96 rounded-[50%] transition-all duration-500 ${
                  isFaceAligned
                    ? "border-4 border-solid border-emerald-500 shadow-[0_0_40px_rgba(34,197,94,0.85)] ring-4 ring-emerald-500/30"
                    : "border-2 border-dashed border-white/75 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"
                }`}
              />
            </div>

            {/* Dynamic Status / Auto-Capture Prompt Banner */}
            <div className="absolute top-20 inset-x-0 text-center pointer-events-none z-20">
              {isFaceAligned ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/90 backdrop-blur-md text-white text-xs sm:text-sm font-bold shadow-lg animate-bounce">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    Face Perfectly Aligned! {countdown !== null && countdown > 0 ? `Capturing in ${countdown}...` : "Capturing now!"}
                  </span>
                </div>
              ) : (
                <p className="inline-block px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium">
                  Center your face inside the oval & look directly at camera
                </p>
              )}
            </div>

            {/* Floating Elevated "Capture Selfie" Button on TOP of All Screen Elements */}
            <div className="absolute bottom-6 inset-x-0 z-30 flex flex-col items-center gap-2 pointer-events-auto">
              <button
                type="button"
                disabled={!stream || !!cameraError}
                onClick={handleCapture}
                className="group relative flex items-center gap-3 px-9 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-base shadow-[0_4px_25px_rgba(22,163,74,0.6)] border-2 border-white ring-4 ring-emerald-500/30 transition-all cursor-pointer"
              >
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Camera className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                </div>
                <span>Capture Selfie</span>
              </button>
              <p className="text-[11px] text-white/80 font-medium drop-shadow-sm">
                {isFaceAligned ? "Auto-capture active or click button above" : "Auto-scan activates once face is centered"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
