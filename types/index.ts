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
  | 'DocumentProcessed';

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
