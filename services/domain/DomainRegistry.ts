import { BankingEntityType } from '@/types';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { MOCK_MSMES } from '@/data/msmes';
import { MOCK_LOANS } from '@/data/loans';
import { MOCK_BRANCHES } from '@/data/branches';
import { MOCK_EMPLOYEES } from '@/data/employees';

export class DomainRegistryService {
  private static instance: DomainRegistryService;
  private registeredEntities: Map<BankingEntityType, string[]> = new Map();

  private constructor() {
    // Populate registry with initial mock data IDs
    this.registerEntityBatch('Customer', MOCK_CUSTOMERS.map(c => c.id));
    this.registerEntityBatch('MSME', MOCK_MSMES.map(m => m.id));
    this.registerEntityBatch('Loan', MOCK_LOANS.map(l => l.id));
    this.registerEntityBatch('Branch', MOCK_BRANCHES.map(b => b.id));
    this.registerEntityBatch('Employee', MOCK_EMPLOYEES.map(e => e.id));
  }

  public static getInstance(): DomainRegistryService {
    if (!DomainRegistryService.instance) {
      DomainRegistryService.instance = new DomainRegistryService();
    }
    return DomainRegistryService.instance;
  }

  /**
   * Register a new entity ID under a banking entity type.
   */
  public registerEntity(type: BankingEntityType, id: string): void {
    const list = this.registeredEntities.get(type) || [];
    if (!list.includes(id)) {
      this.registeredEntities.set(type, [...list, id]);
      console.log(`[DomainRegistry] Registered Entity: "${id}" under Type: "${type}"`);
    }
  }

  /**
   * Batch register multiple entity IDs.
   */
  public registerEntityBatch(type: BankingEntityType, ids: string[]): void {
    const list = this.registeredEntities.get(type) || [];
    const merged = Array.from(new Set([...list, ...ids]));
    this.registeredEntities.set(type, merged);
  }

  /**
   * Discover if an entity ID exists and return its registered type.
   */
  public discoverEntity(id: string): BankingEntityType | undefined {
    for (const [type, ids] of Array.from(this.registeredEntities.entries())) {
      if (ids.includes(id)) {
        return type;
      }
    }
    return undefined;
  }

  /**
   * List all entity IDs of a certain type.
   */
  public listEntities(type: BankingEntityType): string[] {
    return this.registeredEntities.get(type) || [];
  }
}

export const domainRegistryService = DomainRegistryService.getInstance();
export default domainRegistryService;
