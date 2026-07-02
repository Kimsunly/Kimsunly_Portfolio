# animations.md

# Motion Design System

Version: 1.0

Project: Ly Kimsun Portfolio

Framework: Vue 3 + TypeScript

Animation Philosophy: Engineering Motion

---

# Motion Philosophy

Motion should communicate system state.

Never animate because it looks cool.

Every transition should reinforce one of these ideas:

• System initialization

• Data flow

• User interaction

• Navigation

• Feedback

• Focus

• Progress

The portfolio should feel like interacting with a modern software platform rather than browsing a marketing website.

The motion language should be inspired by:

* Terminal interfaces
* IDEs (VS Code)
* Developer tools
* System dashboards
* Operating systems
* Technical control panels

Avoid flashy cinematic effects.

Avoid long dramatic animations.

Motion should be subtle, confident, and purposeful.

---

# Animation Principles

Every animation must satisfy at least one purpose.

✓ Explain hierarchy

✓ Guide attention

✓ Confirm interaction

✓ Reveal information

✓ Improve readability

✓ Reinforce engineering identity

If an animation serves no purpose, remove it.

---

# Motion Characteristics

Style

Minimal

Technical

Responsive

Confident

Professional

Timing

Fast

Purposeful

Consistent

Natural

Never exaggerated.

---

# Motion Tokens

Small Interaction

100–150ms

Standard Transition

200–300ms

Large Section Reveal

450–700ms

Page Introduction

900–1200ms

Boot Sequence

1500–2000ms

Hover

100ms

Button Feedback

120ms

Navigation

250ms

---

# Easing

Use modern easing curves.

Preferred

ease-out

ease-in-out

cubic-bezier(0.22,1,0.36,1)

Avoid

Bounce

Elastic

Overshoot

Rubber band

Cartoon physics

---

# Initial Loading Sequence

Purpose

Introduce the engineering identity.

Duration

Approximately 1.5–2 seconds.

Sequence

Step 1

Black overlay appears.

Step 2

System logs type onto the screen.

Example

BOOT_SEQUENCE v1.0

Initializing Modules...

Loading Portfolio...

Loading Components...

Connecting...

Loading Projects...

Checking Dependencies...

Authentication...

Success.

SYSTEM ONLINE

Step 3

Progress bar completes.

Step 4

Overlay fades away.

Step 5

Hero content begins rendering.

Important

Allow users to skip the boot sequence after the first visit by storing a flag in localStorage.

---

# Hero Entrance

Timeline

Navigation fades in.

↓

Grid appears.

↓

System label types.

↓

Large title fades upward.

↓

Subtitle fades.

↓

Description fades.

↓

Buttons slide upward.

↓

Status panel fades.

↓

Interactive visualization initializes independently.

Never animate everything simultaneously.

Each element should feel intentionally loaded.

---

# Background Grid

Purpose

Provide subtle structure.

Behavior

Fade in during initial load.

Remain static.

On mouse movement

Very slight parallax.

Maximum movement

5–10px.

Never become distracting.

---

# Cursor Interaction

Cursor should not be replaced.

No custom circular cursor.

Instead

Interactive elements slightly respond to cursor proximity.

Buttons

Border reacts.

Cards

Highlight follows pointer subtly.

Architecture nodes

Glow slightly.

---

# Navigation

On page load

Transparent.

On scroll

Background transitions to solid.

Shadow remains minimal.

Current section

Highlighted with purple accent.

Navigation links

Underline grows from left to right.

Duration

150ms.

---

# Buttons

Hover

Arrow slides slightly.

Border brightens.

Background transitions.

Press

Scale

0.98

Release

Returns immediately.

Never rotate.

Never bounce.

Never pulse continuously.

---

# Cards

Project Cards

Hover

Border traces around edges.

Image zooms 2%.

Arrow slides.

Content remains stable.

Engineering Principle Cards

Hover

Purple corner indicator appears.

Border brightness increases.

No elevation.

Status Cards

Hover

Small glow.

Numbers remain static.

---

# Project Section

When section enters viewport

Cards appear sequentially.

Delay

80ms

between cards.

Animation

Fade

TranslateY

20px

Never scale.

Hover

Border animation.

Technology badges brighten.

Project metrics count upward.

---

# Architecture Section

This is one of the most important animated sections.

Purpose

Demonstrate systems thinking.

Diagram

Client

↓

Frontend

↓

API

↓

Business Logic

↓

Database

Animation

Nodes appear one by one.

Connecting lines draw themselves.

Hovering nodes reveals descriptions.

Clicking nodes expands technical explanations.

Data packets travel through the architecture every few seconds.

Movement should be slow and subtle.

---

# Timeline

Vertical line grows while scrolling.

Milestones appear one by one.

Current milestone receives subtle highlight.

Numbers count upward.

Icons fade in.

No bouncing.

---

# Technology Stack

Cards reveal with stagger animation.

Hover

Border brightens.

Icon rotates 2 degrees maximum.

Description fades in.

Learning technologies display a subtle "Learning" badge.

---

# Current Focus

Progress indicators animate from 0 to target value.

These are not fake skill percentages.

Instead, use progress bars only for current learning focus.

Example

AWS

██████░░░░

Docker

████████░░

Spring Boot

████░░░░░░

These represent learning emphasis, not proficiency.

---

# Contact Section

Heading fades upward.

Paragraph fades.

Buttons appear.

Availability badge pulses once.

No infinite pulsing.

---

# Footer

System status indicator

ONLINE

blinks once every 6–8 seconds.

Very subtle.

No flashing.

---

# Scroll Behavior

Every section enters only once.

Never replay endlessly.

Intersection Observer should trigger animations.

Use GPU-friendly transforms.

Prefer

opacity

transform

Avoid animating

width

height

top

left

margin

---

# Page Transitions

If multiple pages exist

Transition

Fade

*

20px translate.

Duration

250ms.

Navigation should feel immediate.

---

# Micro Interactions

Buttons

Border trace.

Project cards

Arrow slides.

Technology badges

Highlight.

Timeline nodes

Glow.

Architecture nodes

Pulse on hover.

Links

Underline grows.

Icons

Opacity transition.

Everything remains subtle.

---

# Number Animations

Metrics

REST APIs

25+

Team Members

5

Projects

3

Years

Current

Animate from zero.

Duration

800ms.

Use requestAnimationFrame or Motion library.

---

# Tooltips

Fade

100ms.

Translate

5px.

Never bounce.

Dismiss immediately when cursor leaves.

---

# Image Gallery

Images fade.

Crossfade between screenshots.

Keyboard navigation.

Swipe on mobile.

Lazy load all images.

---

# Reduced Motion Support

Respect

prefers-reduced-motion.

Disable

Boot sequence.

Parallax.

Background movement.

Data packet animations.

Reduce transitions to opacity only.

Accessibility takes priority over visual effects.

---

# Performance Budget

Maintain

60fps.

Avoid layout thrashing.

Avoid excessive GSAP timelines.

Prefer CSS transitions.

Use Motion One for simple interactions.

Use GSAP only for complex timeline sequences.

Lazy load heavy animation modules.

---

# Recommended Libraries

Motion One

Primary animation library.

GSAP

Only for the boot sequence and architecture timeline if necessary.

VueUse

Intersection Observer.

Scroll tracking.

Mouse position.

Never include three animation libraries for the same task.

---

# Motion Do's

✓ Animate with purpose.

✓ Reinforce hierarchy.

✓ Support readability.

✓ Reflect engineering systems.

✓ Keep interactions responsive.

✓ Respect accessibility.

✓ Optimize performance.

---

# Motion Don'ts

✗ No floating blobs.

✗ No excessive particle effects.

✗ No continuous background animations.

✗ No infinite bouncing.

✗ No spinning icons.

✗ No glassmorphism shimmer.

✗ No exaggerated 3D flips.

✗ No distracting cursor replacements.

✗ No unnecessary scroll hijacking.

---

# Signature Experience

When a recruiter visits the portfolio, the motion should create the impression that they are opening a professional software system.

The portfolio should initialize, reveal information progressively, respond naturally to interactions, and communicate technical confidence without overwhelming the visitor.

Every animation should support the same core message:

"This engineer builds reliable software systems."

If a motion effect weakens that message, it should not exist.

End of Document.
