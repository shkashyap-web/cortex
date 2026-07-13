# AI_ENGINEERING_RULES.md

# CORTEX Engineering Constitution
Version: 1.0

This document defines the mandatory engineering rules that every AI coding assistant, engineer, or contributor must follow while working on CORTEX.

Failure to comply with these rules will result in inconsistent architecture, duplicated systems, and technical debt.

---

# 1. Project Identity

Project Name

CORTEX

Expanded Name

Cognitive Orchestration & Reasoning Technology for Executive Decision Intelligence

Category

Enterprise Banking Operating System

Purpose

CORTEX is NOT a chatbot.

CORTEX is NOT a dashboard.

CORTEX is NOT a banking application.

CORTEX is an AI-native Enterprise Decision Intelligence Platform that orchestrates banking decisions across the organization.

Everything in the project exists to strengthen this vision.

---

# 2. Architectural Philosophy

CORTEX follows Enterprise Software Architecture.

Always design for:

Scalability

Maintainability

Extensibility

Observability

Explainability

Auditability

Configurability

Loose Coupling

Strong Typing

Never optimize for hackathon shortcuts.

Always optimize for enterprise longevity.

---

# 3. Core Principle

Everything revolves around

CORTEX Decision Engine (CORTEX DE)

No module should bypass the Decision Engine when making enterprise decisions.

The Decision Engine is the cognitive heart of the platform.

---

# 4. Core Engines

These names are permanent.

Never rename them.

Never duplicate them.

Always extend them.

• CORTEX Decision Engine (CORTEX DE)

• Enterprise Memory Engine

• Enterprise Event Bus

• Workflow Engine

• Explainability Engine

• Capability Registry

• Agent Registry

• Knowledge Graph Service

• Digital Twin Engine

• RBAC Service

• Simulation Engine

---

# 5. Folder Structure

Always respect the existing folder hierarchy.

Never introduce parallel architectures.

Current structure

/app

/components

/config

/data

/features

/hooks

/lib

/services

/styles

/types

/utils

Every new feature must fit naturally inside this architecture.

---

# 6. Service Design Rules

Services must:

Be modular

Expose interfaces

Hide implementation details

Avoid UI dependencies

Avoid direct coupling

Support dependency injection

Never place business logic inside components.

Business logic belongs inside Services.

---

# 7. UI Rules

The UI is NOT the product.

The architecture is the product.

UI should remain:

Minimal

Professional

Enterprise

Functional

Inspired by:

Microsoft Fabric

Palantir Foundry

AWS Console

Databricks

Snowflake

Not inspired by:

Consumer Apps

Gaming Dashboards

Animated Websites

Marketing Landing Pages

Avoid unnecessary animations.

Avoid flashy gradients.

Avoid excessive colors.

---

# 8. Event Driven Architecture

Modules communicate using

Enterprise Event Bus

Never tightly couple services.

Good

CustomerService

↓

Publish Event

↓

Fraud Service receives

Bad

CustomerService

↓

Calls FraudService directly

---

# 9. Decision Flow

Every enterprise decision follows this sequence.

Request

↓

Decision Engine

↓

Memory

↓

Knowledge Graph

↓

Digital Twin

↓

Capability Resolution

↓

Agent Selection

↓

Workflow

↓

Simulation (optional)

↓

Recommendation

↓

Explainability

↓

Audit

↓

Response

Never bypass this pipeline.

---

# 10. Digital Twins

Every major entity should eventually have a Digital Twin.

Supported Twins

Customer Twin

MSME Twin

Portfolio Twin

Branch Twin

Executive Twin

Future twins should extend the engine rather than replace it.

---

# 11. Knowledge Graph

Relationships are first-class citizens.

Do not model the system as isolated tables.

Prefer relationships.

Customer

owns

Portfolio

belongs to

Branch

managed by

Relationship Manager

etc.

---

# 12. AI Agents

Agents are plugins.

Never hardcode them.

Every agent must register itself.

Agent Metadata

ID

Name

Capabilities

Supported Events

Required Services

Permissions

Supported Entities

Priority

Status

---

# 13. Capability Registry

Never hardcode feature availability.

Capabilities must be discovered through the registry.

Example

Wealth Advisory

Retail Lending

Fraud Intelligence

Risk Intelligence

Compliance

Executive Analytics

MSME Intelligence

Customer Intelligence

Simulation

---

# 14. Explainability

Every recommendation must contain

Reasoning

Evidence

Confidence

Alternative Options

Decision Factors

Audit Trail

Never generate recommendations without explanations.

---

# 15. Memory Engine

Memory is enterprise context.

Memory should never be stored inside UI components.

Memory categories include

Customer Memory

Decision Memory

Recommendation History

MSME Memory

Executive Memory

Portfolio Memory

Branch Memory

---

# 16. Coding Standards

Prefer

Interfaces

Composition

Factories

Dependency Injection

Registries

Configuration

Avoid

Massive Classes

Hardcoded Values

Global State

Magic Numbers

Business Logic inside UI

Circular Dependencies

---

# 17. TypeScript

Always use strict typing.

Avoid

any

unknown unless justified

type assertions without validation

Every public interface must be typed.

---

# 18. Configuration

Everything configurable belongs inside

/config

Never hardcode

Roles

Routes

Permissions

Sidebar

Agents

Capabilities

Themes

Environment-specific values

---

# 19. Security

Never expose secrets.

Never commit

API Keys

Passwords

Credentials

Tokens

Private URLs

Environment variables belong inside

.env

---

# 20. Git Rules

One architectural feature per commit.

Good

Implement Event Bus

Implement Knowledge Graph

Implement Decision Engine

Bad

Random fixes

Misc changes

Formatting + Architecture together

Keep commits focused.

---

# 21. Pull Request Philosophy

Every implementation should answer

Why was this change necessary?

How does it fit into CORTEX?

Which engine does it extend?

Does it preserve modularity?

---

# 22. What AI Assistants MUST NOT Do

Do NOT

Rename architecture

Invent new folder structures

Rewrite existing architecture

Replace Decision Engine

Merge unrelated services

Delete registries

Duplicate engines

Simplify enterprise architecture

Turn CORTEX into a CRUD application

Turn CORTEX into only a chatbot

Turn CORTEX into only a dashboard

Ignore Explainability

Ignore Event Bus

Ignore Digital Twins

Ignore Knowledge Graph

Ignore RBAC

---

# 23. Preferred Workflow

Understand architecture

↓

Understand current sprint

↓

Modify only relevant modules

↓

Compile

↓

Verify types

↓

Verify imports

↓

Verify build

↓

Commit

Repeat

---

# 24. Definition of Success

Every new contribution should make CORTEX feel more like an enterprise operating system rather than a hackathon project.

The guiding question should always be:

"If IDBI Bank adopted this platform for production, would this design still make sense?"

If the answer is "No", redesign before implementing.

---

# 25. AI Contributor Checklist

Before generating code, every AI assistant should verify:

✓ Read AI_CONTEXT.md

✓ Read ARCHITECTURE.md

✓ Read DEVELOPMENT_STATUS.md

✓ Read AI_ENGINEERING_RULES.md

✓ Understand current sprint

✓ Preserve architecture

✓ Follow folder structure

✓ Use existing services

✓ Extend registries

✓ Maintain strong typing

✓ Maintain modularity

✓ Avoid unnecessary dependencies

✓ Compile successfully

✓ Do not introduce technical debt

Only after all checks pass should code generation begin.

---

End of Constitution

Every AI contributor must treat this document as authoritative.