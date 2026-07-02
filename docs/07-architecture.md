# architecture.md

# Architecture & Technical Storytelling Specification

Version: 1.0

Project: Ly Kimsun Portfolio

Owner: Ly Kimsun

---

# Purpose

This section exists to communicate engineering thinking.

It is NOT intended to teach backend development.

It is intended to demonstrate how Ly Kimsun approaches software architecture, system decomposition, API design, and backend engineering.

Recruiters should leave this section thinking:

"This engineer understands systems, not just syntax."

---

# Storytelling Philosophy

The architecture section should answer three questions.

1.

How does Ly think about software?

2.

How does data move through a system?

3.

Why were these architectural decisions made?

Everything should reinforce

System Thinking

↓

Architecture

↓

Reliability

↓

Maintainability

↓

Scalability

---

# Section Position

Homepage Flow

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

Timeline

↓

Contact

Architecture should appear immediately after Projects because visitors already know what was built.

Now they discover how it was engineered.

---

# Section Header

Small Label

```text
/05 ARCHITECTURE
```

Main Title

```text
Engineering Reliable Software Systems
```

Subtitle

```text
Every feature begins with architecture.
Every architecture decision affects maintainability,
performance, security, and long-term scalability.
```

---

# Overall Layout

Desktop

Two-column layout.

Left

Editorial explanation.

Right

Interactive architecture visualization.

Tablet

Stacked layout.

Mobile

Interactive diagram simplified into vertical flow.

---

# Core Diagram

Primary System

```text
User

↓

Vue.js Client

↓

Vue Router

↓

REST API

↓

Authentication Middleware

↓

Authorization (RBAC)

↓

Controllers

↓

Services

↓

Repositories

↓

MySQL Database
```

Each layer should be its own interactive node.

---

# Node Design

Every node appears as a technical panel.

Contains

Small label

Large title

Description

Technology badge

Example

```text
MODULE

Authentication

JWT

Express Middleware

Verifies identity
before protected resources
can be accessed.
```

---

# Data Flow Animation

When the section enters the viewport

Connections animate first.

↓

Nodes initialize.

↓

Data packet travels through the architecture.

↓

Each layer briefly activates.

↓

Database responds.

↓

Response returns to client.

Repeat every 8–10 seconds.

Very subtle.

No distracting loops.

---

# Hover Behavior

Hovering a node reveals

Purpose

Responsibilities

Technology

Implementation Notes

Example

Hover

Authentication

Displays

JWT Validation

Access Token

Refresh Strategy

Protected Routes

Security Considerations

---

# Click Interaction

Clicking expands the node.

Expanded panel includes

Responsibilities

Design Decisions

Advantages

Future Improvements

Related Technologies

This transforms the diagram into an interactive learning experience.

---

# Engineering Principles Panel

Beside the architecture diagram, display five engineering principles.

API First

↓

Security by Design

↓

Clean Architecture

↓

Scalable Systems

↓

Maintainability

Each principle opens a small explanation when selected.

---

# API Design Section

Heading

```text
API Philosophy
```

Content

REST APIs are designed with consistency, predictability, and maintainability in mind.

Every endpoint should follow clear naming conventions, proper HTTP methods, structured validation, meaningful status codes, and consistent response formats.

The API should be easy for frontend developers to integrate and simple for future developers to maintain.

---

# Authentication Flow

Interactive diagram

```text
Login Request

↓

Credential Validation

↓

JWT Generation

↓

Access Token

↓

Protected Route

↓

Middleware

↓

Authorized Response
```

Hovering each step reveals

Purpose

Security considerations

Implementation notes

---

# Authorization Flow

Diagram

```text
User

↓

Role

↓

Permission

↓

Middleware

↓

Controller

↓

Business Logic
```

Purpose

Explain RBAC visually.

No code.

No lengthy text.

---

# Database Design Philosophy

Heading

```text
Database Thinking
```

Content

Database design begins before writing code.

Tables should model real-world relationships while remaining normalized, maintainable, and scalable.

Good schema design reduces complexity throughout the application lifecycle.

---

# Database Relationship Diagram

Example

```text
Users

│

├── Roles

│

├── Payments

│

├── Budgets

│

├── Expenses

│

└── Audit Logs
```

Connections animate while scrolling.

Hover highlights relationships.

---

# Request Lifecycle

Diagram

```text
HTTP Request

↓

Validation

↓

Authentication

↓

Authorization

↓

Business Logic

↓

Database

↓

Response Formatting

↓

HTTP Response
```

Each step activates sequentially.

---

# Deployment Story

Title

```text
Deployment Pipeline
```

Diagram

```text
GitHub

↓

Pull

↓

Linux Server

↓

PM2

↓

Nginx

↓

Production
```

Hover

Displays

Deployment responsibility

Configuration

Purpose

---

# Current Learning Roadmap

Interactive roadmap

```text
Node.js

↓

Docker

↓

CI/CD

↓

Redis

↓

AWS

↓

Kubernetes

↓

System Design

↓

Spring Boot

↓

Distributed Systems
```

Completed technologies appear fully highlighted.

Learning technologies display a progress indicator.

Future technologies remain outlined.

---

# Engineering Metrics

Small dashboard

REST APIs

25+

Projects

3

Backend Leadership

Yes

Linux Deployment

Yes

Authentication

JWT

Authorization

RBAC

Databases

MySQL

Current Focus

Backend Engineering

Metrics animate once.

---

# Technical Decisions

Display decision cards.

Example

Decision

JWT Authentication

Reason

Stateless authentication.

Decision

RBAC

Reason

Secure resource access.

Decision

Service Layer

Reason

Maintainable architecture.

Decision

Repository Pattern

Reason

Future scalability.

Decision

Validation Middleware

Reason

Prevent invalid requests.

---

# Future Architecture

Show planned learning.

Cloud Architecture

AWS

↓

Load Balancer

↓

Application Servers

↓

Redis

↓

Database

↓

Object Storage

This communicates ambition rather than current expertise.

Clearly label it

Learning Roadmap

Never imply production experience that doesn't yet exist.

---

# Interactive Experiences

Architecture nodes

Hover

Click

Expand

Collapse

Connection lines animate.

Data packets move.

Metrics count upward.

Timeline activates.

Learning roadmap expands.

Everything remains smooth and subtle.

---

# Accessibility

Every interactive node must be keyboard accessible.

ARIA labels required.

Screen readers must describe diagrams.

Reduced-motion mode disables moving data packets.

---

# Performance

Architecture diagrams should use SVG whenever possible.

Avoid Canvas unless necessary.

Lazy load animations.

Avoid unnecessary JavaScript calculations.

Maintain 60fps.

---

# Visual Language

Nodes resemble engineering modules.

Borders instead of shadows.

Monochrome surfaces.

Electric purple highlights.

Technical labels.

Editorial typography.

Consistent spacing.

The section should feel like opening a software architecture dashboard.

---

# Final Engineering Message

The architecture section should not attempt to prove that Ly Kimsun knows every technology.

Instead, it should demonstrate a disciplined engineering mindset.

Visitors should understand that software is approached as interconnected systems rather than isolated features.

The visual storytelling should reinforce the portfolio's central identity:

Building reliable software systems through clean architecture, scalable APIs, thoughtful engineering, and continuous learning.

End of Document.
