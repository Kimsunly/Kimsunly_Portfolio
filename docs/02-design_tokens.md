# design_tokens.md

# Design Token Specification

Version: 1.0

Project: Ly Kimsun Portfolio

Framework: Vue 3 + TypeScript

Design Language: Editorial Minimalism × Cyber Brutalism × Modern Engineering Dashboard

---

# Philosophy

Every visual decision must originate from a design token.

Never hardcode values directly into components.

All colors, spacing, typography, borders, transitions, and layout dimensions should reference tokens.

This ensures:

* Visual consistency
* Easier maintenance
* Theme support
* Predictable scaling
* Cleaner code

Use CSS custom properties or Tailwind theme extensions as the single source of truth.

---

# Color System

## Brand Philosophy

Primary colors communicate engineering confidence.

The interface should feel calm, structured, and technical.

Purple is an accent, not the primary color.

Approximately:

* 80% Neutral
* 15% Surface hierarchy
* 5% Purple accents

---

## Neutral Palette

```css
--color-background: #0A0A0A;
--color-surface: #111111;
--color-surface-elevated: #171717;

--color-border: #2A2A2A;
--color-border-strong: #3A3A3A;

--color-text-primary: #F5F5F5;
--color-text-secondary: #B4B4B4;
--color-text-muted: #7A7A7A;
```

---

## Accent Colors

```css
--color-primary: #7C3AED;
--color-primary-hover: #8B5CF6;
--color-primary-soft: rgba(124,58,237,.12);
--color-primary-border: rgba(124,58,237,.35);
```

Only use these for:

* Active navigation
* Interactive borders
* Buttons
* Links
* Architecture highlights
* Current section indicators

---

## Status Colors

```css
--color-success: #22C55E;
--color-warning: #FACC15;
--color-error: #EF4444;
--color-info: #38BDF8;
```

Used sparingly.

Never decorate entire layouts.

---

# Typography

## Font Families

Primary

```css
Inter
```

Monospace

```css
JetBrains Mono
```

Fallback

```css
system-ui
```

---

# Typography Scale

Display Hero

72px

Display

56px

H1

48px

H2

36px

H3

28px

H4

22px

Body Large

18px

Body

16px

Small

14px

Caption

12px

Technical Labels

11px

---

# Font Weight

Light

300

Regular

400

Medium

500

Semibold

600

Bold

700

Hero title should never exceed Bold.

Avoid ExtraBold or Black.

---

# Line Heights

Display

110%

Headings

120%

Body

160%

Caption

150%

---

# Letter Spacing

Display

-2%

Heading

-1%

Body

0%

Labels

8%

Uppercase labels

12%

---

# Spacing System

Use an 8px grid.

```text
4
8
16
24
32
40
48
56
64
80
96
120
160
```

Never introduce arbitrary spacing values.

---

# Container Widths

Small

768px

Medium

1024px

Large

1280px

Maximum

1440px

Hero content should never stretch edge-to-edge.

---

# Grid

Desktop

12 columns

Tablet

8 columns

Mobile

4 columns

Gap

32px

Mobile gap

20px

---

# Border Radius

Buttons

10px

Cards

12px

Panels

12px

Input

10px

Badge

999px

Avoid overly rounded UI.

The portfolio should feel engineered.

---

# Borders

Default

1px

Strong

2px

Interactive

1px

Hover

1px + accent color

Borders define hierarchy more than shadows.

---

# Shadows

Keep shadows minimal.

Default

None

Hover

Very soft

Never rely on blur-heavy floating cards.

Borders should carry the visual structure.

---

# Opacity Scale

```text
100%

80%

60%

40%

20%

10%
```

Use opacity instead of lighter gray colors whenever appropriate.

---

# Icon Sizes

Small

16px

Default

20px

Medium

24px

Large

32px

Hero

48px

Use Lucide icons consistently.

---

# Button Sizes

Small

Height 36px

Default

Height 44px

Large

Height 52px

Padding should scale proportionally.

---

# Card Dimensions

Padding

32px

Gap

24px

Border

1px

Radius

12px

Cards should maintain consistent rhythm.

---

# Motion Tokens

Instant

100ms

Fast

150ms

Standard

250ms

Slow

400ms

Large Reveal

600ms

Boot Sequence

1800ms

---

# Easing Tokens

Standard

```css
ease-out
```

Smooth

```css
cubic-bezier(0.22,1,0.36,1)
```

Never use:

Bounce

Elastic

Back

Overshoot

---

# Z-Index

```text
Background      0

Grid           10

Content        20

Navigation     30

Dropdown       40

Modal          50

Overlay        60

Loading        70
```

Avoid arbitrary z-index values.

---

# Breakpoints

```text
sm

640px

md

768px

lg

1024px

xl

1280px

2xl

1536px
```

Do not create custom breakpoints unless necessary.

---

# Animation Distance

Micro

4px

Small

8px

Standard

16px

Large

24px

Never animate more than 32px for normal UI.

---

# Blur

Default

0

Overlay

4px

Modal

8px

Avoid excessive glassmorphism.

---

# Section Spacing

Desktop

160px

Tablet

120px

Mobile

96px

Maintain consistent vertical rhythm.

---

# Navigation

Height

72px

Logo

32px

Link Gap

32px

Sticky after scroll

Yes

---

# Hero

Max Width

640px

Content Gap

32px

Button Gap

16px

Status Panel Width

320px

Visualization Width

560px

---

# Architecture Diagram

Node Width

240px

Node Height

120px

Connection Stroke

2px

Node Gap

48px

Animation Speed

Consistent with Motion Tokens

---

# Technology Badges

Height

32px

Padding

12px 16px

Radius

999px

Border

1px

No background gradients.

---

# Timeline

Line Width

2px

Node Size

16px

Card Gap

48px

---

# Project Cards

Featured

2-column

Standard

1-column

Image Ratio

16:9

Content Padding

32px

---

# Focus Indicators

Border

2px

Accent Color

Primary Purple

Never remove browser focus without replacement.

---

# Accessibility Tokens

Minimum text contrast

WCAG AA

Minimum touch target

44px

Visible focus

Required

Reduced Motion

Supported

---

# Tailwind Theme Mapping

These tokens should be exposed through the Tailwind theme configuration.

Do not scatter raw hexadecimal values throughout components.

Prefer semantic names such as:

background

surface

surfaceElevated

primary

textPrimary

textSecondary

border

success

warning

error

All spacing, font sizes, radii, durations, and breakpoints should also be defined in the Tailwind configuration to keep the design system centralized.

---

# Final Design Rule

Every screen should feel like it belongs to the same operating system.

The design should communicate precision, discipline, and engineering maturity through consistent typography, spacing, borders, restrained color usage, and purposeful motion.

When choosing between visual decoration and clarity, always choose clarity.

The interface should quietly reinforce the portfolio's central identity:

**Building reliable software systems.**

End of Document.
