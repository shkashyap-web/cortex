/**
 * CORTEX Core Type Definitions
 * Represents the foundational types for the enterprise decision intelligence operating system.
 */

// ==========================================
// 1. RBAC (Role-Based Access Control) Types
// ==========================================
export type Role =
  | 'Customer'
  | 'Relationship Manager'
  | 'Loan Officer'
  | 'Branch Manager'
  | 'Risk Analyst'
  | 'Compliance Officer'
  | 'Regional Manager'
  | 'Executive'
  | 'System Administrator';

export type Permission =
  | 'read:all'
  | 'write:all'
  | 'read:customer'
  | 'write:customer'
  | 'read:msme'
  | 'write:msme'
  | 'read:loan'
  | 'write:loan'
  | 'read:risk'
  | 'evaluate:decision'
  | 'trigger:simulation'
  | 'manage:agents'
  | 'manage:workflows'
  | 'view:observability';

export interface AccessRule {
  role: Role;
  permissions: Permission[];
}

export interface AccessControlContext {
  userId: string;
  role: Role;
  permissions: Permission[];
  branchId?: string;
  allowedWorkspaces: string[]; // Workspace IDs
}

// ==========================================
// 2. Dynamic Workspace Types
// ==========================================
export type SidebarGroup = 'intelligence' | 'operations' | 'management' | 'system';

export interface WorkspaceConfig {
  id: string;
  route: string;
  title: string;
  description: string;
  icon: string; // Lucide icon key
  permissions: Permission[];
  requiredServices: string[];
  featureFlags: string[];
  sidebarGroup: SidebarGroup;
  isEnabled: boolean;
}

// ==========================================
// 3. Domain Model Types (Banking Entities)
// ==========================================
export type BankingEntityType =
  | 'Customer'
  | 'MSME'
  | 'Loan'
  | 'Account'
  | 'Deposit'
  | 'Investment'
  | 'Branch'
  | 'Employee'
  | 'Document'
  | 'FraudCase'
  | 'RiskAssessment'
  | 'Workflow'
  | 'Simulation'
  | 'KnowledgeGraphEntity'
  | 'DigitalTwin';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  segment: 'RETAIL' | 'HNI' | 'CORPORATE';
  riskProfile: 'LOW' | 'MEDIUM' | 'HIGH';
  kycStatus: 'PENDING' | 'VERIFIED' | 'EXPIRED';
  pan: string;
  ckycId?: string;
  branchId: string;
  rmId: string; // Relationship Manager Employee ID
}

export interface MSME extends BaseEntity {
  companyName: string;
  registrationNumber: string;
  industry: 'MANUFACTURING' | 'SERVICES' | 'RETAIL' | 'AGRICULTURE' | 'TECHNOLOGY';
  annualRevenue: number;
  employeeCount: number;
  gstNumber: string;
  financialHealthScore: number; // 0 to 100
  riskRating: 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'C' | 'D';
  ownerCustomerId: string;
  branchId: string;
}

export interface Account extends BaseEntity {
  customerId: string;
  type: 'SAVINGS' | 'CURRENT' | 'OVERDRAFT';
  balance: number;
  currency: string;
  status: 'ACTIVE' | 'DORMANT' | 'FROZEN';
  openedAt: string;
}

export interface Loan extends BaseEntity {
  customerId?: string;
  msmeId?: string;
  accountId: string;
  type: 'TERM_LOAN' | 'WORKING_CAPITAL' | 'MORTGAGE' | 'EQUIPMENT_FINANCE';
  amount: number;
  interestRate: number;
  termMonths: number;
  status: 'APPLIED' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'ACTIVE' | 'CLOSED';
  startDate?: string;
  maturityDate?: string;
  collateralDetails?: string;
}

export interface Deposit extends BaseEntity {
  customerId: string;
  accountId: string;
  type: 'FIXED' | 'RECURRING';
  amount: number;
  interestRate: number;
  maturityDate: string;
  status: 'ACTIVE' | 'MATURED' | 'CLOSED';
}

export interface Investment extends BaseEntity {
  customerId: string;
  assetType: 'EQUITY' | 'DEBT' | 'MUTUAL_FUND' | 'GOLD' | 'ALTERNATIVE';
  assetName: string;
  units: number;
  purchasePrice: number;
  currentPrice: number;
  value: number;
  allocationPercentage: number;
  lastValuationDate: string;
}

export interface Branch extends BaseEntity {
  name: string;
  code: string;
  location: string;
  managerId: string; // Employee ID
  cashReserve: number;
  depositsTotal: number;
  loansTotal: number;
}

export interface Employee extends BaseEntity {
  name: string;
  email: string;
  role: Role;
  branchId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Transaction extends BaseEntity {
  accountId: string;
  customerId?: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: string;
  channel: 'UPI' | 'NETBANKING' | 'ATM' | 'BRANCH' | 'CARD' | 'NEFT' | 'RTGS';
  timestamp: string;
  status: 'ACTIVE' | 'REVERSED' | 'PENDING';
  description?: string;
  counterpartyAccountId?: string;
}

export interface Document extends BaseEntity {
  type:
    | 'KYC'
    | 'GST_RETURNS'
    | 'FINANCIAL_STATEMENTS'
    | 'INVOICE'
    | 'SALARY_SLIP'
    | 'LOAN_APPLICATION'
    | 'BANK_STATEMENT'
    | 'INSURANCE'
    | 'COMPLIANCE'
    | 'AUDIT';
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  fileUrl: string;
  hash: string;
  uploaderId: string;
  entityType: BankingEntityType;
  entityId: string;
  metadata: Record<string, any>;
}

export interface FraudCase extends BaseEntity {
  transactionId?: string;
  customerId: string;
  score: number; // 0 to 100
  status: 'FLAGGED' | 'UNDER_INVESTIGATION' | 'RESOLVED_FRAUD' | 'RESOLVED_LEGITIMATE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedAt: string;
  resolvedAt?: string;
  notes?: string;
}

export interface RiskAssessment extends BaseEntity {
  entityType: 'Customer' | 'MSME' | 'Loan' | 'Investment';
  entityId: string;
  overallScore: number; // 0 to 100
  factors: {
    factorName: string;
    weight: number;
    score: number;
    description: string;
  }[];
  assessedAt: string;
  assessorId: string; // Agent ID or Employee ID
}

// ==========================================
// 4. Enterprise Memory Engine Types
// ==========================================
export type MemoryType =
  | 'CustomerMemory'
  | 'MSMEMemory'
  | 'BranchMemory'
  | 'PortfolioMemory'
  | 'DecisionHistory'
  | 'RecommendationsHistory'
  | 'BusinessContext'
  | 'ConversationContext'
  | 'HistoricalEvents';

export interface MemoryEntry extends BaseEntity {
  type: MemoryType;
  entityId: string; // ID of Customer, MSME, Branch, etc.
  key: string;
  value: Record<string, any>;
  summary: string;
  importance: number; // 1 to 10
  tags: string[];
}

// ==========================================
// 5. Enterprise Event Bus Types
// ==========================================
export type EventType =
  | 'TransactionCreated'
  | 'LoanRequested'
  | 'LoanApproved'
  | 'FraudAlertGenerated'
  | 'CustomerUpdated'
  | 'MSMEUpdated'
  | 'DigitalTwinUpdated'
  | 'SimulationCompleted'
  | 'RecommendationGenerated'
  | 'DecisionCompleted'
  | 'DocumentProcessed'
  // Milestone 2 — Enterprise Infrastructure Layer lifecycle events
  | 'MemoryStored'
  | 'MemoryDeleted'
  | 'CapabilityRegistered'
  | 'CapabilityUnregistered'
  | 'AgentRegistered'
  | 'AgentUnregistered'
  | 'AgentHealthChanged'
  | 'ContextAssembled'
  // Milestone 3 — Decision Engine reasoning pipeline lifecycle events
  | 'ReasonerRegistered'
  | 'DecisionFailed';

export interface CortexEvent<T = any> {
  id: string;
  type: EventType;
  timestamp: string;
  source: string; // Module or Agent publishing the event
  payload: T;
  userId?: string;
  correlationId: string;
}

export type EventCallback<T = any> = (event: CortexEvent<T>) => void | Promise<void>;

export interface Subscription {
  id: string;
  type: EventType;
  callback: EventCallback;
  subscriberName: string;
}

/**
 * Maps every EventType to its expected payload shape.
 *
 * This is the single source of truth for "what data travels with which
 * event" across the Enterprise Event Bus. Every publisher and subscriber
 * should resolve payload types from this map rather than casting `any`,
 * satisfying the "strongly typed events" requirement of the Event Bus
 * subsystem without altering the existing EventType union or CortexEvent
 * shape (both remain backward compatible with current publishers).
 */
export interface EventPayloadMap {
  TransactionCreated: {
    transactionId: string;
    accountId: string;
    amount: number;
    type: Transaction['type'];
  };
  LoanRequested: {
    loanId: string;
    entityType: 'Customer' | 'MSME';
    entityId: string;
    amount: number;
  };
  LoanApproved: {
    loanId: string;
    entityId: string;
    amount: number;
    approvedBy: string;
  };
  FraudAlertGenerated: {
    fraudCaseId: string;
    customerId: string;
    score: number;
    riskLevel: FraudCase['riskLevel'];
  };
  CustomerUpdated: {
    customerId: string;
    changedFields: string[];
  };
  MSMEUpdated: {
    msmeId: string;
    changedFields: string[];
  };
  DigitalTwinUpdated: {
    twinId: string;
    entityType: DigitalTwin['entityType'];
    entityId: string;
  };
  SimulationCompleted: {
    scenarioId: string;
    executedBy: string;
    status: SimulationScenario['status'];
  };
  RecommendationGenerated: {
    recommendationId: string;
    entityId: string;
    confidenceScore: number;
  };
  DecisionCompleted: {
    decisionId: string;
    status: string;
    entityId: string;
  };
  DocumentProcessed: {
    documentId: string;
    entityType: BankingEntityType;
    entityId: string;
    type: Document['type'];
  };
  MemoryStored: {
    memoryId: string;
    type: MemoryType;
    entityId: string;
  };
  MemoryDeleted: {
    memoryId: string;
    type: MemoryType;
    entityId: string;
  };
  CapabilityRegistered: {
    capabilityId: string;
    name: string;
  };
  CapabilityUnregistered: {
    capabilityId: string;
  };
  AgentRegistered: {
    agentId: string;
    name: string;
  };
  AgentUnregistered: {
    agentId: string;
  };
  AgentHealthChanged: {
    agentId: string;
    health: AgentHealthStatus;
    status: AgentStatus;
  };
  ContextAssembled: {
    contextId: string;
    entityType: BankingEntityType;
    entityId: string;
    correlationId: string;
  };
  ReasonerRegistered: {
    capability: AgentCapability;
    decisionTypes: string[];
  };
  DecisionFailed: {
    decisionId: string;
    requestId: string;
    entityId: string;
    reason: string;
  };
}

/**
 * A CortexEvent whose `type` and `payload` are bound together through
 * EventPayloadMap, giving publishers and subscribers full compile-time
 * safety for a specific EventType `K`.
 */
export type TypedCortexEvent<K extends EventType> = Omit<CortexEvent<EventPayloadMap[K]>, 'type'> & {
  type: K;
};

export type TypedEventCallback<K extends EventType> = (
  event: TypedCortexEvent<K>
) => void | Promise<void>;

/**
 * Public contract for the Enterprise Event Bus.
 *
 * Per AI_ENGINEERING_RULES.md Section 6 ("Services must expose
 * interfaces, hide implementation details"), every core engine is
 * expected to be consumed through an interface rather than a concrete
 * class. Business services and agents should depend on IEventBus, not
 * on the EventBus implementation class directly.
 */
export interface IEventBus {
  subscribe<K extends EventType>(
    type: K,
    subscriberName: string,
    callback: TypedEventCallback<K>
  ): string;

  unsubscribe(type: EventType, id: string): boolean;

  unsubscribeAll(subscriberName: string): number;

  publish<K extends EventType>(event: TypedCortexEvent<K>): Promise<void>;

  getSubscriberCount(type: EventType): number;

  getActiveSubscriptions(type?: EventType): ReadonlyArray<Subscription>;

  /**
   * Returns recently published events, most recent first, optionally
   * filtered by type. Backed by a bounded in-memory ring buffer — this is
   * situational awareness for engines like the Context Engine, not a
   * durable event log or audit trail.
   */
  getRecentEvents(type?: EventType, limit?: number): ReadonlyArray<CortexEvent>;
}

/**
 * Storage abstraction for the Memory Engine.
 *
 * The Memory Engine depends on this interface, never on a concrete
 * storage technology (dependency inversion). The default implementation
 * shipped in Sprint/Milestone 2 is in-process and non-persistent; a
 * future Postgres-, Redis-, or vector-backed repository can implement
 * this same interface and be swapped in via constructor injection
 * without any change to IMemoryEngine consumers (DecisionEngine,
 * ContextEngine, business services, etc.).
 */
export interface IMemoryRepository {
  create(entry: MemoryEntry): Promise<MemoryEntry>;
  findByTypeAndEntity(type: MemoryType, entityId: string): Promise<MemoryEntry[]>;
  findById(id: string): Promise<MemoryEntry | undefined>;
  update(
    id: string,
    patch: Partial<Pick<MemoryEntry, 'value' | 'summary' | 'importance' | 'tags'>>
  ): Promise<MemoryEntry | undefined>;
  delete(id: string): Promise<boolean>;
  list(filter?: { type?: MemoryType }): Promise<MemoryEntry[]>;
}

/**
 * Public contract for the Enterprise Memory Engine. Business services and
 * other engines (Context Engine, Decision Engine) depend on this
 * interface rather than the concrete MemoryEngine class.
 */
export interface IMemoryEngine {
  recall(type: MemoryType, entityId: string): Promise<MemoryEntry[]>;
  store(
    type: MemoryType,
    entityId: string,
    key: string,
    value: Record<string, any>,
    summary: string,
    importance?: number,
    tags?: string[]
  ): Promise<MemoryEntry>;
  update(
    id: string,
    patch: Partial<Pick<MemoryEntry, 'value' | 'summary' | 'importance' | 'tags'>>
  ): Promise<MemoryEntry | undefined>;
  delete(id: string): Promise<boolean>;
  search(query: string, limit?: number): Promise<MemoryEntry[]>;
}

// ==========================================
// 6. Workflow Engine Types
// ==========================================
export type WorkflowType =
  | 'LoanApproval'
  | 'MSMEAssessment'
  | 'FraudInvestigation'
  | 'ComplianceReview'
  | 'CustomerOnboarding'
  | 'BranchOperations'
  | 'DecisionApproval';

export type WorkflowStepStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: WorkflowStepStatus;
  startedAt?: string;
  completedAt?: string;
  assignedRole?: Role;
  assignedAgentId?: string;
  result?: any;
  error?: string;
}

export interface WorkflowDefinition {
  id: string;
  type: WorkflowType;
  name: string;
  description: string;
  steps: Omit<WorkflowStep, 'status' | 'startedAt' | 'completedAt' | 'result' | 'error'>[];
  requiredPermissions: Permission[];
}

export interface WorkflowInstance extends BaseEntity {
  definitionId: string;
  type: WorkflowType;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'TERMINATED';
  currentStepId: string;
  steps: WorkflowStep[];
  context: Record<string, any>;
  initiatorId: string; // Employee ID or System
}

// ==========================================
// 7. Decision Engine & Explainability Types
// ==========================================
export interface DecisionRequest {
  id: string;
  decisionType: string; // e.g., 'LOAN_APPROVAL', 'FRAUD_FLAG'
  entityType: BankingEntityType;
  entityId: string;
  context: Record<string, any>;
  initiatorId: string;
  correlationId: string;
}

export interface DecisionFactors {
  factors: {
    name: string;
    value: any;
    influence: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    impactWeight: number; // 0 to 1
    description: string;
  }[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  actionableRoute?: string;
  confidenceScore: number; // 0.0 to 1.0
  impactMetric?: string;
}

export interface AlternativeRecommendation {
  recommendation: Recommendation;
  tradeoffs: string[];
}

export interface Evidence {
  sourceType: 'MEMORY' | 'GRAPH' | 'TWIN' | 'INTEGRATION' | 'CALCULATION';
  sourceId: string;
  description: string;
  dataSnapshot: any;
}

export interface ReasoningTrace {
  steps: {
    agentId?: string;
    capabilityName?: string;
    observation: string;
    thought: string;
    action?: string;
    timestamp: string;
  }[];
}

export interface AuditTrail {
  operatorId: string; // User or Agent
  action: string;
  timestamp: string;
  ipAddress?: string;
  systemSnapshot?: any;
}

export interface DecisionExplanation {
  decisionId: string;
  primaryRationale: string;
  evidence: Evidence[];
  reasoningTrace: ReasoningTrace;
  auditTrail: AuditTrail;
  alternatives: AlternativeRecommendation[];
}

export interface DecisionResult {
  decisionId: string;
  requestId: string;
  entityId: string;
  status: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' | 'FLAGGED' | 'COMPLETED';
  confidenceScore: number; // 0.0 to 1.0
  recommendations: Recommendation[];
  explanation: DecisionExplanation;
  evaluatedAt: string;
}

// ==========================================
// 8. Agent Registry & Capabilities
// ==========================================
export type AgentStatus = 'IDLE' | 'BUSY' | 'OFFLINE' | 'SUSPENDED';

export type AgentCapability =
  | 'RiskScoring'
  | 'BehaviourAnalysis'
  | 'CashFlowForecasting'
  | 'PortfolioOptimisation'
  | 'FraudDetection'
  | 'CreditAssessment'
  | 'DocumentAnalysis'
  | 'CustomerSegmentation'
  | 'RecommendationGeneration'
  | 'SimulationExecution';

/**
 * Runtime health of an agent, distinct from its operational `AgentStatus`.
 * Status describes what the agent is doing (idle/busy/offline); health
 * describes whether it is functioning correctly.
 */
export type AgentHealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';

export interface AgentPluginMetadata {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  capabilities: AgentCapability[];
  supportedEntities: BankingEntityType[];
  requiredServices: string[];
  supportedEvents: EventType[];
  permissions: Permission[];
  futureTools: string[];
  version: string;
  /** Selection priority when multiple agents are eligible for a capability. Lower value = higher priority. */
  priority: number;
  /** Current operational health, distinct from status (idle/busy/offline). */
  health: AgentHealthStatus;
}

/**
 * Public contract for the Agent Registry.
 * Agents are plugins: nothing in CORTEX should hardcode agent execution or
 * agent identity — everything is resolved through this registry.
 */
export interface IAgentRegistry {
  registerAgent(agent: AgentPluginMetadata): void;
  unregisterAgent(agentId: string): boolean;
  discoverAgentsByCapability(capability: string): AgentPluginMetadata[];
  discoverAgentsByEvent(eventType: EventType): AgentPluginMetadata[];
  updateAgentStatus(agentId: string, status: AgentStatus): boolean;
  updateAgentHealth(agentId: string, health: AgentHealthStatus): boolean;
  getAllAgents(): AgentPluginMetadata[];
  getAgent(id: string): AgentPluginMetadata | undefined;
}

export interface CapabilityDefinition {
  name: AgentCapability;
  description: string;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  requiredIntegrations: string[];
}

// ==========================================
// 9. Digital Twin Types
// ==========================================
export interface DigitalTwin extends BaseEntity {
  entityType: 'Customer' | 'MSME' | 'Branch' | 'Portfolio' | 'Executive';
  entityId: string;
  healthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  metrics: Record<string, number>;
  relationships: {
    targetEntityId: string;
    targetEntityType: BankingEntityType;
    relationshipType: string;
  }[];
  predictionPlaceholder: string; // E.g., 'Predicted default risk increases if rates rise by 2%'
  recommendationPlaceholder: string; // E.g., 'Hedge interest rate risk using IRS contract'
  lastSyncTimestamp: string;
}

// ==========================================
// 10. Knowledge Graph Types
// ==========================================
export interface KnowledgeGraphNode {
  id: string;
  type: BankingEntityType | 'Vendor' | 'Guarantor' | 'Collateral' | 'Location';
  properties: Record<string, any>;
  label: string;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string; // Node ID
  target: string; // Node ID
  label: string; // E.g., 'OWNED_BY', 'EMPLOYEE_OF', 'TRANSACTED_WITH', 'GUARANTOR_FOR'
  weight?: number; // 0 to 1
  properties: Record<string, any>;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

// ==========================================
// 11. Simulation Engine Types
// ==========================================
export interface SimulationParams {
  interestRateChange: number; // e.g., +1.5 (percentage points)
  inflationChange: number; // e.g., +0.8
  gstRateChanges: Record<string, number>; // sector -> percentage change
  fuelPriceChange: number; // e.g., +10.0
  economicSlowdownPercent: number; // e.g., 5.0 (percent drop in general productivity)
  msmeGrowthPercent: number; // e.g., +3.0
  portfolioShockLevel: 'NONE' | 'MILD' | 'SEVERE';
}

export interface SimulationResultEntry {
  metricName: string;
  baselineValue: number;
  simulatedValue: number;
  percentageChange: number;
  impactLevel: 'POSITIVE' | 'NEUTRAL' | 'WARNING' | 'CRITICAL';
}

export interface SimulationScenario extends BaseEntity {
  name: string;
  description: string;
  parameters: SimulationParams;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  executedBy: string; // Agent ID or Employee ID
  results?: SimulationResultEntry[];
  summaryInsight?: string;
}

export interface ExecutiveInsight extends BaseEntity {
  title: string;
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'RISK' | 'LIQUIDITY' | 'GROWTH' | 'COMPLIANCE' | 'FRAUD';
  suggestedAction: string;
}

// ==========================================
// 12. Observability & Integration Types
// ==========================================
export interface ObservabilityMetric {
  id: string;
  timestamp: string;
  type: 'LATENCY' | 'EXECUTION' | 'USAGE' | 'ERROR' | 'AUDIT';
  source: string; // e.g. 'cortex-de', 'event-bus'
  name: string; // e.g. 'evaluateDecision', 'publishEvent'
  durationMs?: number;
  metadata: Record<string, any>;
}

export type IntegrationConnectorType =
  | 'IDBI_SANDBOX'
  | 'CORE_BANKING'
  | 'UPI'
  | 'ACCOUNT_AGGREGATOR'
  | 'GSTN'
  | 'CKYC'
  | 'PAN_VERIFICATION'
  | 'AADHAAR'
  | 'EPFO'
  | 'OCEN'
  | 'CRM'
  | 'DMS';

export interface IntegrationRequest {
  connector: IntegrationConnectorType;
  operation: string;
  payload: Record<string, any>;
  correlationId: string;
}

export interface IntegrationResponse<T = any> {
  connector: IntegrationConnectorType;
  status: 'SUCCESS' | 'FAILURE';
  data?: T;
  error?: string;
  latencyMs: number;
}

// ==========================================
// 13. Enterprise Capability Registry
// ==========================================
/**
 * Identifies a top-level enterprise business capability (a "module" of
 * the platform), as distinct from AgentCapability (an individual skill
 * an agent plugin performs, e.g. 'CreditAssessment'). This is the
 * capability catalogue referenced in ARCHITECTURE.md / README.md:
 * Wealth Advisory, Retail Lending, Fraud Detection, Risk Intelligence,
 * Compliance, Executive Analytics, and related modules.
 */
export type EnterpriseCapabilityId =
  | 'CustomerIntelligence'
  | 'RetailLending'
  | 'MSMEIntelligence'
  | 'WealthIntelligence'
  | 'FraudIntelligence'
  | 'RiskIntelligence'
  | 'ComplianceIntelligence'
  | 'DecisionIntelligence'
  | 'ExecutiveIntelligence'
  | 'DocumentIntelligence'
  | 'SimulationEngine'
  | 'KnowledgeGraph'
  | 'DigitalTwin';

export type EnterpriseCapabilityStatus = 'ACTIVE' | 'BETA' | 'DISABLED';

export interface EnterpriseCapabilityMetadata {
  id: EnterpriseCapabilityId;
  name: string;
  description: string;
  supportedEntities: BankingEntityType[];
  requiredServices: string[];
  requiredPermissions: Permission[];
  supportedWorkflows: WorkflowType[];
  featureFlags: string[];
  status: EnterpriseCapabilityStatus;
}

/**
 * Public contract for the Capability Registry. Capability availability
 * must always be discovered through this registry — never hardcoded
 * into UI, workflows, or agents (AI_ENGINEERING_RULES.md Section 13).
 */
export interface ICapabilityRegistry {
  register(capability: EnterpriseCapabilityMetadata): void;
  unregister(id: EnterpriseCapabilityId): boolean;
  discover(filter: {
    supportedEntity?: BankingEntityType;
    requiredService?: string;
    workflow?: WorkflowType;
    status?: EnterpriseCapabilityStatus;
  }): EnterpriseCapabilityMetadata[];
  list(): EnterpriseCapabilityMetadata[];
  getById(id: EnterpriseCapabilityId): EnterpriseCapabilityMetadata | undefined;
}

// ==========================================
// 14. Enterprise Context Engine
// ==========================================
/**
 * Lightweight, non-authoritative reference to a Knowledge Graph node.
 * The Knowledge Graph Service itself is out of scope for Milestone 2
 * (per explicit instruction); this shape lets the Context Engine carry
 * a placeholder reference today that can be populated with real graph
 * data once services/knowledge-graph/ is implemented in a later
 * milestone, without changing DecisionContext's shape.
 */
export interface KnowledgeGraphReference {
  nodeId: string;
  entityType: BankingEntityType;
  relation: string;
  note: string;
}

/**
 * Lightweight, non-authoritative reference to a Digital Twin. Real twin
 * data (metrics, predictions) will populate this once
 * services/digital-twin/ exists; Milestone 2 only carries the
 * reference/placeholder shape.
 */
export interface DigitalTwinReference {
  entityType: 'Customer' | 'MSME' | 'Branch' | 'Portfolio' | 'Executive';
  entityId: string;
  note: string;
}

/**
 * Everything the Decision Engine needs to reason about a request,
 * assembled ahead of time by the Context Engine. The Context Engine
 * performs NO reasoning — it only gathers and shapes existing state
 * from other engines into this single object.
 */
export interface DecisionContext {
  contextId: string;
  correlationId: string;
  entityType: BankingEntityType;
  entityId: string;

  /** Resolved primary entity snapshot, when the entity is a Customer or MSME. */
  entitySnapshot?: Customer | MSME;

  /** Enterprise Memory Engine context relevant to this entity. */
  memory: MemoryEntry[];

  /** Placeholder Knowledge Graph references (see KnowledgeGraphReference). */
  knowledgeGraphRefs: KnowledgeGraphReference[];

  /** Placeholder Digital Twin references (see DigitalTwinReference). */
  digitalTwinRefs: DigitalTwinReference[];

  /** Enterprise capabilities relevant to the requested entity/workflow. */
  capabilities: EnterpriseCapabilityMetadata[];

  /** Agents eligible to act on this context. */
  agents: AgentPluginMetadata[];

  /** Active workflow instance driving this request, if any. */
  currentWorkflow?: WorkflowInstance;

  /** Caller's current RBAC context (role + permissions + workspace access). */
  accessControl: AccessControlContext;

  /** Recent bus activity relevant to this entity, for situational awareness. */
  recentEvents: CortexEvent[];

  /** Prior decisions recorded in Memory for this entity. */
  decisionHistory: MemoryEntry[];

  /** Prior recommendations recorded in Memory for this entity. */
  recommendationHistory: MemoryEntry[];

  assembledAt: string;
}

export interface ContextAssemblyRequest {
  entityType: BankingEntityType;
  entityId: string;
  correlationId: string;
  initiatorId: string;
  /** Optional decisionType hint, used to narrow which capabilities/agents are relevant. */
  decisionType?: string;
}

/**
 * Public contract for the Enterprise Context Engine. This engine
 * assembles a DecisionContext; it must never perform reasoning,
 * scoring, or recommendation generation — that remains the exclusive
 * responsibility of the CORTEX Decision Engine.
 */
export interface IContextEngine {
  assembleContext(request: ContextAssemblyRequest): Promise<DecisionContext>;
}

// ==========================================
// 15. Decision Reasoner Plugin Framework (Milestone 3)
// ==========================================
/**
 * Business-domain reasoning plugin contract.
 *
 * This is the extension point business domains (Risk, Fraud, Lending,
 * MSME, Wealth, Compliance, Executive Intelligence, ...) implement to
 * plug real reasoning into the CORTEX Decision Engine. Per
 * AI_ENGINEERING_RULES.md Section 12 ("Agents are plugins... never
 * hardcode them"), the same principle is applied one layer down: the
 * *reasoning logic* behind a decision is also a plugin, resolved at
 * runtime through the ReasonerRegistry rather than hardcoded inside
 * DecisionEngineService.
 *
 * A future domain (e.g. Fraud) plugs in by:
 *   1. Implementing IDecisionReasoner (see reasoners/RiskReasoner.ts for
 *      a reference implementation).
 *   2. Registering an instance with reasonerRegistryService.register(...)
 *      (see services/cortex-de/bootstrap.ts).
 *   3. Optionally adding a decisionType -> AgentCapability mapping entry
 *      in config/decisionCapabilityMap.ts.
 *
 * DecisionEngineService itself is never modified to add a new domain.
 */
export interface IDecisionReasoner {
  /** The AgentCapability this reasoner provides reasoning for (e.g. 'RiskScoring'). */
  readonly capability: AgentCapability;

  /** Human-readable name, surfaced in reasoning traces and observability. */
  readonly name: string;

  /**
   * Decision types this reasoner is able to evaluate (e.g. 'LOAN_APPROVAL').
   * The ReasonerRegistry uses this to resolve which reasoner handles a
   * given DecisionRequest — no switch/if-chain lives in DecisionEngine.
   */
  supportsDecisionType(decisionType: string): boolean;

  /**
   * Performs the actual reasoning for a request, given the fully
   * assembled DecisionContext. Must not throw for ordinary "insufficient
   * data" situations — return a low-confidence ReasonerOutput with
   * explanatory evidence instead; throw only for genuine faults.
   */
  reason(input: ReasonerInput): Promise<ReasonerOutput>;
}

export interface ReasonerInput {
  request: DecisionRequest;
  context: DecisionContext;
}

/**
 * Everything a reasoner contributes toward a decision. DecisionEngine
 * combines this with pipeline-level concerns (audit trail, event
 * publishing, memory persistence) that remain its own responsibility,
 * keeping reasoners free of orchestration duties.
 */
export interface ReasonerOutput {
  /** Normalized 0-100 score driving the APPROVED / MANUAL_REVIEW / REJECTED threshold. */
  score: number;
  status: DecisionResult['status'];
  primaryRecommendation: Recommendation;
  alternatives: AlternativeRecommendation[];
  evidence: Evidence[];
  traceSteps: ReasoningTrace['steps'];
  factors?: DecisionFactors;
}

/**
 * Public contract for the Reasoner Registry — the runtime plugin host
 * for IDecisionReasoner implementations. Mirrors the discovery pattern
 * already established by IAgentRegistry and ICapabilityRegistry.
 */
export interface IReasonerRegistry {
  register(reasoner: IDecisionReasoner): void;
  unregister(capability: AgentCapability): boolean;
  getReasonerForDecisionType(decisionType: string, capability: AgentCapability): IDecisionReasoner | undefined;
  getReasonerByCapability(capability: AgentCapability): IDecisionReasoner | undefined;
  listReasoners(): IDecisionReasoner[];
}

/**
 * Configuration-driven mapping from a DecisionRequest's `decisionType`
 * string to the AgentCapability required to service it. Lives in
 * config/decisionCapabilityMap.ts rather than as a hardcoded switch
 * inside DecisionEngineService, per AI_ENGINEERING_RULES.md Section 18
 * ("Everything configurable belongs inside /config").
 */
export interface DecisionCapabilityMapping {
  decisionType: string;
  capability: AgentCapability;
  description: string;
}

/**
 * A single weighted input into the Confidence Scoring Framework. Kept
 * distinct from DecisionFactors (the explainability-facing shape) so
 * reasoners can build one and derive the other.
 */
export interface ConfidenceWeightInput {
  name: string;
  /** Raw score for this factor, 0-100. */
  score: number;
  /** Relative weight, any positive number — normalized internally. */
  weight: number;
  influence: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  description: string;
}
