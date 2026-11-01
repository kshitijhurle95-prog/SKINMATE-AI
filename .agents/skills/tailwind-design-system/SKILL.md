---
name: tailwind-design-system
description: >-
  Provides configuration guides, semantic color tokens, component variant utilities, and layout
  systems using Tailwind CSS. Use when setting up Tailwind configs, defining design tokens, building
  reusable UI primitives with CVA/tailwind-merge, creating consistent component styles, or maintaining visual cohesion.
---

# Tailwind CSS & Reusable Design System

This skill defines the token architecture, utility conventions, and component variant patterns for Tailwind CSS. It prevents styling fragmentation and utility soup by creating a disciplined design token structure.

---

## 1. Design Tokens Configuration (`tailwind.config.ts`)

Configure semantic tokens matching the high-end skincare design aesthetic:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAFAF8",          // Main page background
        surface: {
          DEFAULT: "#FFFFFF",       // Primary container/card
          subtle: "#F4EFEB",        // Secondary subtle background
          elevated: "#FFFFFF",
        },
        border: {
          subtle: "#E8E3DD",        // Gentle border
          focus: "#3B5E4F",         // Focus state
        },
        brand: {
          sage: {
            50: "#F4F7F5",
            100: "#EAF0EC",
            500: "#3B5E4F",         // Primary brand accent
            600: "#2F4B3F",
            700: "#243930",
          },
          terracotta: {
            100: "#FBEBE7",
            500: "#C86D51",         // Warm highlight / alert
            600: "#B25C42",
          },
          sand: {
            50: "#FAF8F5",
            100: "#F4EFEB",
            200: "#E8E1D7",
          }
        },
        content: {
          primary: "#1E201E",       // Charcoal primary text
          muted: "#5C605B",         // Subtext and secondary labels
          faint: "#8D928C",         // Placeholder and borders
        }
      },
      borderRadius: {
        "xl": "0.75rem",           // 12px
        "2xl": "1rem",             // 16px
        "3xl": "1.5rem",           // 24px
      },
      boxShadow: {
        "soft": "0 2px 8px -2px rgba(30, 32, 30, 0.04), 0 1px 3px rgba(30, 32, 30, 0.02)",
        "card": "0 4px 20px -4px rgba(30, 32, 30, 0.06), 0 2px 6px -1px rgba(30, 32, 30, 0.03)",
        "hover": "0 10px 30px -6px rgba(30, 32, 30, 0.08), 0 4px 10px -2px rgba(30, 32, 30, 0.04)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      }
    },
  },
  plugins: [],
};

export default config;
```

---

## 2. Utility Helper: `cn()` for Class Merging

Always merge conditional classes using `clsx` and `tailwind-merge` to prevent conflicting Tailwind utilities:

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 3. Component Variant Pattern (Class Variance Authority - CVA)

Define reusable UI primitives using `class-variance-authority`:

```typescript
// src/components/ui/Button.tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-brand-sage-500 text-white hover:bg-brand-sage-600 shadow-soft",
        secondary: "bg-surface-subtle text-content-primary hover:bg-brand-sand-200 border border-border-subtle",
        outline: "border border-border-subtle text-content-primary hover:bg-surface-subtle",
        ghost: "text-content-primary hover:bg-surface-subtle",
        danger: "bg-brand-terracotta-500 text-white hover:bg-brand-terracotta-600",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-lg gap-1.5",
        md: "h-11 px-5 text-sm rounded-xl gap-2",
        lg: "h-13 px-7 text-base rounded-2xl gap-2.5",
        icon: "h-10 w-10 rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

---

## 4. Layout & Spacing Rules

* **Page Container:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
* **Card Padding:** `p-5 sm:p-7` with `rounded-2xl bg-surface border border-border-subtle shadow-card`
* **Section Gap:** `space-y-8 sm:space-y-12`
* **Grid Hierarchy:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
* **Interactive Elements:** Minimum touch target size `h-11` (44px) on mobile viewports.
