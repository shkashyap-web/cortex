import { EnterpriseCapabilityMetadata } from '@/types';

/**
 * Static seed for the Enterprise Capability Registry.
 *
 * This is distinct from CAPABILITY_REGISTRY in config/capabilities.ts:
 * that file defines input/output schemas for individual AgentCapability
 * skills (e.g. 'CreditAssessment', 'FraudDetection') that a single agent
 * performs. This file defines the top-level enterprise business
 * capabilities/modules referenced throughout ARCHITECTURE.md and
 * README.md (Wealth Advisory, Retail Lending, Fraud Intelligence, etc.)
 * — the units the Capability Registry service discovers and exposes to
 * the Decision Engine, workspaces, and agents.
 *
 * Additional capabilities can be registered at runtime via
 * capabilityRegistryService.register() without modifying this file.
 */
export const ENTERPRISE_CAPABILITY_REGISTRY: EnterpriseCapabilityMetadata[] = [
  {
    id: 'CustomerIntelligence',
    name: 'Customer Intelligence',
    description: 'Behavioral analytics, lifecycle signals, and value modeling for retail and HNI customers.',
    supportedEntities: ['Customer', 'Account'],
    requiredServices: ['CustomerService', 'MemoryEngine', 'DigitalTwinService'],
    requiredPermissions: ['read:customer'],
    supportedWorkflows: ['CustomerOnboarding'],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'RetailLending',
    name: 'Retail Lending',
    description: 'Retail loan intent detection, underwriting, and credit term structuring.',
    supportedEntities: ['Customer', 'Loan'],
    requiredServices: ['CustomerService', 'DecisionEngineService', 'RecommendationService'],
    requiredPermissions: ['read:customer', 'read:loan', 'evaluate:decision'],
    supportedWorkflows: ['LoanApproval'],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'MSMEIntelligence',
    name: 'MSME Intelligence',
    description: 'MSME financial health scoring, alternative data assessment, and GST-based cash-flow analysis.',
    supportedEntities: ['MSME', 'Loan'],
    requiredServices: ['MSMEAnalysisService', 'KnowledgeGraphService', 'IntegrationLayer'],
    requiredPermissions: ['read:msme'],
    supportedWorkflows: ['MSMEAssessment'],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'WealthIntelligence',
    name: 'Wealth Intelligence',
    description: 'Hyper-personalized portfolio recommendations and AI financial advisory for HNI customers.',
    supportedEntities: ['Customer', 'Investment'],
    requiredServices: ['CustomerService', 'RecommendationService', 'MemoryEngine'],
    requiredPermissions: ['read:customer'],
    supportedWorkflows: [],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'FraudIntelligence',
    name: 'Fraud Intelligence',
    description: 'Real-time transaction anomaly detection and fraud case investigation.',
    supportedEntities: ['FraudCase'],
    requiredServices: ['FraudService', 'KnowledgeGraphService'],
    requiredPermissions: ['read:risk'],
    supportedWorkflows: ['FraudInvestigation'],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'RiskIntelligence',
    name: 'Risk Intelligence',
    description: 'Portfolio and branch-level risk scoring, early warning signals, and loan stress forecasting.',
    supportedEntities: ['Branch', 'RiskAssessment', 'Loan'],
    requiredServices: ['RiskService', 'SimulationService', 'MemoryEngine'],
    requiredPermissions: ['read:risk'],
    supportedWorkflows: [],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'ComplianceIntelligence',
    name: 'Compliance Intelligence',
    description: 'KYC validation, AML monitoring, and onboarding compliance auditing.',
    supportedEntities: ['Customer', 'Document'],
    requiredServices: ['DocumentIntelligenceService', 'IntegrationLayer', 'WorkflowEngine'],
    requiredPermissions: ['read:all', 'manage:workflows'],
    supportedWorkflows: ['ComplianceReview'],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'DecisionIntelligence',
    name: 'Decision Intelligence',
    description: 'Cross-domain orchestration of enterprise decisions through the CORTEX Decision Engine.',
    supportedEntities: ['Customer', 'MSME', 'Loan', 'Branch'],
    requiredServices: ['DecisionEngineService', 'MemoryEngine', 'ExplainabilityEngine', 'AgentRegistry'],
    requiredPermissions: ['evaluate:decision'],
    supportedWorkflows: ['DecisionApproval'],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'ExecutiveIntelligence',
    name: 'Executive Intelligence',
    description: 'Executive-level synthesis of decisions, risk posture, and strategic recommendations.',
    supportedEntities: ['Branch', 'Customer', 'MSME', 'Loan'],
    requiredServices: ['DecisionEngineService', 'ExplainabilityEngine', 'MemoryEngine'],
    requiredPermissions: ['read:all', 'evaluate:decision'],
    supportedWorkflows: [],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'DocumentIntelligence',
    name: 'Document Intelligence',
    description: 'Structured extraction and classification of KYC, GST, financial, and compliance documents.',
    supportedEntities: ['Document'],
    requiredServices: ['DocumentIntelligenceService'],
    requiredPermissions: ['read:all'],
    supportedWorkflows: [],
    featureFlags: [],
    status: 'ACTIVE'
  },
  {
    id: 'SimulationEngine',
    name: 'Simulation Engine',
    description: 'Scenario modeling for interest rate shocks, economic downturns, and portfolio stress tests.',
    supportedEntities: ['Simulation', 'Branch'],
    requiredServices: ['SimulationService'],
    requiredPermissions: ['trigger:simulation'],
    supportedWorkflows: [],
    featureFlags: [],
    status: 'BETA'
  },
  {
    id: 'KnowledgeGraph',
    name: 'Knowledge Graph',
    description: 'Enterprise relationship graph connecting customers, MSMEs, loans, and operational entities.',
    supportedEntities: ['KnowledgeGraphEntity'],
    requiredServices: ['KnowledgeGraphService'],
    requiredPermissions: ['read:all'],
    supportedWorkflows: [],
    featureFlags: [],
    // Knowledge Graph implementation itself is out of scope for this milestone;
    // the capability is registered/discoverable but not yet operational.
    status: 'BETA'
  },
  {
    id: 'DigitalTwin',
    name: 'Digital Twin',
    description: 'Live virtual models of customers, MSMEs, branches, portfolios, and executives.',
    supportedEntities: ['DigitalTwin'],
    requiredServices: ['DigitalTwinService'],
    requiredPermissions: ['read:all'],
    supportedWorkflows: [],
    featureFlags: [],
    // Digital Twin Engine implementation itself is out of scope for this milestone;
    // the capability is registered/discoverable but not yet operational.
    status: 'BETA'
  }
];
