/**
 * Enterprise Memory Engine
 * ---------------------------------------------------------------------------
 * Core Engine: Enterprise Memory Engine (AI_ENGINEERING_RULES.md Section 4).
 *
 * Responsibility
 * --------------
 * Persistent contextual memory for Customers, MSMEs, Branches, Portfolios,
 * Executives, Decisions, and Recommendations (AI_CONTEXT.md, Section 15).
 * Memory is enterprise context — it must never live inside UI components,
 * and this engine must never assume a specific database technology.
 *
 * Design Notes — Dependency Inversion
 * ------------------------------------
 * MemoryEngine depends only on the IMemoryRepository interface
 * (types/index.ts), not on any concrete storage implementation. The
 * default InMemoryMemoryRepository below is an in-process, non-persistent
 * implementation suitable for the current development phase. A future
 * repository-agnostic swap (Postgres, a vector store, etc.) implements
 * the same IMemoryRepository interface and is injected via
 * MemoryEngine.getInstance(customRepository) — no consumer of
 * IMemoryEngine (DecisionEngine, ContextEngine, business services) needs
 * to change.
 *
 * Public method signatures (recall/store/search) are unchanged from the
 * Sprint 0 skeleton to preserve compatibility with existing callers
 * (services/cortex-de/DecisionEngine.ts).
 */

import { IMemoryEngine, IMemoryRepository, MemoryEntry, MemoryType } from '@/types';
import { observabilityService } from '../observability/ObservabilityService';
import { eventBus } from '../event-bus/EventBus';

/**
 * Default repository implementation: in-process, Map-backed, non-persistent.
 * Implements IMemoryRepository so it can be swapped for a real persistence
 * layer later without touching MemoryEngine's public contract.
 */
class InMemoryMemoryRepository implements IMemoryRepository {
  /** Keyed by `${type}:${entityId}` for O(1) recall by entity. */
  private byEntity: Map<string, MemoryEntry[]> = new Map();
  /** Keyed by entry id for O(1) lookup/update/delete by id. */
  private byId: Map<string, MemoryEntry> = new Map();

  public async create(entry: MemoryEntry): Promise<MemoryEntry> {
    const entityKey = `${entry.type}:${entry.entityId}`;
    const existing = this.byEntity.get(entityKey) || [];
    this.byEntity.set(entityKey, [...existing, entry]);
    this.byId.set(entry.id, entry);
    return entry;
  }

  public async findByTypeAndEntity(type: MemoryType, entityId: string): Promise<MemoryEntry[]> {
    return this.byEntity.get(`${type}:${entityId}`) || [];
  }

  public async findById(id: string): Promise<MemoryEntry | undefined> {
    return this.byId.get(id);
  }

  public async update(
    id: string,
    patch: Partial<Pick<MemoryEntry, 'value' | 'summary' | 'importance' | 'tags'>>
  ): Promise<MemoryEntry | undefined> {
    const existing = this.byId.get(id);
    if (!existing) return undefined;

    const updated: MemoryEntry = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString()
    };

    this.byId.set(id, updated);
    const entityKey = `${updated.type}:${updated.entityId}`;
    const list = this.byEntity.get(entityKey) || [];
    this.byEntity.set(entityKey, list.map(e => (e.id === id ? updated : e)));

    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    const existing = this.byId.get(id);
    if (!existing) return false;

    this.byId.delete(id);
    const entityKey = `${existing.type}:${existing.entityId}`;
    const list = this.byEntity.get(entityKey) || [];
    this.byEntity.set(entityKey, list.filter(e => e.id !== id));

    return true;
  }

  public async list(filter?: { type?: MemoryType }): Promise<MemoryEntry[]> {
    const all = Array.from(this.byId.values());
    if (filter?.type) {
      return all.filter(e => e.type === filter.type);
    }
    return all;
  }
}

export class MemoryEngine implements IMemoryEngine {
  private static instance: MemoryEngine;
  private repository: IMemoryRepository;

  private constructor(repository: IMemoryRepository) {
    this.repository = repository;
    // Populate initial mock memory traces for demo purposes (unchanged from Sprint 0).
    this.addBootstrapMemory();
  }

  /**
   * @param repository Optional custom IMemoryRepository implementation.
   *                    Only honored on first construction (singleton);
   *                    defaults to the in-process InMemoryMemoryRepository.
   */
  public static getInstance(repository?: IMemoryRepository): MemoryEngine {
    if (!MemoryEngine.instance) {
      MemoryEngine.instance = new MemoryEngine(repository ?? new InMemoryMemoryRepository());
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
      async () => this.repository.findByTypeAndEntity(type, entityId),
      { entityId }
    );
  }

  /**
   * Persists a new context memory block and notifies the Event Bus.
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

        const stored = await this.repository.create(entry);

        await eventBus.publish({
          id: `EVT-MEM-${Math.random().toString(36).substr(2, 9)}`,
          type: 'MemoryStored',
          timestamp: new Date().toISOString(),
          source: 'memory-engine',
          payload: { memoryId: stored.id, type, entityId },
          correlationId: `CORR-MEM-${stored.id}`
        });

        return stored;
      },
      { entityId, key }
    );
  }

  /**
   * Updates the mutable fields of an existing memory entry.
   */
  public async update(
    id: string,
    patch: Partial<Pick<MemoryEntry, 'value' | 'summary' | 'importance' | 'tags'>>
  ): Promise<MemoryEntry | undefined> {
    return observabilityService.measure(
      'memory-engine',
      'update',
      async () => this.repository.update(id, patch),
      { memoryId: id }
    );
  }

  /**
   * Deletes a memory entry and notifies the Event Bus.
   */
  public async delete(id: string): Promise<boolean> {
    return observabilityService.measure(
      'memory-engine',
      'delete',
      async () => {
        const existing = await this.repository.findById(id);
        const deleted = await this.repository.delete(id);

        if (deleted && existing) {
          await eventBus.publish({
            id: `EVT-MEM-${Math.random().toString(36).substr(2, 9)}`,
            type: 'MemoryDeleted',
            timestamp: new Date().toISOString(),
            source: 'memory-engine',
            payload: { memoryId: id, type: existing.type, entityId: existing.entityId },
            correlationId: `CORR-MEM-${id}`
          });
        }

        return deleted;
      },
      { memoryId: id }
    );
  }

  /**
   * Searches across memory keys, summaries, and tags.
   */
  public async search(query: string, limit = 10): Promise<MemoryEntry[]> {
    return observabilityService.measure(
      'memory-engine',
      'search',
      async () => {
        const term = query.toLowerCase();
        const all = await this.repository.list();

        return all
          .filter(
            entry =>
              entry.summary.toLowerCase().includes(term) ||
              entry.key.toLowerCase().includes(term) ||
              entry.tags.some(tag => tag.toLowerCase().includes(term))
          )
          .sort((a, b) => b.importance - a.importance)
          .slice(0, limit);
      },
      { query, limit }
    );
  }

  /**
   * Bootstrap memory stubs for demonstration (unchanged from Sprint 0).
   */
  private addBootstrapMemory() {
    const bootstrapEntries: MemoryEntry[] = [
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
      },
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
    ];

    // Seed directly via the repository (not via store()) so bootstrap data
    // does not publish MemoryStored events on startup.
    bootstrapEntries.forEach(entry => {
      void this.repository.create(entry);
    });
  }
}

export const memoryEngine = MemoryEngine.getInstance();
export default memoryEngine;
