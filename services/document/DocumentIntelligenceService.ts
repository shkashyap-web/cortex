import { Document, BankingEntityType } from '@/types';
import { observabilityService } from '../observability/ObservabilityService';
import { eventBus } from '../event-bus/EventBus';

export class DocumentIntelligenceService {
  private static instance: DocumentIntelligenceService;
  private documents: Map<string, Document> = new Map();

  private constructor() {}

  public static getInstance(): DocumentIntelligenceService {
    if (!DocumentIntelligenceService.instance) {
      DocumentIntelligenceService.instance = new DocumentIntelligenceService();
    }
    return DocumentIntelligenceService.instance;
  }

  /**
   * Submits a mock document for analytical extraction.
   */
  public async processDocument(
    id: string,
    type: Document['type'],
    fileUrl: string,
    entityType: BankingEntityType,
    entityId: string,
    uploaderId: string
  ): Promise<Document> {
    return observabilityService.measure(
      'document-intelligence',
      `process-${type}`,
      async () => {
        // Simulate extraction processing (150ms to 400ms delay)
        const delay = Math.floor(Math.random() * 250) + 150;
        await new Promise(resolve => setTimeout(resolve, delay));

        const mockMetadata = this.generateMockExtractionMetadata(type, entityId);

        const document: Document = {
          id,
          type,
          status: 'PROCESSED',
          fileUrl,
          hash: `SHA256-${Math.random().toString(36).substr(2, 16)}`,
          uploaderId,
          entityType,
          entityId,
          metadata: mockMetadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        this.documents.set(id, document);

        // Notify subscribers that a document was successfully processed
        await eventBus.publish({
          id: `EVT-DOC-${Math.random().toString(36).substr(2, 9)}`,
          type: 'DocumentProcessed',
          timestamp: new Date().toISOString(),
          source: 'DocumentIntelligenceService',
          payload: { documentId: id, entityType, entityId, type },
          correlationId: `CORR-DOC-${id}`
        });

        return document;
      },
      { documentId: id, entityId }
    );
  }

  /**
   * Retrieves processed document metadata.
   */
  public getDocument(id: string): Document | undefined {
    return this.documents.get(id);
  }

  /**
   * Helper to map document inputs to structured mock OCR parameters.
   */
  private generateMockExtractionMetadata(type: Document['type'], entityId: string): Record<string, any> {
    switch (type) {
      case 'KYC':
        return {
          idNumber: 'ABCDE1234F',
          matchScore: 98.4,
          nameOnCard: 'ADITYA BIRLA',
          extractedDOB: '1985-04-12',
          tamperEvidenceDetected: false
        };
      case 'GST_RETURNS':
        return {
          gstin: '24AAAAP1234F1Z0',
          filingYear: 2026,
          filingPeriod: 'Q1',
          reportedSalesRevenue: 12500000,
          totalInputTaxCredit: 240000
        };
      case 'FINANCIAL_STATEMENTS':
        return {
          periodEnding: '2026-03-31',
          audited: true,
          ebitda: 14500000,
          cashEquivalents: 4500000,
          totalLiabilities: 18000000,
          currentRatio: 1.62
        };
      case 'BANK_STATEMENT':
        return {
          bankName: 'State Bank of India',
          statementPeriod: 'June 2026',
          averageMonthlyBalance: 820000,
          totalCreditsCount: 42,
          totalDebitsCount: 61,
          totalBouncesCount: 0
        };
      default:
        return {
          extractedFieldsCount: 8,
          integrityCheckPassed: true,
          entityRef: entityId
        };
    }
  }
}

export const documentIntelligenceService = DocumentIntelligenceService.getInstance();
export default documentIntelligenceService;
