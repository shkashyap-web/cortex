import { DigitalTwin } from '@/types';
import { MOCK_DIGITAL_TWINS } from '@/data/digitalTwins';
import { observabilityService } from '../observability/ObservabilityService';

export class DigitalTwinService {
  private static instance: DigitalTwinService;

  private constructor() {}

  public static getInstance(): DigitalTwinService {
    if (!DigitalTwinService.instance) {
      DigitalTwinService.instance = new DigitalTwinService();
    }
    return DigitalTwinService.instance;
  }

  public async getTwin(entityType: string, entityId: string): Promise<DigitalTwin | undefined> {
    return observabilityService.measure('DigitalTwinService', 'getTwin', async () => {
      return MOCK_DIGITAL_TWINS.find(t => t.entityType === entityType && t.entityId === entityId);
    });
  }

  public async syncTwin(twinId: string): Promise<boolean> {
    return observabilityService.measure('DigitalTwinService', 'syncTwin', async () => {
      const twin = MOCK_DIGITAL_TWINS.find(t => t.id === twinId);
      if (!twin) return false;
      
      twin.lastSyncTimestamp = new Date().toISOString();
      twin.updatedAt = new Date().toISOString();
      console.log(`[DigitalTwinService] Synced twin: ${twinId}`);
      return true;
    });
  }

  public async getAllTwins(): Promise<DigitalTwin[]> {
    return MOCK_DIGITAL_TWINS;
  }
}

export const digitalTwinService = DigitalTwinService.getInstance();
export default digitalTwinService;
