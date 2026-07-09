import { SimulationScenario, SimulationParams } from '@/types';
import { MOCK_SIMULATION_SCENARIOS } from '@/data/simulations';
import { observabilityService } from '../observability/ObservabilityService';

export class SimulationService {
  private static instance: SimulationService;

  private constructor() {}

  public static getInstance(): SimulationService {
    if (!SimulationService.instance) {
      SimulationService.instance = new SimulationService();
    }
    return SimulationService.instance;
  }

  public async getScenarios(): Promise<SimulationScenario[]> {
    return MOCK_SIMULATION_SCENARIOS;
  }

  public async runSimulation(name: string, description: string, params: SimulationParams, executedBy: string): Promise<SimulationScenario> {
    return observabilityService.measure('SimulationService', 'runSimulation', async () => {
      // Simulate running latency (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const id = `SIM-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      const baselineDefault = 2.85;
      const simulatedDefault = baselineDefault + (params.interestRateChange * 0.8) + (params.economicSlowdownPercent * 0.3);

      const scenario: SimulationScenario = {
        id,
        name,
        description,
        parameters: params,
        status: 'COMPLETED',
        executedBy,
        results: [
          {
            metricName: 'Gross NPA (Default Rate)',
            baselineValue: baselineDefault,
            simulatedValue: simulatedDefault,
            percentageChange: ((simulatedDefault - baselineDefault) / baselineDefault) * 100,
            impactLevel: simulatedDefault > 4.5 ? 'CRITICAL' : (simulatedDefault > 3.5 ? 'WARNING' : 'NEUTRAL')
          },
          {
            metricName: 'Portfolio Growth projection',
            baselineValue: 12.0,
            simulatedValue: 12.0 - (params.interestRateChange * 1.5),
            percentageChange: -params.interestRateChange * 12.5,
            impactLevel: params.interestRateChange > 2.0 ? 'WARNING' : 'NEUTRAL'
          }
        ],
        summaryInsight: `Simulation completed. Calculated default rates shifts from ${baselineDefault}% to ${simulatedDefault.toFixed(2)}% under stress parameters.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      MOCK_SIMULATION_SCENARIOS.push(scenario);
      return scenario;
    });
  }
}

export const simulationService = SimulationService.getInstance();
export default simulationService;
