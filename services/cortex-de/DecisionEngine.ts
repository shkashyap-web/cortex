import { 
  DecisionRequest, 
  DecisionResult, 
  DecisionExplanation,
  Recommendation,
  Evidence,
  ReasoningTrace,
  AuditTrail,
  AlternativeRecommendation,
  BankingEntityType,
  AgentPluginMetadata
} from '@/types';
import { observabilityService } from '../observability/ObservabilityService';
import { memoryEngine } from '../memory/MemoryEngine';
import { explainabilityEngine } from '../explainability/ExplainabilityEngine';
import { agentRegistryService } from '../agent/AgentRegistry';
import { workflowEngine } from '../workflow/WorkflowEngine';
import { eventBus } from '../event-bus/EventBus';

export class DecisionEngineService {
  private static instance: DecisionEngineService;

  private constructor() {}

  public static getInstance(): DecisionEngineService {
    if (!DecisionEngineService.instance) {
      DecisionEngineService.instance = new DecisionEngineService();
    }
    return DecisionEngineService.instance;
  }

  /**
   * Evaluates a decision request by processing it through the CORTEX Decision Pipeline lifecycle.
   */
  public async evaluateDecision(request: DecisionRequest): Promise<DecisionResult> {
    const startTime = performance.now();
    const correlationId = request.correlationId;
    const decisionId = `DEC-${request.decisionType.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    console.log(`[CORTEX-DE] Beginning Decision Pipeline evaluation for ID: ${decisionId} (Correlation: ${correlationId})`);

    // Reasoning Trace compiler
    const reasoningTraceSteps: ReasoningTrace['steps'] = [];
    const evidenceList: Evidence[] = [];

    return observabilityService.measure(
      'cortex-de',
      `evaluate-${request.decisionType}`,
      async () => {
        // 1. Context Builder
        reasoningTraceSteps.push({
          observation: `Request type: ${request.decisionType} for Entity: ${request.entityType} (${request.entityId})`,
          thought: 'Initializing decision context parameters and validating input structures.',
          timestamp: new Date().toISOString()
        });

        // 2. Enterprise Memory Engine recall
        const recalledMemory = await memoryEngine.recall('CustomerMemory', request.entityId);
        reasoningTraceSteps.push({
          thought: `Querying Enterprise Memory Engine for relevant historical traces on entity ${request.entityId}.`,
          observation: `Recalled ${recalledMemory.length} memory entries from storage.`,
          timestamp: new Date().toISOString()
        });
        recalledMemory.forEach(mem => {
          evidenceList.push({
            sourceType: 'MEMORY',
            sourceId: mem.id,
            description: mem.summary,
            dataSnapshot: mem.value
          });
        });

        // 3. Knowledge Graph extraction (Mocked network query)
        reasoningTraceSteps.push({
          thought: 'Resolving entity links and dependency paths in the Knowledge Graph.',
          observation: 'Discovered owner links and guarantor connections for credit verification.',
          timestamp: new Date().toISOString()
        });

        // 4. Digital Twin Resolver
        reasoningTraceSteps.push({
          thought: 'Triggering Digital Twin simulation to compare current state values with baseline forecasts.',
          observation: 'Digital Twin status: WARNING. Liquidity ratios projections indicate potential collateral shortfalls.',
          timestamp: new Date().toISOString()
        });

        // 5. Capability Resolution
        const requiredCapability = this.determineRequiredCapability(request.decisionType);
        reasoningTraceSteps.push({
          thought: `Resolving required operational capability mapping for request: ${request.decisionType}.`,
          observation: `Required capability determined: "${requiredCapability}".`,
          timestamp: new Date().toISOString()
        });

        // 6. AI Agent Selection (Registry check)
        const eligibleAgents = agentRegistryService.discoverAgentsByCapability(requiredCapability);
        const primaryAgent = eligibleAgents[0];
        if (!primaryAgent) {
          throw new Error(`No active agents found in registry supporting capability: ${requiredCapability}`);
        }
        reasoningTraceSteps.push({
          thought: `Selecting best suited AI Agent Plugin for capability "${requiredCapability}".`,
          observation: `Selected Agent: "${primaryAgent.name}" (ID: ${primaryAgent.id}, Status: ${primaryAgent.status}).`,
          timestamp: new Date().toISOString()
        });

        // 7. Workflow Validation
        reasoningTraceSteps.push({
          thought: 'Checking workflow status and reviewing RBAC credentials for current operational step.',
          observation: 'Workflow instance status matches active guidelines. Approval clearance confirmed.',
          timestamp: new Date().toISOString()
        });

        // 8. Decision Reasoning (Simulate processing delay)
        const delay = Math.floor(Math.random() * 200) + 100;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const overallScore = this.calculateMockDecisionScore(request.decisionType, request.entityId);
        const statusResult = overallScore >= 70 ? 'APPROVED' : (overallScore >= 40 ? 'MANUAL_REVIEW' : 'REJECTED');

        reasoningTraceSteps.push({
          agentId: primaryAgent.id,
          capabilityName: requiredCapability,
          thought: `Executing core reasoning logic on parsed variables. Overall evaluated score matches benchmark requirements.`,
          observation: `Reasoning complete. Target output score: ${overallScore}/100. Status: ${statusResult}.`,
          timestamp: new Date().toISOString()
        });

        // 9. Explainability Engine Trace Compilation
        const auditTrail: AuditTrail = {
          operatorId: request.initiatorId,
          action: `DECISION_EVALUATE_${request.decisionType}`,
          timestamp: new Date().toISOString()
        };

        const primaryRecommendation = this.generateRecommendation(request.decisionType, statusResult, overallScore);
        const alternatives = explainabilityEngine.compileMockAlternatives(primaryRecommendation);

        const explanation = explainabilityEngine.generateExplanation(
          decisionId,
          `The decision resolved as ${statusResult} based on credit checks scoring ${overallScore}/100. Verification checks completed through the ${primaryAgent.name} plugin.`,
          evidenceList,
          { steps: reasoningTraceSteps },
          auditTrail,
          alternatives
        );

        // 10. Recommendation Generation & Audit Logging
        const result: DecisionResult = {
          decisionId,
          requestId: request.id,
          entityId: request.entityId,
          status: statusResult,
          confidenceScore: overallScore / 100,
          recommendations: [primaryRecommendation],
          explanation,
          evaluatedAt: new Date().toISOString()
        };

        // Store evaluation result in Memory History
        await memoryEngine.store(
          'DecisionHistory',
          request.entityId,
          decisionId,
          result as any,
          `Decision ${request.decisionType} completed with status ${statusResult}. Confidence Score: ${(result.confidenceScore * 100).toFixed(0)}%.`,
          9,
          ['decision', request.decisionType]
        );

        // Publish Completed Event
        await eventBus.publish({
          id: `EVT-DEC-${Math.random().toString(36).substr(2, 9)}`,
          type: 'DecisionCompleted',
          timestamp: new Date().toISOString(),
          source: 'cortex-de',
          payload: { decisionId, status: statusResult, entityId: request.entityId },
          correlationId
        });

        const totalDuration = performance.now() - startTime;
        console.log(`[CORTEX-DE] Decision Pipeline complete for ${decisionId} in ${totalDuration.toFixed(2)}ms.`);
        
        return result;
      },
      { requestId: request.id, decisionType: request.decisionType }
    );
  }

  /**
   * Helper mapping decision types to operational capabilities.
   */
  private determineRequiredCapability(decisionType: string): string {
    switch (decisionType) {
      case 'LOAN_APPROVAL':
        return 'CreditAssessment';
      case 'FRAUD_CHECK':
        return 'FraudDetection';
      case 'PORTFOLIO_OPTIMIZE':
        return 'PortfolioOptimisation';
      case 'MSME_CASHFLOW':
        return 'CashFlowForecasting';
      default:
        return 'RecommendationGeneration';
    }
  }

  /**
   * Computes a mock score based on entity id for consistent demonstration results.
   */
  private calculateMockDecisionScore(decisionType: string, entityId: string): number {
    if (entityId.includes('001')) return 85; // CUST-001 or MSME-001 (High Score)
    if (entityId.includes('002')) return 92;
    if (entityId.includes('003')) return 55; // Borderline score -> Manual review
    if (entityId.includes('004')) return 22; // Low score -> Reject
    return 75;
  }

  /**
   * Generates a structural recommendation.
   */
  private generateRecommendation(decisionType: string, status: string, score: number): Recommendation {
    const id = `REC-DEC-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    if (decisionType === 'LOAN_APPROVAL') {
      if (status === 'APPROVED') {
        return {
          id,
          title: 'Disburse Working Capital',
          description: `Disburse approved loan amount under standard rate terms. Interest rate suggested: 10.25% based on risk score: ${score}/100.`,
          confidenceScore: 0.94,
          impactMetric: '+1.5% Asset Expansion'
        };
      } else if (status === 'MANUAL_REVIEW') {
        return {
          id,
          title: 'Request Co-Signatures',
          description: `Credit score of ${score}/100 warrants secondary backing. Require personal guarantees or co-signatures from Patel Agro owner.`,
          confidenceScore: 0.72,
          impactMetric: 'Risk mitigation'
        };
      } else {
        return {
          id,
          title: 'Reject Credit Application',
          description: `Application score of ${score}/100 is below credit policy margins. High probability of default detected.`,
          confidenceScore: 0.88,
          impactMetric: 'Loss prevention'
        };
      }
    }

    return {
      id,
      title: 'Authorize Operational Override',
      description: 'Proceed with normal transaction cycles under monitoring status.',
      confidenceScore: 0.85
    };
  }
}

export const decisionEngineService = DecisionEngineService.getInstance();
export default decisionEngineService;
