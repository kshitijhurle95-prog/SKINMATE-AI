"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, Sparkles, Bot, User, Wrench, CheckCircle2, ArrowRight, Droplets, FlaskConical, Tag, Calendar, Coins } from "lucide-react";
import { ChatMessage, ActionCardData } from "@/types/assistant";
import { formatPriceINR } from "@/lib/utils";
import { ChatMessageContent } from "./ChatMessageContent";
import { getStoredProfile, getStoredCurrentAnalysis, getStoredRoutine, saveStoredRoutine } from "@/lib/store/local-store";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-welcome",
    role: "assistant",
    createdAt: new Date().toISOString(),
    content: "__WELCOME_CARD__",
  },
];

const SUGGESTED_CHIPS = [
  { label: "Routine under ₹1,200", icon: Sparkles, prompt: "Build a routine under ₹1,200" },
  { label: "Cheaper moisturizer", icon: Droplets, prompt: "Find a cheaper moisturizer under ₹400" },
  { label: "Explain my skin scan", icon: FlaskConical, prompt: "Explain my skin scan results" },
  { label: "Oily skin routine", icon: Tag, prompt: "I have oily skin, what routine works best?" },
  { label: "Active safety check", icon: Sparkles, prompt: "Can I use Salicylic Acid and Retinol together?" },
];

export function ChatDrawer({ isOpen, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionConfirmed, setActionConfirmed] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const profile = getStoredProfile();
      const analysis = getStoredCurrentAnalysis();
      const routine = getStoredRoutine();

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.filter((m) => m.content !== "__WELCOME_CARD__"),
          context: {
            userProfile: profile,
            latestAnalysis: analysis,
            currentRoutineProducts: routine.morningSteps.map((s) => s.product),
          },
        }),
      });

      if (!res.ok) throw new Error("Assistant turn failed");

      const data = await res.json();
      if (data.data) {
        setMessages((prev) => [...prev, data.data]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          createdAt: new Date().toISOString(),
          content: "I encountered a brief connection issue. Please try asking again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAction = (card: ActionCardData, msgId: string) => {
    setActionConfirmed((prev) => ({ ...prev, [msgId]: true }));
    if (card.type === "routine_proposal" || card.type === "budget_delta") {
      const current = getStoredRoutine();
      if (card.newTotalINR) {
        current.totalPriceINR = card.newTotalINR;
      }
      saveStoredRoutine(current);
    }
  };

  const userName = getStoredProfile()?.displayName || "Anya";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      {/* Drawer Container: Increased Width to max-w-2xl (672px) */}
      <div className="relative w-full sm:max-w-xl md:max-w-2xl bg-slate-50/95 dark:bg-black/95 backdrop-blur-md h-full shadow-2xl border-l border-slate-200 dark:border-zinc-800 flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-black flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border-[1.5px] border-black dark:border-white bg-transparent flex items-center justify-center p-1 shrink-0">
              <Image
                src="/skinmate-logo.png"
                alt="SKINMATE"
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                SKINMATE AI Assistant
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Agentic Tool Caller Active</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => {
            // Render Welcome Concierge Card
            if (msg.content === "__WELCOME_CARD__") {
              return (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full border border-black dark:border-white bg-transparent flex items-center justify-center shrink-0 p-1 mt-1 shadow-2xs">
                    <Image
                      src="/skinmate-logo.png"
                      alt="SKINMATE AI"
                      width={22}
                      height={22}
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1 rounded-2xl border border-emerald-100 dark:border-zinc-800 bg-gradient-to-br from-white via-emerald-50/20 to-white dark:from-zinc-900 dark:via-zinc-950 dark:to-black p-5 sm:p-6 shadow-xs space-y-4">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        Hello! I&apos;m your <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">SKINMATE AI</span> Skincare Concierge.
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                        I can analyze your YouCam skin scan, calculate budget-friendly skincare routines, compare ingredients, and find affordable product swaps (under ₹1,500).
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                        What would you like to explore today?
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          onClick={() => handleSendMessage("Build my skincare routine")}
                          className="p-3 rounded-xl bg-white dark:bg-black border border-slate-200/90 dark:border-zinc-800 hover:border-emerald-500 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                              <Droplets className="h-4 w-4" />
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-900 dark:text-white">Build my routine</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Get a personalized skincare routine</p>
                          </div>
                        </button>

                        <button
                          onClick={() => handleSendMessage("Analyze my routine ingredients")}
                          className="p-3 rounded-xl bg-white dark:bg-black border border-slate-200/90 dark:border-zinc-800 hover:border-emerald-500 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                              <FlaskConical className="h-4 w-4" />
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-900 dark:text-white">Analyze ingredients</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Understand what&apos;s in your products</p>
                          </div>
                        </button>

                        <button
                          onClick={() => handleSendMessage("Find budget swaps under ₹1,500")}
                          className="p-3 rounded-xl bg-white dark:bg-black border border-slate-200/90 dark:border-zinc-800 hover:border-emerald-500 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                              <Tag className="h-4 w-4" />
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-slate-900 dark:text-white">Find budget swaps</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Get effective alternatives (under ₹1,500)</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Normal User Message
            if (msg.role === "user") {
              return (
                <div key={msg.id} className="flex items-start justify-end gap-3">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-xs bg-emerald-600 text-white px-4 py-2.5 text-sm font-medium shadow-xs">
                    {msg.content}
                  </div>
                  <div className="h-8 w-8 rounded-full border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <User className="h-4 w-4" />
                  </div>
                </div>
              );
            }

            // Normal Assistant Chat Agent Message
            return (
              <div key={msg.id} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full border border-black dark:border-white bg-transparent flex items-center justify-center shrink-0 p-1 mt-1 shadow-2xs">
                  <Image
                    src="/skinmate-logo.png"
                    alt="SKINMATE AI"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 max-w-[88%] rounded-2xl rounded-tl-xs border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 shadow-xs space-y-3">
                  {/* Tool Badge Indicator */}
                  {msg.toolInvoked && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/50 w-fit">
                      <Wrench className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      <span>Action Tool: {msg.toolInvoked.replace(/_/g, " ")}</span>
                    </div>
                  )}

                  {/* Normal Chat Agent Response with Emojis & Bold Actives */}
                  <ChatMessageContent content={msg.content} />

                  {/* Interactive Action Card if solver proposed a routine update */}
                  {msg.actionCard && (
                    <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-zinc-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-800 dark:text-emerald-400">
                          {msg.actionCard.title}
                        </span>
                        {msg.actionCard.priceDifferenceINR && (
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                            Save {formatPriceINR(Math.abs(msg.actionCard.priceDifferenceINR))}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {msg.actionCard.description}
                      </p>

                      <div className="pt-2 flex items-center justify-end">
                        {actionConfirmed[msg.id] ? (
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Approved & Routine Updated</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveAction(msg.actionCard!, msg.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
                          >
                            <span>Approve & Update</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-slate-500 text-xs p-3 bg-white rounded-2xl border border-slate-200 w-fit">
              <Sparkles className="h-4 w-4 animate-spin text-emerald-600" />
              <span>Thinking & formulating personalized answer...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Suggested Chips & Input Form */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-black space-y-3.5 shadow-sm">
          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            {SUGGESTED_CHIPS.map((chip, i) => {
              const Icon = chip.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSendMessage(chip.prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-zinc-900 border border-emerald-200/90 dark:border-zinc-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-600 transition-colors flex items-center gap-1.5 shrink-0 font-medium"
                >
                  <Icon className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form with Rounded-Full Capsule Input & Green Circular Send Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="Ask about skincare, products, or budget..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="w-full h-12 pl-5 pr-14 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-1.5 h-9 w-9 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow-xs"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
