# CORTEX Decision Engine
## Changelog

---

# Milestone 3 — Decision Engine Reasoning Pipeline

Status: ✅ Completed

Date: July 2026

## Overview

Replaced the Decision Engine's hardcoded, entity-ID-based mock scoring
with a modular, plugin-driven reasoning pipeline, and wired the first
real business domain (Risk) through it end-to-end. Sprint 1 and
Milestone 2 behavior/APIs are unchanged; all changes are additive.

Also corrected a documentation/implementation mismatch discovered at
the start of this milestone: `services/cortex-de/DecisionEngine.ts`
already contained a 10-step reasoning pipeline prior to this milestone,
contrary to CHANGELOG's prior "no reasoning logic added" note for
Sprint 1 — it simply wasn't connected to real business services yet.
This milestone resolves that gap for the Risk domain specifically.

---

## New Files

- `types/index.ts` — Section 15, "Decision Reasoner Plugin Framework"
  (additive; existing sections unchanged)
- `config/decisionCapabilityMap.ts`
- `data/riskAlerts.ts` (the one minimal mock dataset created this milestone)
- `services/cortex-de/ReasonerRegistry.ts`
- `services/cortex-de/ConfidenceScoring.ts`
- `services/cortex-de/bootstrap.ts`
- `services/cortex-de/reasoners/RiskReasoner.ts`
- `services/cortex-de/reasoners/DefaultReasoner.ts`

## Modified Files

- `services/cortex-de/DecisionEngine.ts` — rewritten to delegate context
  assembly to ContextEngine, capability resolution to
  `config/decisionCapabilityMap.ts`, agent selection to a
  priority/health-aware selector, and reasoning to a resolved
  `IDecisionReasoner`. Public method signature (`evaluateDecision`)
  unchanged. Now wraps the pipeline in error handling that publishes a
  `DecisionFailed` event on failure.
- `services/index.ts` — exports the new reasoner-framework modules.
- `types/index.ts` — `EventType` gained two additive members
  (`ReasonerRegistered`, `DecisionFailed`) and matching `EventPayloadMap`
  entries. No existing members changed.

---

## New Infrastructure

### Decision Reasoner Plugin Framework

`IDecisionReasoner` is the extension point business domains implement to
plug real reasoning into the Decision Engine — the same "plugin, not
hardcoded" principle AI_ENGINEERING_RULES.md Section 12 already applies
to agents, applied one layer down to the reasoning behind a decision.

### Reasoner Registry

Runtime plugin host for `IDecisionReasoner` implementations, mirroring
the existing `AgentRegistry` / `CapabilityRegistry` discovery pattern.
`DecisionEngineService` asks it "who handles this decisionType?" and
never holds domain reasoning logic itself.

### Confidence Scoring Framework

Shared, reusable weighted-scoring utility (`ConfidenceScoring`) used by
every reasoner to turn domain factors into a normalized 0-100 score and
0.0-1.0 confidence value, replacing ad hoc scoring math per domain.

### Risk Reasoner (first real domain plugin)

Wires `RiskService` (backed by the new minimal `data/riskAlerts.ts`
dataset) into the Decision Engine for `LOAN_APPROVAL`,
`RISK_ASSESSMENT`, and `MSME_CASHFLOW` decision types. Degrades
gracefully — MANUAL_REVIEW with reduced confidence, not an error — when
no assessment exists for an entity outside the minimal dataset.

### Default Reasoner (fallback)

Preserves the original deterministic entity-ID mock scoring for any
decisionType without a registered domain reasoner yet, so existing demo
flows outside the Risk domain are unaffected by this milestone.

### Decision Engine Bootstrap

`services/cortex-de/bootstrap.ts` registers built-in reasoners at
startup. Adding a new domain (Fraud, Wealth, Compliance, Executive
Intelligence, ...) means implementing `IDecisionReasoner` and adding one
line here — `DecisionEngineService` is never modified.

---

## Architecture Decisions

- Context assembly is now exclusively ContextEngine's responsibility;
  DecisionEngine no longer duplicates memory/agent lookups inline.
- Capability-to-agent mapping moved from a hardcoded switch to
  `config/decisionCapabilityMap.ts`, per Section 18 of the engineering
  constitution ("everything configurable belongs inside /config").
- Reasoner resolution first tries the reasoner registered under the
  capability required for agent selection; if none supports the
  decisionType, it falls back to scanning all registered reasoners, then
  finally to `DefaultReasoner`. This lets `RiskReasoner` meaningfully
  evaluate `LOAN_APPROVAL` (agent-selection capability:
  `CreditAssessment`) even though it is registered under `RiskScoring`,
  without hardcoding that relationship into `DecisionEngineService`.
- Alternatives/recommendations are ranked by descending confidence
  before being returned, standardizing "decision ranking" as a pipeline
  step rather than reasoner-specific ordering.

---

## Verification

Manually traced type consistency of every new/modified file against
`types/index.ts` and existing service call signatures (`EventBus.publish`,
`MemoryEngine.store`, `ObservabilityService.measure/recordExecution`).
Could not run `tsc`/`next build` in this environment (no `node_modules`
installed against the uploaded repository); recommend running
`npm install && npx tsc --noEmit` as the next verification step before
merging.

---

## Known Issues (unchanged, not introduced this milestone)

- `config/agents.ts` → `fraud-guardian` still lists `Transaction` as a
  `supportedEntities` value, which is not a valid `BankingEntityType`.
- The following data modules remain absent by design (out of scope):
  `data/customers.ts`, `data/msmes.ts`, `data/loans.ts`,
  `data/branches.ts`, `data/employees.ts`, `data/digitalTwins.ts`,
  `data/knowledgeGraph.ts`, `data/simulations.ts`. Business services
  depending on these (`CustomerService`, `MSMEAnalysisService`,
  `FraudService`, `DigitalTwinService`, `KnowledgeGraphService`,
  `SimulationService`, `RecommendationService`) will not compile/run
  correctly until their respective data modules exist — unaffected by
  this milestone, which only wires `RiskService`/`data/riskAlerts.ts`.

## Out of Scope (unchanged)

Not implemented: Knowledge Graph, Digital Twin Engine, Simulation
Engine, Executive Dashboard, UI changes, full business datasets for
domains other than Risk.

---

# Milestone 2 — Enterprise Infrastructure Layer

Status: ✅ Completed

Date: July 2026

## Overview

Expanded the architecture without modifying Sprint 1 behavior.

Focus areas:

- Infrastructure
- Registries
- Context Assembly
- Dependency inversion
- Runtime discovery

No Knowledge Graph, Digital Twins, Explainability, Simulation, or Decision Intelligence implemented.

---

## New Files

Created:

- services/capability/CapabilityRegistry.ts
- services/context/ContextEngine.ts
- config/enterpriseCapabilities.ts

---

## Modified Files

### types/index.ts

Extended with:

- Memory contracts
- Context Engine contracts
- Capability Registry contracts
- Agent Registry interfaces
- Repository interfaces
- Additional lifecycle events

All additions were additive.

No breaking changes.

---

### services/event-bus/EventBus.ts

Added:

- bounded event history
- getRecentEvents()

Existing APIs preserved.

---

### services/memory/MemoryEngine.ts

Refactored using dependency inversion.

Introduced:

- IMemoryRepository

Added:

- update()
- delete()

Public API remains backward compatible.

---

### services/agent/AgentRegistry.ts

Extended with:

- unregisterAgent()
- discoverAgentsByEvent()
- updateAgentHealth()

Integrated Event Bus notifications.

---

### config/agents.ts

Added required metadata:

- priority
- health

Applied to all existing agents.

---

### services/index.ts

Exported:

- CapabilityRegistry
- ContextEngine

---

## New Infrastructure

### Capability Registry

Enterprise-level registry describing business capabilities.

Supports:

- register
- unregister
- discover
- list
- getById

Distinct from existing config/capabilities.ts.

---

### Context Engine

Pure aggregation engine.

No reasoning.

Builds DecisionContext using:

- Customer services
- MSME services
- Memory
- Agent Registry
- Capability Registry
- Workflow
- RBAC
- Event history

Knowledge Graph and Digital Twin remain placeholders.

---

### Memory Engine

Now follows dependency inversion.

Storage implementations are replaceable without affecting consumers.

---

### Agent Registry

Supports runtime registration.

Supports health monitoring.

Supports capability priority ordering.

---

## Event Bus

New lifecycle events:

- MemoryStored
- MemoryDeleted
- CapabilityRegistered
- CapabilityUnregistered
- AgentRegistered
- AgentUnregistered
- AgentHealthChanged
- ContextAssembled

---

## Architecture Decision

Direct synchronous service calls remain the standard for orchestration engines.

Event Bus is used only for notifications and asynchronous communication.

No request/reply messaging over Event Bus has been introduced.

---

## Verification

TypeScript verification performed.

Milestone 2 dependency graph compiled successfully.

Known unrelated issues identified.

---

## Known Issues

### Existing repository bug

config/agents.ts

fraud-guardian

contains:

Transaction

which is not a valid BankingEntityType.

This existed before Milestone 2.

Not introduced by this implementation.

---

### Missing mock data

The following data modules were absent from the uploaded repository:

- data/customers.ts
- data/msmes.ts
- data/loans.ts
- data/branches.ts
- data/employees.ts
- data/digitalTwins.ts
- data/knowledgeGraph.ts
- data/riskAlerts.ts
- data/simulations.ts

These are outside Milestone 2 scope.

---

## Out of Scope

Not implemented:

- Knowledge Graph
- Digital Twin Engine
- Explainability Engine
- Simulation Engine
- Decision Intelligence
- Decision Optimization
- AI Planning
- Recommendation Engine enhancements

---

# Sprint 1 — Foundation Architecture

Status: ✅ Completed

Date: July 2026

## Overview

Established the foundational architecture of the CORTEX Decision Engine.

This sprint focused exclusively on creating the project structure, shared contracts, enterprise domain model, event-driven backbone, and initial orchestration engine.

---

## Major Deliverables

### Core Architecture

- Established feature-based architecture
- Created enterprise service layer
- Introduced shared domain models
- Created centralized type system
- Implemented Event Bus
- Implemented Decision Engine skeleton
- Created Domain Registry
- Added RBAC service
- Added Workflow Engine skeleton
- Added Explainability Engine skeleton
- Added Digital Twin placeholders
- Added Knowledge Graph placeholders

---

### Repository State

Stable.

Successfully compiled.

Approved as Sprint 1 baseline.

---

Current Project Status

Sprint 1
✅ Complete

Milestone 2
✅ Complete

Milestone 3
✅ Complete

## [Unreleased] — Enterprise UI / Boot Experience
### Added
- Full application boot flow: CORTEX Splash → Enterprise Login → Initialization
  screen → Executive Dashboard, gated via `components/boot/BootSequence.tsx`
  and persisted per-session via `sessionStorage`.
- `components/boot/CortexSplash.tsx`, `EnterpriseLogin.tsx`,
  `InitializationScreen.tsx` (Screens 1–3 of the enterprise UX flow).
- `components/CommandPalette.tsx` — global `⌘K`/`Ctrl+K` workspace search and
  keyboard navigation, sourced from the existing `WorkspaceRegistryService`.
- `components/AICopilot.tsx` — persistent, collapsible right-side AI assistant
  with suggested prompts and demo responses.
- Notification Center dropdown and working global search trigger in `Topbar.tsx`.
- Boot/micro-interaction animation utilities and scrollbar styling in
  `app/globals.css`.

### Changed
- `app/layout.tsx` now wraps `Shell` in `BootSequence`.
- `components/Topbar.tsx`: search box now opens the Command Palette instead of
  being a disabled placeholder; notifications bell now opens a live dropdown.
- `components/Shell.tsx`: renders `AICopilot` as a persistent panel.

### Notes
- Presentation-only milestone. No backend services, types, or folder structure
  were modified, renamed, or moved.
- Verified with `npx tsc --noEmit` (0 errors) and `npx eslint` on all new/
  modified files (0 errors/warnings; pre-existing repo-wide lint warnings
  elsewhere are untouched).