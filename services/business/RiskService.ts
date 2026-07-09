import { RiskAssessment } from '@/types';
import { MOCK_RISK_ASSESSMENTS } from '@/data/riskAlerts';
import { observabilityService } from '../observability/ObservabilityService';

export class RiskService {
  private static instance: RiskService;

  private constructor() {}

  public static getInstance(): RiskService {
    if (!RiskService.instance) {
      RiskService.instance = new RiskService();
    }
    return RiskService.instance;
  }

  public async getRiskAssessmentForEntity(entityType: string, entityId: string): Promise<RiskAssessment | undefined> {
    return observabilityService.measure('RiskService', 'getRiskAssessmentForEntity', async () => {
      return MOCK_RISK_ASSESSMENTS.find(r => r.entityType === entityType && r.entityId === entityId);
    });
  }

  public async listRiskAssessments(): Promise<RiskAssessment[]> {
    return MOCK_RISK_ASSESSMENTS;
  }
}

export const riskService = RiskService.getInstance();
export default riskService;
