"use client";

import React from "react";

export function ChatMessageContent({ content }: { content: string }) {
  // If the content contains markdown table pipes, convert into clean emoji bullet list
  const sanitized = cleanTableMarkdown(content);

  // Split into lines or paragraphs
  const paragraphs = sanitized.split(/\n\s*\n/);

  return (
    <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-slate-800">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split("\n");
        return (
          <div key={pIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return null;

              // Check if it's a heading
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lIdx} className="font-bold text-slate-900 text-sm mt-3 mb-1 flex items-center gap-1.5">
                    {parseInline(trimmed.replace("### ", ""))}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lIdx} className="font-bold text-slate-900 text-base mt-3.5 mb-1.5 flex items-center gap-1.5 border-b border-slate-100 pb-1">
                    {parseInline(trimmed.replace("## ", ""))}
                  </h3>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h2 key={lIdx} className="font-bold text-slate-900 text-lg mt-4 mb-2 flex items-center gap-1.5">
                    {parseInline(trimmed.replace("# ", ""))}
                  </h2>
                );
              }

              // Check if it's an emoji list item or bullet item
              if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const itemBody = trimmed.replace(/^[-•*]\s+/, "");
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1 my-1">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                    <span className="leading-relaxed">{parseInline(itemBody)}</span>
                  </div>
                );
              }

              const numMatch = trimmed.match(/^(\d+[\.\)]|\d+️⃣)\s+(.+)/);
              if (numMatch) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-1 my-1.5">
                    <span className="font-bold text-emerald-700 shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded-md text-[11px] border border-emerald-200">
                      {numMatch[1]}
                    </span>
                    <span className="leading-relaxed">{parseInline(numMatch[2])}</span>
                  </div>
                );
              }

              return (
                <p key={lIdx} className="leading-relaxed">
                  {parseInline(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Convert any markdown table into conversational emoji list
function cleanTableMarkdown(text: string): string {
  if (!text.includes("|")) return text;

  const lines = text.split("\n");
  const result: string[] = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("|")) {
      const cells = trimmed
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      // Check if separator row like |---|---|
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        inTable = true;
        continue;
      }

      if (!inTable) {
        // Table header row - skip or convert into title
        inTable = true;
        continue;
      }

      // Convert table data row into emoji bullet item
      if (cells.length >= 2) {
        let step = cells[0].trim();
        let product = cells[1].trim();
        const why = cells[2] ? cells[2].trim() : "";

        // Format step cleanly with bolding if not already bolded
        const formattedStep = step.startsWith("**") ? step : `**${step}**`;
        
        // Pick appropriate emoji based on step name
        let emoji = "🧴";
        const stepLower = step.toLowerCase();
        if (stepLower.includes("clean") || stepLower.includes("wash")) emoji = "🧼";
        else if (stepLower.includes("sun") || stepLower.includes("spf")) emoji = "☀️";
        else if (stepLower.includes("night") || stepLower.includes("evening")) emoji = "🌙";
        else if (stepLower.includes("serum") || stepLower.includes("dropper")) emoji = "💧";
        else if (stepLower.includes("moistur") || stepLower.includes("cream")) emoji = "🧴";
        else if (stepLower.includes("exfoliat") || stepLower.includes("acid")) emoji = "✨";

        result.push(`• ${emoji} ${formattedStep}: ${product} ${why ? `— ${why}` : ""}`);
      } else if (cells.length === 1) {
        result.push(`• 💡 ${cells[0]}`);
      }
    } else {
      inTable = false;
      result.push(lines[i]);
    }
  }

  return result.join("\n");
}

// Parse inline bolding (**text**) and code (`code`) into React elements
function parseInline(text: string): React.ReactNode {
  if (!text.includes("**") && !text.includes("`") && !text.includes("*")) {
    return text;
  }

  // First split by **bold**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  return (
    <>
      {boldParts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        // Handle inline code `code`
        if (part.includes("`")) {
          const codeParts = part.split(/(`[^`]+`)/g);
          return (
            <React.Fragment key={i}>
              {codeParts.map((cp, j) => {
                if (cp.startsWith("`") && cp.endsWith("`")) {
                  return (
                    <code
                      key={j}
                      className="px-1.5 py-0.5 rounded-md bg-slate-100 text-emerald-800 text-[11px] font-mono border border-slate-200"
                    >
                      {cp.slice(1, -1)}
                    </code>
                  );
                }
                return cp;
              })}
            </React.Fragment>
          );
        }
        return part;
      })}
    </>
  );
}
