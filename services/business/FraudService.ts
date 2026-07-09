import { FraudCase } from '@/types';
import { MOCK_FRAUD_CASES } from '@/data/fraudAlerts';
import { observabilityService } from '../observability/ObservabilityService';

export class FraudService {
  private static instance: FraudService;

  private constructor() {}

  public static getInstance(): FraudService {
    if (!FraudService.instance) {
      FraudService.instance = new FraudService();
    }
    return FraudService.instance;
  }

  public async listAlerts(): Promise<FraudCase[]> {
    return observabilityService.measure('FraudService', 'listAlerts', async () => {
      return MOCK_FRAUD_CASES;
    });
  }

  public async evaluateTransaction(transactionId: string, amount: number, customerId: string): Promise<number> {
    return observabilityService.measure('FraudService', 'evaluateTransaction', async () => {
      // Return a mock fraud score (0-100) based on amount
      if (amount > 1000000) return 85; // Large amount is high fraud potential in mock
      if (amount > 100000) return 45;
      return 8;
    });
  }
}

export const fraudService = FraudService.getInstance();
export default fraudService;
