---
name: accessibility-responsive-design
description: >-
  Provides WCAG AA accessibility standards, semantic HTML conventions, keyboard navigation patterns,
  and mobile-first responsive layout rules. Use when auditing accessibility, designing responsive layouts,
  implementing accessible forms, managing keyboard focus traps, or testing screen-reader compatibility.
---

# Accessibility (a11y) & Mobile-First Responsive Design

This skill ensures that SKINMATE AI delivers an inclusive, accessible (WCAG 2.1 Level AA compliant), and responsive experience across mobile phones, tablets, laptops, and ultra-wide desktop displays.

---

## 1. Mobile-First Layout & Breakpoint Architecture

Design for the smallest viewport first (360px–390px mobile) and progressively enhance layout complexity for larger screens using Tailwind's standard breakpoint tiers:

| Breakpoint | Viewport Width | Typical Devices | Layout Strategy |
| :--- | :--- | :--- | :--- |
| **Default** | `< 640px` | Smart phones (iPhone, Android) | Single-column linear flow, sticky bottom action bar, bottom drawer filters |
| **`sm`** | `640px` | Large phones, phablets | 2-column compact grids, horizontal padding `px-6` |
| **`md`** | `768px` | Tablets (iPad portrait) | 2-column dashboard layout, persistent sidebar options |
| **`lg`** | `1024px` | Laptops / iPad landscape | 3-column marketplace catalog, side-by-side scan comparison |
| **`xl`** | `1280px` | Desktop displays | Maximum container width `max-w-7xl mx-auto px-8` |

---

## 2. Touch Targets & Interaction Ergonomics

* **Minimum Interactive Target:** Every button, tab, and clickable icon must meet the minimum touch target of **44×44 CSS pixels** (`min-h-[44px] min-w-[44px]` or `p-3`).
* **Thumb Zone Navigation:** Place critical primary actions (e.g. "Take Photo", "Generate Routine", "Confirm Cart") within comfortable reach of the lower half of mobile screens.
* **Input Font Size:** Use at least `16px` (`text-base`) font size on mobile input elements to prevent iOS Safari from zooming in automatically on focus.

---

## 3. Semantic HTML & ARIA Patterns

Use native HTML5 semantics over generic `<div>` tags to provide implicit accessibility tree roles:

```tsx
<main id="main-content" className="flex-1">
  <section aria-labelledby="analysis-heading">
    <h1 id="analysis-heading" className="text-3xl font-semibold">Your Skin Analysis</h1>
    
    {/* Live Region for Polling Status */}
    <div role="status" aria-live="polite" className="sr-only">
      {isAnalyzing ? "Processing facial photograph with AI. Please wait." : "Analysis complete."}
    </div>
  </section>
</main>
```

---

## 4. Accessible Form Controls

Always pair form controls with explicit labels and accessible error announcements:

```tsx
<div className="space-y-1.5">
  <label htmlFor="budget-input" className="text-sm font-medium text-content-primary">
    Maximum Skincare Budget (₹ INR)
  </label>
  <input
    id="budget-input"
    type="number"
    aria-describedby="budget-hint budget-error"
    aria-invalid={!!error}
    className="h-11 w-full rounded-xl border border-border-subtle px-4 text-base focus:ring-2 focus:ring-brand-sage-500"
  />
  <p id="budget-hint" className="text-xs text-content-muted">
    We will curate a complete 3-step routine within this budget.
  </p>
  {error && (
    <p id="budget-error" role="alert" className="text-xs text-brand-terracotta-500 font-medium">
      {error}
    </p>
  )}
</div>
```

---

## 5. Keyboard Navigation & Focus Management

1. **Focus Rings:** Never remove focus outlines without providing a distinct replacement:
   `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-sage-500 focus-visible:ring-offset-2`
2. **Modal Focus Trap:** When opening the camera modal or chat drawer, trap keyboard focus within the dialog and restore focus to the trigger button upon closing (`Escape` key support).
3. **Skip to Main Content:** Include an accessible skip link at the top of the root layout for keyboard users:
   ```tsx
   <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:z-50">
     Skip to main content
   </a>
   ```

---

## 6. Color Contrast & Visual Accessibility

* **Text Contrast:** Ensure all body text achieves at least **4.5:1** contrast against its background; large text (18px bold or 24px regular) must achieve at least **3:0:1**.
* **Do Not Rely on Color Alone:** Pair color badges with text labels or icons (e.g. a warning must have an icon + text label, not merely an orange dot).
