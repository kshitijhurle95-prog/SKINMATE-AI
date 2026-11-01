---
name: frontend-design
description: >-
  Provides comprehensive design principles, visual hierarchy guidelines, and luxury UI/UX patterns
  for building premium, production-grade web applications. Use when designing or implementing user
  interfaces, visual styling, design tokens, component anatomy, layout aesthetics, or micro-interactions.
---

# Frontend Design & Premium UI/UX Engineering

This skill defines the visual identity, aesthetic principles, layout architecture, and user experience patterns for building high-end consumer and SaaS web applications. It steers developers and AI agents away from generic dashboard templates toward a refined, editorial, and trustworthy digital experience.

---

## 1. Design Philosophy & Visual Language

High-trust skincare and consumer health platforms must balance clinical credibility with approachable warmth. 

### Core Tenets
1. **Editorial Calm over Dashboard Clutter:** Generous negative space, intentional whitespace, and focused focal points. Avoid dense multi-card grids with competing visual weights.
2. **Organic Warmth over Stark Coldness:** Soft beige surfaces, off-white backdrops, muted sage accents, and warm charcoal typography replace harsh pure blacks (`#000000`) and sterile whites (`#FFFFFF`).
3. **Restrained Motion:** Animations should orient the user and reinforce cause-and-effect (e.g., scan analysis completing, drawer sliding, tab transitions) rather than distract. Duration should stay between 150ms and 350ms with smooth easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`).
4. **Data Humanization:** Present complex diagnostic scores with relatable visual metaphors (progress rings, radial arcs, severity badges, and actionable takeaways) rather than raw tables.

---

## 2. Color System & Surface Hierarchy

Use semantic tokens rather than raw hex values. Ensure all combinations meet WCAG AA contrast standards (minimum 4.5:1 for normal text, 3:1 for large text).

| Role | Token Name | Light Value | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| **Canvas** | `bg-canvas` | `#FAFAF8` | Primary warm off-white page background |
| **Surface** | `bg-surface` | `#FFFFFF` | Elevated cards, modals, and content containers |
| **Subtle** | `bg-subtle` | `#F4EFEB` | Neutral background for secondary blocks, pills, inputs |
| **Border** | `border-subtle` | `#E8E3DD` | Soft dividing lines, card borders, subtle separators |
| **Text Primary** | `text-primary` | `#1E201E` | High-contrast charcoal for headings, body copy |
| **Text Secondary**| `text-muted` | `#5C605B` | Subheadings, labels, secondary metadata |
| **Accent Primary**| `accent-sage` | `#3B5E4F` | Primary actions, confidence badges, active tab rings |
| **Accent Hover**  | `accent-sage-dark`| `#2C463B` | Interactive hover/pressed state for primary buttons |
| **Accent Soft**   | `accent-soft` | `#EAF0EC` | Background for success pills, score badges, alerts |
| **Highlight**     | `accent-terracotta`| `#C86D51`| Warm warning indicator, budget alert, concern highlight |

---

## 3. Typography & Hierarchy System

Use modern, clean sans-serif typography (such as Inter, Plus Jakarta Sans, or Outfit) paired with subtle editorial display serif touches where appropriate.

* **Display (Page Titles / Hero):** 36px–48px (`text-4xl` to `text-5xl`), font weight 600/700, line-height 1.15, letter-spacing `-0.02em`.
* **Heading 1 (Section Titles):** 24px–30px (`text-2xl` to `text-3xl`), font weight 600, letter-spacing `-0.015em`.
* **Heading 2 (Card / Metric Titles):** 18px–20px (`text-lg` to `text-xl`), font weight 600, line-height 1.3.
* **Body Primary:** 15px–16px (`text-base`), font weight 400, line-height 1.6 for comfortable reading.
* **Body Secondary / Caption:** 13px–14px (`text-sm`), font weight 400/500, line-height 1.5, muted color.
* **Micro-labels / Badges:** 11px–12px (`text-xs`), font weight 600, uppercase letter-spacing `0.05em`.

---

## 4. Component Anatomy & Layout Patterns

### A. The Elevated Card Pattern
* Border: 1px solid `border-subtle` (`#E8E3DD`).
* Radius: `rounded-2xl` (16px) or `rounded-xl` (12px).
* Shadow: Layered ambient elevation rather than heavy drop-shadows:
  `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px rgba(0, 0, 0, 0.02);`
* Padding: Responsive spacing (`p-5` on mobile, `p-7` on desktop).

### B. Interactive Buttons
* **Primary:** Filled `accent-sage` with white text, `rounded-xl`, `font-medium`, smooth scale transition on click (`active:scale-[0.98]`).
* **Secondary:** Ghost/Outlined with 1px `border-subtle`, hover background `bg-subtle`.
* **Micro-action:** Pill buttons with icon + label, subtle hover tint.

### C. Comprehensive UI States
Every view, card, and interaction must implement four distinct states:
1. **Ideal State:** Populated with real content, clear hierarchy, and primary call-to-action.
2. **Loading State:** Content-shaped pulse skeletons (`animate-pulse bg-[#EFEAE4] rounded-lg`) that mimic the actual layout to eliminate layout shifts (CLS).
3. **Empty State:** Reassuring illustration/icon, contextual heading explaining why nothing is shown, and a single one-click button to take action.
4. **Error State:** Friendly human-language message explaining what happened, clear non-technical recovery steps, and a retry button.

---

## 5. Motion & Micro-Interactions (Framer Motion)

Apply meaningful micro-animations using standard transitions:
```tsx
export const fadeInVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};
```

---

## 6. Implementation Checklist for Developers

- [ ] Does the page use the warm off-white canvas `#FAFAF8` instead of generic cold gray?
- [ ] Are buttons, cards, and input fields styled with consistent border radius (`rounded-xl` / `rounded-2xl`)?
- [ ] Are text hierarchies clearly differentiated by scale, weight, and subtle color variance?
- [ ] Are skeletons provided for async data fetching without jarring layout flashes?
- [ ] Is keyboard focus clearly visible with a high-contrast focus ring (`ring-2 ring-accent-sage ring-offset-2`)?
- [ ] Does the interface adapt fluidly from 360px mobile viewports to ultra-wide displays?
