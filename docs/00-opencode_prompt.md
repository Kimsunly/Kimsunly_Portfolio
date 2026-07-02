# opencode_prompt.md

# Master Engineering Specification for OpenCode

Project: Ly Kimsun Portfolio

Framework: Vue 3 + TypeScript + Vite

Authoritative Version: 1.0

---

# Your Role

You are not simply generating a portfolio.

You are acting as a multidisciplinary engineering team composed of:

• Senior Frontend Engineer

• Senior Vue.js Engineer

• Software Architect

• UI/UX Designer

• Design System Engineer

• Motion Designer

• Performance Engineer

• Accessibility Specialist

• Technical Recruiter

Every implementation decision should prioritize long-term maintainability, engineering quality, accessibility, performance, and user experience.

---

# Project Goal

Build a modern engineering portfolio that communicates one clear message:

> **Ly Kimsun builds reliable software systems.**

The website should feel like a modern engineering operating system rather than a marketing landing page.

It must communicate:

* Backend engineering mindset
* Systems thinking
* Clean architecture
* Professionalism
* Technical depth
* Continuous learning

The visitor should remember the engineering quality first—not flashy effects.

---

# Required Specification Documents

Before generating any code, read and follow these documents.

branding.md

content.md

components.md

animations.md

projects.md

architecture.md

seo.md

These documents are authoritative.

If there is a conflict, resolve it in this priority order:

1. branding.md
2. content.md
3. components.md
4. animations.md
5. architecture.md
6. projects.md
7. seo.md

Do not ignore any specification.

---

# Technology Stack

Framework

Vue 3

Language

TypeScript

Bundler

Vite

Styling

Tailwind CSS

Icons

Lucide Vue

Animation

Motion One (preferred)

GSAP (only for complex timelines)

Utilities

VueUse

Routing

Vue Router

State

Avoid global state unless necessary.

If required, use Pinia.

Do not introduce unnecessary dependencies.

---

# Vue Development Standards

Use:

* Composition API only
* `<script setup lang="ts">`
* Strong typing
* Reusable composables
* Props with interfaces
* Emits with proper typing
* Slots where appropriate

Do not use:

* Options API
* Large monolithic components
* Inline business logic
* Anonymous event handlers for complex logic

---

# Folder Structure

Follow a scalable feature-first architecture.

```text
src/
  assets/
  components/
    ui/
    layout/
    navigation/
    sections/
    cards/
    architecture/
    timeline/
    projects/
    tech/
    contact/
  composables/
  constants/
  data/
  layouts/
  router/
  styles/
  types/
  utils/
  views/
  App.vue
  main.ts
```

Organize files by responsibility.

Avoid dumping components into one directory.

---

# Component Rules

Every component should have one responsibility.

Prefer many small components over large components.

Components should be reusable.

Avoid duplicated layouts.

Avoid duplicated styles.

Use composition instead of inheritance.

---

# Code Quality

Code should be:

Readable

Maintainable

Reusable

Predictable

Scalable

Consistent

Prefer descriptive variable names.

Extract repeated logic.

Avoid deeply nested conditions.

Use early returns.

Use TypeScript interfaces.

Avoid `any`.

---

# Styling Rules

Use Tailwind CSS.

Create reusable utility classes where repetition appears.

Maintain an 8px spacing system.

Typography should drive hierarchy.

Do not rely on shadows.

Borders define structure.

Purple is an accent.

Black, white, and gray dominate the interface.

---

# Design Direction

The portfolio should combine:

40% Editorial Minimalism

40% Cyber Brutalism

20% Modern SaaS polish (Linear / Vercel)

Do not imitate the reference image directly.

Use it as inspiration for rhythm, density, hierarchy, and atmosphere.

The final product must feel original and personal.

---

# Motion System

Implement the Motion Design System exactly as defined in `animations.md`.

Motion communicates engineering state.

Never animate for decoration alone.

Prefer opacity and transforms.

Respect `prefers-reduced-motion`.

Keep interactions responsive.

---

# Performance Requirements

Target Lighthouse scores:

Performance: 95+

Accessibility: 100

Best Practices: 100

SEO: 100

Core Web Vitals should pass.

Use:

* Lazy loading
* Code splitting
* Dynamic imports
* Optimized SVGs
* Modern image formats
* Tree shaking

Avoid unnecessary JavaScript.

---

# Accessibility Requirements

Use semantic HTML.

Keyboard navigation must work everywhere.

Provide visible focus states.

Use ARIA labels where appropriate.

Support screen readers.

Support reduced motion.

Maintain sufficient color contrast.

Accessibility is a requirement, not an enhancement.

---

# Responsive Design

Desktop

12-column grid.

Tablet

8-column grid.

Mobile

4-column grid.

Reflow layouts intentionally.

Do not simply stack everything.

Preserve hierarchy across breakpoints.

---

# Architecture Section

This section is a signature feature.

Do not render static images.

Use interactive HTML and SVG diagrams.

Architecture nodes should:

* Reveal progressively
* Support hover
* Support click
* Explain engineering decisions
* Animate connection lines
* Demonstrate request flow

This section should communicate systems thinking.

---

# Project Presentation

Treat projects as engineering case studies.

Each project should include:

Overview

Problem

Responsibilities

Architecture

Technology

Challenges

Solutions

Lessons Learned

Future Improvements

ANTPAY is the flagship project.

Give it the greatest visual emphasis.

---

# Technical Identity

Avoid generic frontend portfolio patterns.

Avoid excessive gradients.

Avoid floating glass cards.

Avoid decorative 3D elements that add no meaning.

Everything should reinforce backend engineering.

---

# Engineering Mindset

Throughout the portfolio, emphasize:

API Design

Database Design

System Design

Authentication

Authorization

Clean Architecture

Maintainability

Scalability

Reliability

Continuous Learning

Never exaggerate experience.

Clearly distinguish:

Current expertise

Current learning

Future goals

---

# Visual Language

Editorial typography.

Monochrome surfaces.

Minimal shadows.

Sharp borders.

Grid alignment.

Technical labels.

Structured information density.

Electric purple accents.

Consistent spacing.

The UI should resemble a professional engineering dashboard.

---

# Animation Constraints

Do not use:

* Infinite floating elements
* Spinning icons
* Decorative particles
* Heavy blur effects
* Excessive parallax
* Scroll hijacking
* Flashy transitions

Animations should be subtle, purposeful, and performant.

---

# SEO

Implement all recommendations from `seo.md`.

Include:

Meta tags

Open Graph

Twitter Cards

Canonical URLs

Structured Data (JSON-LD)

Sitemap

Robots

Semantic headings

Accessible image metadata

---

# Content Integrity

Never invent achievements.

Never fabricate statistics.

Never claim professional experience that does not exist.

Represent future technologies such as:

AWS

Kubernetes

Redis

Spring Boot

GraphQL

Go

Rust

Machine Learning

as learning goals rather than existing expertise.

Honesty builds trust.

---

# Git Workflow

Produce clean commits.

Organize files logically.

Keep components independent.

Write code that another engineer can understand six months later.

---

# Documentation

Document complex composables.

Explain non-obvious architectural decisions.

Avoid unnecessary comments.

Code should mostly explain itself.

---

# Deliverables

Produce a production-ready portfolio including:

Responsive homepage

Interactive architecture section

Featured project case studies

Technology stack

Engineering principles

Journey timeline

Current focus dashboard

Contact section

Accessible navigation

Professional footer

SEO implementation

Reusable Vue components

Typed composables

Optimized assets

Maintainable folder structure

---

# Definition of Done

The project is complete only if:

✓ Responsive across devices

✓ Accessible

✓ Maintainable

✓ Reusable

✓ Performant

✓ SEO optimized

✓ Consistent with all specification documents

✓ Faithful to the backend engineering identity

✓ Visually original

✓ Production-ready

---

# Final Instruction

Do not optimize for the fastest implementation.

Optimize for the highest engineering quality.

Treat this portfolio as if it will be reviewed by senior software engineers, engineering managers, technical recruiters, and design professionals.

Every line of code, every interaction, every animation, and every layout decision should support one central message:

**Ly Kimsun is a backend-focused software engineer who builds reliable software systems through clean architecture, scalable APIs, thoughtful engineering, and continuous learning.**

If a design choice, animation, dependency, or implementation does not strengthen that message, it should not be included.

End of Document.
