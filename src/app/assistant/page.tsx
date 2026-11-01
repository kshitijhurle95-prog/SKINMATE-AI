"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bot, User, Send, Sparkles, Wrench, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { ChatMessage, ActionCardData } from "@/types/assistant";
import { Button } from "@/components/ui/Button";
import { ChatMessageContent } from "@/components/assistant/ChatMessageContent";
import { formatPriceINR } from "@/lib/utils";
import { getStoredProfile, getStoredCurrentAnalysis, getStoredRoutine, saveStoredRoutine } from "@/lib/store/local-store";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    createdAt: new Date().toISOString(),
    content: "Welcome to your **SKINMATE AI Skincare Assistant**.\n\nI can analyze your latest skin scan, search our catalog for specific actives, find cheaper product alternatives, and solve for complete routines within your budget.\n\nTry asking me: *'Build a routine under ₹1,200'* or *'Find a cheaper moisturizer'*!",
  },
];

const SUGGESTED_PROMPTS = [
  "Build a routine under ₹1,200",
  "Find a cheaper moisturizer",
  "Explain my skin analysis",
  "Compare Minimalist and Cetaphil cleansers",
  "What does Niacinamide do?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmedCards, setConfirmedCards] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
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
          history: messages,
          context: {
            userProfile: profile,
            latestAnalysis: analysis,
            currentRoutineProducts: routine.morningSteps.map((s) => s.product),
          },
        }),
      });

      if (!res.ok) throw new Error("Assistant response failed");

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
          content: "I encountered an error connecting to backend services. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveAction = (card: ActionCardData, msgId: string) => {
    setConfirmedCards((prev) => ({ ...prev, [msgId]: true }));
    const current = getStoredRoutine();
    if (card.newTotalINR) {
      current.totalPriceINR = card.newTotalINR;
    }
    saveStoredRoutine(current);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-soft">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              AI Skincare Concierge
            </h1>
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Connected to Live Catalog & Budget Solver</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Chat</span>
        </button>
      </div>

      {/* Chat History Box */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card min-h-[550px] flex flex-col justify-between space-y-6">
        <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-soft ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                }`}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white shadow-soft"
                    : "bg-slate-50 border border-slate-200 text-slate-900 shadow-xs"
                }`}
              >
                {/* Tool Badge */}
                {msg.toolInvoked && (
                  <div className="mb-2.5 flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300 w-fit">
                    <Wrench className="h-3 w-3 text-emerald-600" />
                    <span>Tool Invoked: {msg.toolInvoked.replace(/_/g, " ")}</span>
                  </div>
                )}

                {msg.role === "user" ? (
                  <div className="whitespace-pre-line text-white">{msg.content}</div>
                ) : (
                  <ChatMessageContent content={msg.content} />
                )}

                {/* Action Card */}
                {msg.actionCard && (
                  <div className="mt-3.5 p-4 rounded-xl bg-white border border-border-subtle shadow-soft space-y-2.5 text-content-primary">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-brand-sage-700">
                        {msg.actionCard.title}
                      </span>
                      {msg.actionCard.priceDifferenceINR && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Save {formatPriceINR(Math.abs(msg.actionCard.priceDifferenceINR))}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-content-muted leading-relaxed">
                      {msg.actionCard.description}
                    </p>

                    <div className="pt-2 flex items-center justify-end">
                      {confirmedCards[msg.id] ? (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Approved & Routine Updated</span>
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleApproveAction(msg.actionCard!, msg.id)}
                          className="text-xs h-8 gap-1.5"
                        >
                          <span>Approve & Update Routine</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-content-muted text-xs p-3">
              <Sparkles className="h-4 w-4 animate-spin text-brand-sage-500" />
              <span>Analyzing skincare catalog & active safety rules...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Suggested Chips & Prompt Form */}
        <div className="pt-4 border-t border-border-subtle space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap px-3 py-1.5 rounded-full border border-border-subtle bg-surface-subtle text-content-muted hover:text-content-primary hover:border-brand-sage-300 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              placeholder="Ask anything about routines, products, or budget..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isLoading}
              className="flex-1 h-12 px-4 rounded-xl border border-border-subtle bg-surface-subtle/50 text-sm text-content-primary placeholder:text-content-faint focus:outline-none focus:ring-2 focus:ring-brand-sage-500 focus:bg-white transition-all"
            />
            <Button
              type="submit"
              size="icon"
              variant="primary"
              disabled={!inputVal.trim() || isLoading}
              className="h-12 w-12 rounded-xl shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
