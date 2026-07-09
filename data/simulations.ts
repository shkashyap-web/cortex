import { SimulationScenario } from '@/types';

export const MOCK_SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'SIM-001',
    name: 'RBI Repo Rate Hike Stress Test',
    description: 'Simulates a 150 basis points (+1.5%) increase in interest rates and its cascading effect on MSME default rates and NIM (Net Interest Margin).',
    parameters: {
      interestRateChange: 1.5,
      inflationChange: 0.5,
      gstRateChanges: {},
      fuelPriceChange: 0.0,
      economicSlowdownPercent: 2.0,
      msmeGrowthPercent: -1.5,
      portfolioShockLevel: 'MILD'
    },
    status: 'COMPLETED',
    executedBy: 'risk-analyst',
    results: [
      { metricName: 'Net Interest Margin (NIM)', baselineValue: 3.42, simulatedValue: 3.65, percentageChange: 6.7, impactLevel: 'POSITIVE' },
      { metricName: 'MSME Portfolio Default Rate (GNPA)', baselineValue: 2.85, simulatedValue: 4.12, percentageChange: 44.5, impactLevel: 'CRITICAL' },
      { metricName: 'Lending Volume Growth', baselineValue: 12.4, simulatedValue: 9.8, percentageChange: -20.9, impactLevel: 'WARNING' },
      { metricName: 'Capital Adequacy Ratio (CAR)', baselineValue: 16.2, simulatedValue: 15.8, percentageChange: -2.4, impactLevel: 'NEUTRAL' }
    ],
    summaryInsight: 'Repo rate hike improves interest margins in the short term, but triggers a 44% increase in sub-prime MSME loan defaults, heavily impacting the CG Road branch agricultural portfolio.',
    createdAt: '2026-07-08T10:00:00Z',
    updatedAt: '2026-07-08T10:30:00Z'
  },
  {
    id: 'SIM-002',
    name: 'Fuel & Transportation Logistics Inflation Shock',
    description: 'Simulates a +12% spike in fuel prices combined with global freight logjam to test cash flow vulnerability in supply chain loans.',
    parameters: {
      interestRateChange: 0.0,
      inflationChange: 1.8,
      gstRateChanges: { 'MANUFACTURING': 2.0 },
      fuelPriceChange: 12.0,
      economicSlowdownPercent: 4.0,
      msmeGrowthPercent: -3.5,
      portfolioShockLevel: 'SEVERE'
    },
    status: 'COMPLETED',
    executedBy: 'risk-analyst',
    results: [
      { metricName: 'Manufacturing Working Capital Deficit', baselineValue: 120000000, simulatedValue: 168000000, percentageChange: 40.0, impactLevel: 'CRITICAL' },
      { metricName: 'Supply Chain Loan GNPA Ratio', baselineValue: 1.95, simulatedValue: 3.25, percentageChange: 66.6, impactLevel: 'CRITICAL' },
      { metricName: 'Trade Credit Drawdown Volume', baselineValue: 450000000, simulatedValue: 580000000, percentageChange: 28.8, impactLevel: 'WARNING' }
    ],
    summaryInsight: 'Severe operating margin compression for manufacturers. Highly recommended to increase cash credit overdraft limits temporarily for verified low-risk corporate exporters.',
    createdAt: '2026-07-09T09:15:00Z',
    updatedAt: '2026-07-09T09:55:00Z'
  }
];
export function getMockSimulationScenarios(): SimulationScenario[] {
  return MOCK_SIMULATION_SCENARIOS;
}
export function getMockSimulationScenario(id: string): SimulationScenario | undefined {
  return MOCK_SIMULATION_SCENARIOS.find(s => s.id === id);
}
