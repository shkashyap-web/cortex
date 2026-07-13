# Milestone 3.1 — Post-Merge Integration Fix

Status: ✅ Completed
Date: July 2026

## Overview

After Milestones 1–3 were merged, `npm run dev` launched successfully,
but `npx tsc --noEmit` still reported 4 integration errors left over
from the merge (stale imports and one pre-existing data bug). This is a
pure integration fix — no architecture, folders, or module contracts
changed. Zero errors remain.

## Modified Files

- `data/riskAlerts.ts`
- `app/customer-intelligence/page.tsx`
- `app/observability/page.tsx`
- `config/agents.ts`
- `hooks/useEventBus.ts`

## Changes

### 1. `data/riskAlerts.ts`
Added `getMockRiskAssessmentsForEntity(entityType, entityId)`, a
synchronous lookup over `MOCK_RISK_ASSESSMENTS` matching the existing
`getMockLoansForCustomer` / `getMockDigitalTwinForEntity` pattern used
by other `data/` modules. Purely additive — `RiskService` and its async
`getRiskAssessmentForEntity` (used by `RiskReasoner`/`DecisionEngine`)
are untouched; this is a separate, dependency-free accessor for page
components that don't go through the service layer.

`app/customer-intelligence/page.tsx` also had its `risk.factors.map(fact
=> ...)` callback typed explicitly (`RiskAssessment['factors'][number]`)
to clear an implicit-`any` error surfaced by the same import fix.

### 2. `app/observability/page.tsx`
Updated three stale imports left over from the Milestone 2 restructure
(`services/core/*` was never the real path — the actual modules live at
`services/observability/`, `services/event-bus/`, `services/workflow/`):

- `services/core/ObservabilityService` → `services/observability/ObservabilityService`
- `services/core/EventBus` (named import `EVENT_BUS`) → `services/event-bus/EventBus` (named export `eventBus`)
- `services/core/WorkflowEngine` → `services/workflow/WorkflowEngine`

Also restored compatibility with the current `AgentRegistryService`
public API: `listAgents()` never existed on that class — replaced with
`getAllAgents()`, which returns the same `AgentPluginMetadata[]` shape
the page already rendered. `EVENT_BUS.getHistory()` similarly doesn't
exist on `EventBus`; replaced with the real method,
`eventBus.getRecentEvents()`.

Added explicit types (`ObservabilityMetric`, `CortexEvent`,
`AgentPluginMetadata`, all from `@/types`) to the map/filter/reduce
callbacks that picked up implicit-`any` errors once the imports
resolved. No JSX, layout, or visual behavior changed.

### 3. `config/agents.ts`
Fixed the known pre-existing bug flagged in the Milestone 2/3 handoffs:
`fraud-guardian.supportedEntities` listed `'Transaction'`, which is not
a member of `BankingEntityType` (no `Transaction` entity exists in the
domain model — transactions are tracked against `Account`s). Changed to
`'Account'`, the entity type fraud-guardian actually monitors
transactions on. This is the only line changed in the file.

### 4. `hooks/useEventBus.ts`
Rewrote the hook's generics to bind to the Milestone 2
`IEventBus`/`TypedCortexEvent` contract instead of the old untyped
`CortexEvent<T>` / `EventCallback<T>`:

- `publish` is now `publish<K extends EventType>(type: K, source, payload: EventPayloadMap[K], userId?)`, building a `TypedCortexEvent<K>` — matching `IEventBus.publish<K extends EventType>(event: TypedCortexEvent<K>)`.
- `useSubscription` is now `useSubscription<K extends EventType>(type: K, subscriberName, callback: TypedEventCallback<K>)`, matching `IEventBus.subscribe<K extends EventType>(...)`.

Callers now get full compile-time payload checking per `EventType` (a
`LoanApproved` publish now requires exactly `{ loanId, entityId, amount,
approvedBy }`, etc.) instead of an escape-hatch `any`. No existing
callers of this hook were found using untyped payloads that would break
under the stricter signature.

## Architectural Note

No principle from `AI_ENGINEERING_RULES.md` was touched: no engine was
renamed, no folder introduced, no public service API removed (only the
already-broken `observability` page's imports were pointed at the APIs
that actually exist). `config/agents.ts`'s fix corrects invalid data,
not architecture.

## Verification

```
npm install
npx tsc --noEmit
```

Result: **0 errors.**

`npm run dev` was already working before this fix and is unaffected —
none of the 5 changed files touch runtime wiring outside of the
existing import graph.

## Known Issues (unchanged, carried forward)

- Data modules for Fraud, MSME cash flow, Portfolio, Compliance, etc.
  remain unimplemented by design (Milestone 3 scope note).
- Knowledge Graph, Digital Twin Engine, Simulation Engine, Executive
  Dashboard remain out of scope.

## Out of Scope (this fix)

No new business logic, no new reasoners, no UI redesign. Strictly the
4 listed integration errors.
