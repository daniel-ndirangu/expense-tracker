# Design Philosophy

This application should feel calm, premium, and effortless — similar to the Apple Wallet experience.

The UI should fade into the background and let the user focus on their finances, not the interface.

---

## Inspiration

Primary inspiration:
- Apple Wallet (iOS)

Secondary references:
- Apple Health (summary cards & typography)
- Apple Settings (clarity and spacing)
- Linear.app (modern minimalism, restraint)

These references are about **feel**, not imitation.

---

## Core Principles

### 1. Mobile-First Always
- Design for small screens first
- Desktop layouts should feel like an expansion, not a redesign
- All key actions must be reachable with one hand on mobile

---

### 2. Premium Minimalism
- Fewer elements, more meaning
- Every UI element must earn its place
- White space is a feature, not wasted space
- Avoid visual noise at all costs

---

### 3. Calm & Trustworthy
- No aggressive colors
- No flashing elements
- No unnecessary animations
- The app should feel stable, predictable, and respectful

---

### 4. Hierarchy Over Decoration
- Use spacing, size, and typography to show importance
- Avoid heavy borders, shadows, or dividers
- Let content grouping do the work

---

## Layout Guidelines

### Do
- Use card-based layouts with soft separation
- Prefer vertical scrolling over complex navigation
- Group related information tightly
- Keep dashboards scannable in under 3 seconds

### Don't
- Do not use dense tables on mobile
- Do not overload screens with metrics
- Do not nest navigation deeply
- Do not show everything at once

---

## Typography

### Do
- Use system fonts where possible
- Limit font weights (regular, medium, semibold)
- Use larger text for totals and key numbers
- Let numbers breathe with spacing

### Don't
- Do not use decorative fonts
- Do not mix many font sizes
- Do not rely on color alone to convey meaning

---

## Color Usage

### Do
- Neutral base (light or dark, but consistent)
- Use color sparingly and intentionally
- Use subtle accents for emphasis only

### Don't
- Do not use bright or saturated colors by default
- Do not use red/green aggressively
- Do not rely on color for critical understanding

---

## Components

### Preferred
- Simple cards
- List items with clear tap targets
- Bottom sheets or modals for details
- Segmented controls for time ranges (Day / Week / Month)

### Avoid
- Complex charts early on
- Heavy dropdown menus on mobile
- Multi-step flows unless necessary

---

## Data Presentation

### Do
- Show totals first, details second
- Use progressive disclosure
- Default to summaries, allow drill-down

### Don't
- Do not force users to parse raw data
- Do not show charts without clear context
- Do not overwhelm with historical data by default

---

## Interaction & Motion

### Do
- Subtle transitions (fade, slide)
- Motion should reinforce cause and effect
- Keep animations fast and purposeful

### Don't
- Do not animate for decoration
- Do not delay interactions with motion
- Do not use complex animation sequences

---

## Accessibility & Usability

### Do
- Large tap targets
- High contrast text
- Clear labels and affordances

### Don't
- Do not hide actions behind gestures alone
- Do not reduce readability for aesthetics

---

## Final Design Test

Before shipping a screen, ask:
- Can this be understood in 5 seconds?
- Can it be used comfortably with one hand?
- Does anything feel unnecessary?
- Does this feel calm and confident?

If the answer is "no" to any → simplify.
