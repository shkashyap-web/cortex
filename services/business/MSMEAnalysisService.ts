import { MSME } from '@/types';
import { MOCK_MSMES } from '@/data/msmes';
import { domainRegistryService } from '../domain/DomainRegistry';
import { observabilityService } from '../observability/ObservabilityService';

export class MSMEAnalysisService {
  private static instance: MSMEAnalysisService;

  private constructor() {}

  public static getInstance(): MSMEAnalysisService {
    if (!MSMEAnalysisService.instance) {
      MSMEAnalysisService.instance = new MSMEAnalysisService();
    }
    return MSMEAnalysisService.instance;
  }

  public async getMSMEById(id: string): Promise<MSME | undefined> {
    return observabilityService.measure('MSMEAnalysisService', 'getMSMEById', async () => {
      const msme = MOCK_MSMES.find(m => m.id === id);
      if (msme) {
        domainRegistryService.registerEntity('MSME', msme.id);
      }
      return msme;
    });
  }

  public async listMSMEs(): Promise<MSME[]> {
    return observabilityService.measure('MSMEAnalysisService', 'listMSMEs', async () => {
      return MOCK_MSMES;
    });
  }
}

export const msmeAnalysisService = MSMEAnalysisService.getInstance();
export default msmeAnalysisService;
