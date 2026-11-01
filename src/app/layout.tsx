"use client";

import React, { useState } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatDrawer } from "@/components/assistant/ChatDrawer";
import { MessageSquare } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>SKINMATE AI — AI Skincare Intelligence & Smart Shopping</title>
        <meta
          name="description"
          content="Understand Your Skin. Shop Smarter. Care Better. Powered by YouCam Skin AI."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("skinmate_theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-white antialiased selection:bg-emerald-100 selection:text-emerald-800 transition-colors duration-300">
        {/* Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-emerald-700 focus:rounded-xl focus:shadow-lg focus:border focus:border-slate-200"
        >
          Skip to main content
        </a>

        {/* Global Navigation */}
        <Navbar onOpenChat={() => setChatOpen(true)} />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 bg-white dark:bg-black transition-colors duration-300">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Floating AI Assistant Bubble */}
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-30 h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xl flex items-center justify-center tap-bounce group transition-all"
          aria-label="Open AI Skincare Assistant"
        >
          <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="sr-only">Open Skincare Assistant</span>
        </button>

        {/* Global Slide-over Chat Drawer */}
        <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      </body>
    </html>
  );
}
