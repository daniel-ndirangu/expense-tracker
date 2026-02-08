# Project Context

This repository contains a web application for tracking personal expenses.

The goal is to build a fast, clear, and trustworthy product that helps users understand their spending at a glance.

---

## Default Assumptions
- Single-user application unless explicitly stated otherwise
- Local-first MVP (no authentication or cloud sync initially)
- Expenses are stored as atomic line items
- Aggregations are derived (daily, weekly, monthly)
- Categories are predefined but can be extended later
- Week runs Monday–Sunday
- Currency defaults to a single locale unless specified

---

## Design & UX Principles
- Mobile-first by default; desktop is an enhancement, not the baseline
- UI should feel **premium, minimalist, and calm**
- Prefer whitespace, typography, and hierarchy over visual clutter
- Reduce cognitive load: show only what matters in each view
- Favor clarity and affordances over decorative elements
- All screens should be usable with one hand on a mobile device

---

## Product Principles
- Build an end-to-end MVP before adding complexity
- Detailed expense entries are the source of truth
- Summaries and insights are derived, never duplicated
- Prefer progressive disclosure (details on demand)
- Optimize for everyday use, not edge cases

---

## Technical Preferences
- Use a modern React-based stack
- Keep components small and composable
- Write readable, maintainable code over clever abstractions
- Structure the codebase for easy future extensions
  (e.g. budgets, AI insights, comparisons)

---

## AskUserQuestion Usage
Only use `AskUserQuestion` when:
- A decision would materially change architecture
- Business rules are ambiguous and affect correctness
- An action is destructive or difficult to reverse

Avoid asking about:
- UI styling details
- Folder structure
- Minor implementation choices
- Sensible defaults already defined here

---

## What NOT to Do
- Do not over-engineer early versions
- Do not introduce heavy dependencies without need
- Do not block progress with unnecessary questions
- Do not optimize prematurely
