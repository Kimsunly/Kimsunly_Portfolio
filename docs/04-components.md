# components.md

# Portfolio Component Specification

Version: 1.0

Project: Ly Kimsun Portfolio

Framework: Vue 3 + TypeScript

---

# Component Philosophy

Every component must have a clear responsibility.

A component should solve one problem.

Avoid components that become large containers for unrelated content.

Components must be

• Reusable

• Readable

• Maintainable

• Accessible

• Responsive

• Animation Friendly

Never build sections using hardcoded HTML.

Every repeated UI pattern should become a reusable Vue component.

---

# Page Structure

The homepage follows a storytelling flow.

```
Navigation

↓

Hero

↓

Engineering Principles

↓

Featured Projects

↓

Architecture

↓

Technology Stack

↓

Journey Timeline

↓

Current Focus

↓

Contact

↓

Footer
```

Every section should naturally guide the visitor to the next.

---

# Global Navigation

Purpose

Provide immediate orientation while remaining minimal.

Layout

Top fixed navigation.

Transparent at page load.

Solid background after scrolling.

Left

Personal logo.

Center

Navigation links.

Right

Resume button.

Small status indicator.

Behavior

Desktop

Horizontal navigation.

Mobile

Slide-in navigation panel.

Animation

Background fades in while scrolling.

Logo subtly scales on hover.

Current section highlights automatically.

Never use flashy underline animations.

Use smooth border transitions.

---

# Hero Section

Purpose

Create an unforgettable first impression.

Communicate engineering identity within five seconds.

Layout

Two-column layout.

Left

Editorial typography.

Introduction.

CTA buttons.

Right

Interactive engineering visualization.

NOT a static illustration.

Ideas

Architecture blueprint

Interactive node graph

Animated infrastructure diagram

3D system visualization

Grid simulation

Avoid decorative hero images.

The right side should reinforce engineering.

Content Order

System Label

Name

Role

Description

Buttons

Status Card

Animation

Boot sequence.

Typewriter for system label only.

Large title fades upward.

Buttons appear sequentially.

Visualization initializes independently.

Performance

Visualization must never block page rendering.

Lazy load if necessary.

---

# Engineering Principles

Purpose

Explain how Ly Kimsun thinks.

Five cards.

Equal width.

Grid layout.

Each card contains

Icon

Title

Description

Cards should resemble engineering documentation.

Hover

Border brightens.

Purple accent appears.

No lifting shadows.

---

# Featured Projects

Purpose

Demonstrate practical engineering ability.

Each project becomes a reusable ProjectCard component.

Each card contains

Project image

Category

Project name

Description

Technology badges

Metrics

Quick actions

Hover

Border animation.

Arrow slides.

Preview image subtly zooms.

Never rotate cards.

Never use glassmorphism.

Project Card Variants

Compact

Featured

Detailed

The Featured project (ANTPAY) should occupy more visual space than the others.

---

# Architecture Section

Purpose

Show engineering thinking rather than coding ability.

This section should visually explain how backend systems are designed.

Possible diagrams

Client

↓

Frontend

↓

REST API

↓

Authentication

↓

Business Logic

↓

Database

OR

Vue

↓

Express

↓

Service Layer

↓

Repository

↓

MySQL

Every node should animate while scrolling.

Hovering nodes displays explanations.

No static PNG diagrams.

Everything should be rendered using HTML, SVG, or Canvas.

---

# Technology Stack

Purpose

Show technologies without overwhelming the visitor.

Layout

Grouped by category.

Languages

Frontend

Backend

Database

Cloud

Tools

Do NOT use huge icon clouds.

Prefer clean rows.

Every technology appears inside a reusable TechCard.

Hover

Border highlight.

Small description.

Years of experience (optional).

---

# Timeline

Purpose

Tell the engineering journey.

Vertical timeline.

Milestones

University

Frontend

Backend

VETIKA

Smakjit

ANTPAY

Future

Animation

Timeline line grows while scrolling.

Cards reveal one by one.

Numbers count upward.

---

# Current Focus

Purpose

Communicate growth mindset.

Layout

Dashboard inspired.

Example

Learning

AWS

Docker

Redis

Spring Boot

Machine Learning

Building

Portfolio

Backend Systems

REST APIs

Preparing

Internships

Backend Roles

Freelance

Avoid fake CPU percentages.

Everything displayed should be real.

---

# Contact Section

Purpose

Convert visitors into connections.

Minimal layout.

Large editorial heading.

Small paragraph.

Contact buttons.

Social links.

Availability card.

CTA

Let's Build Something Meaningful

Secondary

Download Resume

Animation

Button borders animate.

Icons fade.

No floating particles.

---

# Footer

Purpose

End with professionalism.

Contains

Logo

Navigation

Social links

Email

Copyright

Signature statement

Small system status.

Example

SYSTEM ONLINE

Connection Secure

Version 1.0

Built with Vue 3

---

# Shared UI Components

Button

Primary

Secondary

Ghost

Icon Button

Status Badge

Tech Badge

Project Badge

Section Label

Divider

Grid Overlay

Information Panel

System Card

Metric Card

Timeline Item

Architecture Node

Tooltip

Modal

Image Viewer

Project Gallery

Reusable only.

No duplicated implementations.

---

# Cards

All cards follow the same structure.

Header

Content

Footer

Padding

24-32px

Border

1px

Radius

Minimal

Shadows

Almost none.

Spacing

Consistent.

Cards feel like engineering panels.

---

# Buttons

Primary

Black background.

White text.

Purple arrow.

Secondary

Border only.

Ghost

Minimal.

Hover

Border animation.

Arrow translation.

Background transition.

Fast.

Subtle.

---

# Labels

Every section begins with

```
/01

/02

/03
```

Technical labels should always use uppercase.

Examples

SYSTEM

MODULE

STATUS

PROJECT

ARCHITECTURE

TIMELINE

CONTACT

Use small monospace typography.

---

# Information Panels

Inspired by engineering dashboards.

Examples

Status

Location

Availability

Current Focus

Metrics

Should resemble technical control panels.

Never look like marketing cards.

---

# Grid System

Desktop

12-column grid.

Tablet

8-column grid.

Mobile

4-column grid.

Consistent spacing.

Nothing should break alignment.

---

# Responsive Rules

Desktop

Information density is highest.

Tablet

Reduce columns.

Mobile

Reorder components.

Do not simply stack everything.

Prioritize readability.

---

# Empty States

If data is unavailable

Never leave blank areas.

Display meaningful placeholder messages.

Example

"No current article available."

instead of empty containers.

---

# Accessibility

Semantic HTML.

Keyboard navigation.

Visible focus.

ARIA labels.

Screen reader friendly.

Reduced motion support.

Images require descriptive alt text.

---

# Performance

Lazy load images.

Lazy load 3D visualizations.

Code split large sections.

Optimize SVGs.

Avoid unnecessary JavaScript.

Prefer CSS transforms.

Animations should maintain 60fps.

---

# Vue Component Structure

```
components/

ui/

layout/

sections/

cards/

buttons/

navigation/

timeline/

architecture/

status/

projects/

tech/

contact/

footer/
```

Each component should use

```
ComponentName.vue
```

Use

```
<script setup lang="ts">
```

Composition API only.

No Options API.

---

# Design Rules

The UI must never resemble a template.

It should resemble a modern engineering operating system.

The visual hierarchy is driven by typography, spacing, borders, and structured layouts rather than heavy decoration.

Every panel, label, divider, and interaction should reinforce the identity of a backend-focused software engineer.

The Cyber Brutalism inspiration is expressed through disciplined grids, editorial typography, monochrome surfaces, and restrained electric-purple accents—not through copying another portfolio's layout or artwork.

End of Document.
