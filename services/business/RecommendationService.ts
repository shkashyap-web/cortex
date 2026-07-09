import { Recommendation } from '@/types';
import { observabilityService } from '../observability/ObservabilityService';

export class RecommendationService {
  private static instance: RecommendationService;

  private constructor() {}

  public static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  public async getRecommendationsForEntity(entityType: string, entityId: string): Promise<Recommendation[]> {
    return observabilityService.measure('RecommendationService', 'getRecommendationsForEntity', async () => {
      // Return standard mock recommendations based on entity
      if (entityId.includes('CUST-001')) {
        return [
          {
            id: 'REC-001',
            title: 'Hedge Gold Allocation',
            description: 'Portfolio current allocation: 25% Sovereign Gold Bonds. Shift 5% allocation to debt mutual funds to hedge short-term yield volatility.',
            confidenceScore: 0.92,
            impactMetric: '+0.4% Expected Yield'
          }
        ];
      }
      if (entityId.includes('MSME-001')) {
        return [
          {
            id: 'REC-002',
            title: 'Pre-approve Cash Credit Extension',
            description: 'Patel Agro Industries shows a lengthening working capital cycle (68 days). Recommended to extend cash credit limits to avoid GST transaction blocks.',
            confidenceScore: 0.85,
            impactMetric: 'Avoid cash credit default'
          }
        ];
      }
      return [
        {
          id: 'REC-GEN-001',
          title: 'Review Account Activity KYC',
          description: 'Entity credentials re-verification deadline is approaching. Update Aadhaar OTP parameters.',
          confidenceScore: 0.95
        }
      ];
    });
  }
}

export const recommendationService = RecommendationService.getInstance();
export default recommendationService;
