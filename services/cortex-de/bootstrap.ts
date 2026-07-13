/**
 * Decision Engine Bootstrap
 * ---------------------------------------------------------------------------
 * Registers every built-in IDecisionReasoner with the ReasonerRegistry.
 * DecisionEngineService imports this module for its side effect
 * (registration) rather than importing reasoner classes directly, so
 * adding a new domain reasoner never requires touching DecisionEngine.ts
 * — only this file gains one new import + register() call, or (for a
 * dynamically loaded plugin) not even that.
 */

import { reasonerRegistryService } from './ReasonerRegistry';
import { riskReasoner } from './reasoners/RiskReasoner';
import { defaultReasoner } from './reasoners/DefaultReasoner';

let bootstrapped = false;

export function bootstrapReasoners(): void {
  if (bootstrapped) return;
  reasonerRegistryService.register(riskReasoner);
  reasonerRegistryService.register(defaultReasoner);
  bootstrapped = true;
}
