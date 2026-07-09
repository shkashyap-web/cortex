import { MemoryEntry, MemoryType } from '@/types';
import { observabilityService } from '../observability/ObservabilityService';

export class MemoryEngine {
  private static instance: MemoryEngine;
  private memoryStore: Map<string, MemoryEntry[]> = new Map();

  private constructor() {
    // Populate some initial mock memory traces for demo purposes
    this.addBootstrapMemory();
  }

  public static getInstance(): MemoryEngine {
    if (!MemoryEngine.instance) {
      MemoryEngine.instance = new MemoryEngine();
    }
    return MemoryEngine.instance;
  }

  /**
   * Recalls memory entries of a specific type for a given entity.
   */
  public async recall(type: MemoryType, entityId: string): Promise<MemoryEntry[]> {
    return observabilityService.measure(
      'memory-engine',
      `recall-${type}`,
      async () => {
        const key = `${type}:${entityId}`;
        return this.memoryStore.get(key) || [];
      },
      { entityId }
    );
  }

  /**
   * Persists a new context memory block.
   */
  public async store(
    type: MemoryType,
    entityId: string,
    key: string,
    value: Record<string, any>,
    summary: string,
    importance = 5,
    tags: string[] = []
  ): Promise<MemoryEntry> {
    return observabilityService.measure(
      'memory-engine',
      `store-${type}`,
      async () => {
        const storeKey = `${type}:${entityId}`;
        const entry: MemoryEntry = {
          id: `MEM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          type,
          entityId,
          key,
          value,
          summary,
          importance,
          tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const existing = this.memoryStore.get(storeKey) || [];
        this.memoryStore.set(storeKey, [...existing, entry]);
        
        console.log(`[MemoryEngine] Stored memory trace of type "${type}" for Entity "${entityId}"`);
        return entry;
      },
      { entityId, key }
    );
  }

  /**
   * Searches across memory keys and tags.
   */
  public async search(query: string, limit = 10): Promise<MemoryEntry[]> {
    const term = query.toLowerCase();
    const results: MemoryEntry[] = [];
    
    for (const entries of Array.from(this.memoryStore.values())) {
      for (const entry of entries) {
        if (
          entry.summary.toLowerCase().includes(term) ||
          entry.key.toLowerCase().includes(term) ||
          entry.tags.some(tag => tag.toLowerCase().includes(term))
        ) {
          results.push(entry);
        }
      }
    }

    return results
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }

  /**
   * Bootstrap memory stubs for demonstration.
   */
  private addBootstrapMemory() {
    const key1 = 'CustomerMemory:CUST-001';
    this.memoryStore.set(key1, [
      {
        id: 'MEM-BOOT-001',
        type: 'CustomerMemory',
        entityId: 'CUST-001',
        key: 'INVESTMENT_STRATEGY_PREFERENCE',
        value: { riskTolerance: 'moderate', preference: 'mutual_funds' },
        summary: 'Customer prefers automated rebalancing. Expressed interest in ESG investments.',
        importance: 8,
        tags: ['wealth', 'preference', 'esg'],
        createdAt: '2026-05-12T10:00:00Z',
        updatedAt: '2026-05-12T10:00:00Z'
      }
    ]);

    const key2 = 'MSMEMemory:MSME-001';
    this.memoryStore.set(key2, [
      {
        id: 'MEM-BOOT-002',
        type: 'MSMEMemory',
        entityId: 'MSME-001',
        key: 'AGRICULTURE_CYCLE_TREND',
        value: { defaultRiskScore: 42, weatherImpact: 'high' },
        summary: 'MSME exhibits high exposure to monsoon variance. Crop cycle delays cash-flow arrivals by 45 days annually.',
        importance: 7,
        tags: ['risk', 'agriculture', 'liquidity'],
        createdAt: '2026-06-01T11:00:00Z',
        updatedAt: '2026-06-01T11:00:00Z'
      }
    ]);
  }
}

export const memoryEngine = MemoryEngine.getInstance();
export default memoryEngine;
