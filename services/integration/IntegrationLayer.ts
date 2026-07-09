import { IntegrationRequest, IntegrationResponse, IntegrationConnectorType } from '@/types';
import { CONNECTOR_REGISTRY } from '@/config/integrations';
import { observabilityService } from '../observability/ObservabilityService';

export class IntegrationLayerService {
  private static instance: IntegrationLayerService;

  private constructor() {}

  public static getInstance(): IntegrationLayerService {
    if (!IntegrationLayerService.instance) {
      IntegrationLayerService.instance = new IntegrationLayerService();
    }
    return IntegrationLayerService.instance;
  }

  /**
   * Executes a mock integration request against the designated connector.
   */
  public async executeRequest<T = any>(request: IntegrationRequest): Promise<IntegrationResponse<T>> {
    const connectorMeta = CONNECTOR_REGISTRY[request.connector];
    
    return observabilityService.measure(
      'integration-layer',
      `call-${request.connector}-${request.operation}`,
      async () => {
        if (!connectorMeta) {
          return {
            connector: request.connector,
            status: 'FAILURE',
            error: `Connector "${request.connector}" not registered in CONNECTOR_REGISTRY.`,
            latencyMs: 0
          };
        }

        if (connectorMeta.status === 'OFFLINE') {
          return {
            connector: request.connector,
            status: 'FAILURE',
            error: `Connector "${request.connector}" is currently OFFLINE.`,
            latencyMs: 0
          };
        }

        // Simulate network latency (between 50ms and 200ms)
        const delay = Math.floor(Math.random() * 150) + 50;
        await new Promise(resolve => setTimeout(resolve, delay));

        // Build mock response data
        const mockData = this.generateMockResponse(request.connector, request.operation, request.payload);

        return {
          connector: request.connector,
          status: 'SUCCESS',
          data: mockData,
          latencyMs: delay
        };
      },
      { correlationId: request.correlationId, operation: request.operation }
    );
  }

  /**
   * Helper to generate realistic bank sandbox data.
   */
  private generateMockResponse(connector: IntegrationConnectorType, operation: string, payload: Record<string, any>): any {
    switch (connector) {
      case 'PAN_VERIFICATION':
        return {
          pan: payload.pan || 'ABCDE1234F',
          status: 'VALID',
          fullName: 'ADITYA BIRLA',
          category: 'INDIVIDUAL',
          issuedDate: '2015-06-10'
        };
      case 'AADHAAR':
        return {
          aadhaarToken: `UIDAI-TOKN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          verificationStatus: 'SUCCESS',
          otpVerified: true,
          timestamp: new Date().toISOString()
        };
      case 'GSTN':
        if (operation === 'fetchGSTR1') {
          return {
            gstin: payload.gstin,
            filingPeriod: 'June 2026',
            status: 'FILED',
            totalTaxableValue: 4500000,
            grossIGST: 810000,
            grossCGST: 0,
            grossSGST: 0,
            filingDate: '2026-07-05'
          };
        }
        return { gstin: payload.gstin, status: 'ACTIVE' };
      case 'ACCOUNT_AGGREGATOR':
        return {
          consentId: payload.consentId || 'CONSENT-AA-88992',
          accountsLinked: 2,
          fetchStatus: 'COMPLETED',
          balanceAggregate: 2500000,
          averageMonthlyBalance: 450000,
          statementsJson: 'Ref: DMS-BANK-STATEMENT-MOCK'
        };
      case 'CKYC':
        return {
          ckycId: payload.ckycId || 'CKYC-998877665544',
          kycDate: '2022-04-10',
          kycMode: 'BIOMETRIC',
          status: 'VERIFIED',
          documentAttached: 'PAN_CARD'
        };
      default:
        return {
          message: `Mock response for connector: ${connector}, operation: ${operation}`,
          timestamp: new Date().toISOString()
        };
    }
  }
}

export const integrationLayerService = IntegrationLayerService.getInstance();
export default integrationLayerService;
