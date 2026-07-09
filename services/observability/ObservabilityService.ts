import { ObservabilityMetric } from '@/types';

export class ObservabilityService {
  private static instance: ObservabilityService;
  private metrics: ObservabilityMetric[] = [];
  private maxStoredMetrics = 1000;

  private constructor() {}

  public static getInstance(): ObservabilityService {
    if (!ObservabilityService.instance) {
      ObservabilityService.instance = new ObservabilityService();
    }
    return ObservabilityService.instance;
  }

  /**
   * Records a latency metric.
   */
  public recordLatency(source: string, name: string, durationMs: number, metadata: Record<string, any> = {}): void {
    this.record({
      id: `METRIC-LAT-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'LATENCY',
      source,
      name,
      durationMs,
      metadata
    });
  }

  /**
   * Records an execution/usage metric.
   */
  public recordExecution(source: string, name: string, metadata: Record<string, any> = {}): void {
    this.record({
      id: `METRIC-EXE-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'EXECUTION',
      source,
      name,
      metadata
    });
  }

  /**
   * Records an error event.
   */
  public recordError(source: string, name: string, errorMessage: string, metadata: Record<string, any> = {}): void {
    this.record({
      id: `METRIC-ERR-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      source,
      name,
      metadata: { ...metadata, errorMessage }
    });
  }

  /**
   * Records an audit activity event.
   */
  public recordAudit(source: string, name: string, metadata: Record<string, any> = {}): void {
    this.record({
      id: `METRIC-AUD-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: 'AUDIT',
      source,
      name,
      metadata
    });
  }

  /**
   * Measure the execution time of an action.
   */
  public async measure<T>(source: string, name: string, action: () => Promise<T>, metadata: Record<string, any> = {}): Promise<T> {
    const start = performance.now();
    try {
      const result = await action();
      const end = performance.now();
      this.recordLatency(source, name, end - start, { ...metadata, success: true });
      return result;
    } catch (error: any) {
      const end = performance.now();
      this.recordLatency(source, name, end - start, { ...metadata, success: false });
      this.recordError(source, name, error.message || String(error), metadata);
      throw error;
    }
  }

  /**
   * Retrieve all recorded metrics.
   */
  public getMetrics(filter?: { type?: string; source?: string }): ObservabilityMetric[] {
    let result = this.metrics;
    if (filter) {
      if (filter.type) {
        result = result.filter(m => m.type === filter.type);
      }
      if (filter.source) {
        result = result.filter(m => m.source === filter.source);
      }
    }
    return result;
  }

  /**
   * Internal push with storage limit enforcement.
   */
  private record(metric: ObservabilityMetric): void {
    this.metrics.push(metric);
    console.log(`[Observability] [${metric.type}] ${metric.source} -> ${metric.name} (${metric.durationMs ? `${metric.durationMs.toFixed(2)}ms` : 'Invoked'})`);
    
    if (this.metrics.length > this.maxStoredMetrics) {
      this.metrics.shift(); // Evict oldest
    }
  }
}

export const observabilityService = ObservabilityService.getInstance();
export default observabilityService;
