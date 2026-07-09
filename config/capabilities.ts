import { CapabilityDefinition } from '@/types';

export const CAPABILITY_REGISTRY: CapabilityDefinition[] = [
  {
    name: 'RiskScoring',
    description: 'Generates real-time risk scores for banking transactions, loans, and assets.',
    inputSchema: {
      entityType: 'string (Customer | MSME | Loan | Investment)',
      entityId: 'string',
      additionalParameters: 'object'
    },
    outputSchema: {
      score: 'number (0-100)',
      riskLevel: 'string (LOW | MEDIUM | HIGH | CRITICAL)',
      breakdown: 'array of risk factors'
    },
    requiredIntegrations: ['CORE_BANKING', 'CRM']
  },
  {
    name: 'BehaviourAnalysis',
    description: 'Models customer transaction and login behavioral frequencies to detect patterns and drift.',
    inputSchema: {
      customerId: 'string',
      timeframeDays: 'number'
    },
    outputSchema: {
      volatilityIndex: 'number',
      channelBreakdown: 'object',
      anomalyDetected: 'boolean'
    },
    requiredIntegrations: ['CORE_BANKING', 'UPI']
  },
  {
    name: 'CashFlowForecasting',
    description: 'Forecasts short-term liquidity trends based on transaction history and GST invoices.',
    inputSchema: {
      msmeId: 'string',
      monthsAhead: 'number'
    },
    outputSchema: {
      monthlyForecast: 'array of credit/debit estimates',
      liquidityRiskScore: 'number (0-100)',
      projectedWorkingCapital: 'number'
    },
    requiredIntegrations: ['GSTN', 'CORE_BANKING']
  },
  {
    name: 'PortfolioOptimisation',
    description: 'Applies Markowitz mean-variance optimization or custom bank models to assets.',
    inputSchema: {
      customerId: 'string',
      targetYield: 'number',
      riskTolerance: 'string'
    },
    outputSchema: {
      suggestedAllocations: 'array of assets and weights',
      expectedReturn: 'number',
      expectedVolatility: 'number'
    },
    requiredIntegrations: ['CORE_BANKING']
  },
  {
    name: 'FraudDetection',
    description: 'Correlates transaction details with historic frauds and structural anomaly models.',
    inputSchema: {
      transactionId: 'string',
      amount: 'number',
      channel: 'string',
      counterpartyId: 'string'
    },
    outputSchema: {
      fraudProbability: 'number (0.0 to 1.0)',
      riskIndicators: 'array of strings',
      recommendedAction: 'string (ALLOW | BLOCK | FLAG_FOR_REVIEW)'
    },
    requiredIntegrations: ['UPI', 'CORE_BANKING']
  },
  {
    name: 'CreditAssessment',
    description: 'Underwrites loan applications based on credit bureaus, revenue, and collateral.',
    inputSchema: {
      applicantId: 'string',
      applicantType: 'string (Customer | MSME)',
      requestedAmount: 'number',
      tenorMonths: 'number'
    },
    outputSchema: {
      approvedAmount: 'number',
      suggestedInterestRate: 'number',
      defaultProbability: 'number (0.0 to 1.0)',
      repaymentCapacityIndex: 'number'
    },
    requiredIntegrations: ['ACCOUNT_AGGREGATOR', 'CKYC', 'PAN_VERIFICATION']
  },
  {
    name: 'DocumentAnalysis',
    description: 'Classifies uploaded documents and extracts structured key-value maps.',
    inputSchema: {
      documentId: 'string',
      expectedType: 'string'
    },
    outputSchema: {
      documentType: 'string',
      extractedFields: 'object',
      confidenceMap: 'object',
      ocrTextRaw: 'string'
    },
    requiredIntegrations: ['DMS']
  },
  {
    name: 'CustomerSegmentation',
    description: 'Groups customers using multi-dimensional profitability and risk matrices.',
    inputSchema: {
      customerId: 'string'
    },
    outputSchema: {
      segmentName: 'string',
      valueTier: 'string',
      churnRisk: 'string'
    },
    requiredIntegrations: ['CRM']
  },
  {
    name: 'RecommendationGeneration',
    description: 'Synthesizes context to output structured and explainable advisory actions.',
    inputSchema: {
      entityType: 'string',
      entityId: 'string',
      contextKey: 'string'
    },
    outputSchema: {
      recommendations: 'array of Recommendation items'
    },
    requiredIntegrations: ['CORE_BANKING']
  },
  {
    name: 'SimulationExecution',
    description: 'Simulates financial shocks on banking balances and credit lines.',
    inputSchema: {
      scenarioId: 'string',
      parameters: 'SimulationParams'
    },
    outputSchema: {
      results: 'array of SimulationResultEntry items',
      summaryInsight: 'string'
    },
    requiredIntegrations: ['CORE_BANKING']
  }
];
export function getCapability(name: string): CapabilityDefinition | undefined {
  return CAPABILITY_REGISTRY.find(c => c.name === name);
}
