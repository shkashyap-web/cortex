/**
 * Enterprise Event Bus
 * ---------------------------------------------------------------------------
 * Core Engine: Enterprise Event Bus (see AI_ENGINEERING_RULES.md Section 4).
 * This name is permanent and must never be renamed or duplicated.
 *
 * Responsibility
 * --------------
 * Provides the sole mechanism through which CORTEX services communicate.
 * Per ARCHITECTURE.md and AI_ENGINEERING_RULES.md Section 8, services must
 * NEVER call one another directly:
 *
 *   Good:  CustomerService -> publish(CustomerUpdated) -> FraudService (subscriber)
 *   Bad:   CustomerService -> FraudService.someMethod()
 *
 * This engine is the enforcement point for that rule: it is the only
 * sanctioned inter-service communication channel in CORTEX.
 *
 * Design Notes
 * ------------
 * - Singleton, matching the established pattern used by every other core
 *   engine in this codebase (ObservabilityService, MemoryEngine,
 *   DecisionEngineService, etc.). This is an intentional continuation of
 *   the existing architecture, not a new pattern being introduced.
 * - Implements IEventBus (types/index.ts) so consumers depend on an
 *   interface rather than this concrete class, per Section 6 of the
 *   engineering rules ("Services must expose interfaces, hide
 *   implementation details").
 * - Subscriptions are strongly typed against EventPayloadMap: subscribing
 *   to `'DecisionCompleted'` yields a callback whose event.payload is
 *   inferred as EventPayloadMap['DecisionCompleted'], with no `any` casts
 *   required at call sites.
 * - Publish dispatches to subscribers concurrently and awaits each
 *   callback. Because `await` on a non-Promise value resolves
 *   synchronously on the next microtask, this single dispatch path
 *   transparently supports both synchronous callbacks (`(event) => {...}`)
 *   and asynchronous callbacks (`async (event) => { await ... }`) without
 *   requiring the caller to declare which kind it is.
 * - A single subscriber's failure is isolated (caught and logged via
 *   ObservabilityService) and never prevents delivery to other
 *   subscribers of the same event, nor bubbles up to the publisher.
 * - Every subscribe/unsubscribe/publish operation is recorded through the
 *   existing ObservabilityService (Section 15/Explainability principles
 *   require every engine to be observable and auditable), rather than
 *   raw console logging.
 */

import {
  CortexEvent,
  EventType,
  IEventBus,
  Subscription,
  TypedCortexEvent,
  TypedEventCallback
} from '@/types';
import { observabilityService } from '../observability/ObservabilityService';

export class EventBus implements IEventBus {
  private static instance: EventBus;

  /** Active subscriptions, keyed by EventType. */
  private subscriptions: Map<EventType, Subscription[]> = new Map();

  /**
   * Bounded ring buffer of recently published events (most recent last).
   * Added in Milestone 2 to support situational-awareness queries (e.g.
   * the Context Engine's "recent events" assembly) without requiring
   * every consumer to build its own subscription-based cache. This is
   * NOT a durable audit trail — AuditTrail/ObservabilityService remain
   * the authoritative record; this buffer only serves short-lived
   * operational context.
   */
  private history: CortexEvent[] = [];
  private readonly maxHistory = 500;

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe a callback to a specific Cortex event type.
   *
   * @param type            The EventType to listen for.
   * @param subscriberName  Human-readable identifier of the subscribing
   *                        service/agent (e.g. 'FraudService'). Used for
   *                        observability, debugging, and bulk cleanup via
   *                        unsubscribeAll.
   * @param callback        Sync or async handler. Its `event.payload` is
   *                        strongly typed via EventPayloadMap[type].
   * @returns               A unique subscription ID, required to
   *                        unsubscribe this specific listener later.
   */
  public subscribe<K extends EventType>(
    type: K,
    subscriberName: string,
    callback: TypedEventCallback<K>
  ): string {
    const id = `${type}-${subscriberName}-${Math.random().toString(36).substr(2, 9)}`;

    const subscription: Subscription = {
      id,
      type,
      // Subscription.callback is intentionally untyped (EventCallback) at
      // storage time because a single Map bucket holds callbacks for many
      // distinct payload shapes; type safety is enforced at the public
      // subscribe<K>/publish<K> boundary instead.
      callback: callback as unknown as Subscription['callback'],
      subscriberName
    };

    const currentSubs = this.subscriptions.get(type) || [];
    this.subscriptions.set(type, [...currentSubs, subscription]);

    observabilityService.recordExecution('event-bus', 'subscribe', {
      eventType: type,
      subscriberName,
      subscriptionId: id
    });

    return id;
  }

  /**
   * Unsubscribe a single listener using the ID returned by subscribe().
   */
  public unsubscribe(type: EventType, id: string): boolean {
    const currentSubs = this.subscriptions.get(type);
    if (!currentSubs || currentSubs.length === 0) {
      return false;
    }

    const filtered = currentSubs.filter(sub => sub.id !== id);
    const removed = filtered.length !== currentSubs.length;
    this.subscriptions.set(type, filtered);

    if (removed) {
      observabilityService.recordExecution('event-bus', 'unsubscribe', {
        eventType: type,
        subscriptionId: id
      });
    }

    return removed;
  }

  /**
   * Remove every subscription registered by a given subscriber, across
   * all event types. Useful for service teardown/hot-reload scenarios so
   * a service never leaks stale listeners into the bus.
   *
   * @returns The number of subscriptions removed.
   */
  public unsubscribeAll(subscriberName: string): number {
    let removedCount = 0;

    for (const [type, subs] of this.subscriptions.entries()) {
      const remaining = subs.filter(sub => sub.subscriberName !== subscriberName);
      removedCount += subs.length - remaining.length;
      this.subscriptions.set(type, remaining);
    }

    if (removedCount > 0) {
      observabilityService.recordExecution('event-bus', 'unsubscribeAll', {
        subscriberName,
        removedCount
      });
    }

    return removedCount;
  }

  /**
   * Publish an event to all active subscribers of its type.
   *
   * Dispatch is concurrent (Promise.all) and non-blocking with respect to
   * subscriber ordering; each subscriber's error is isolated so one
   * failing handler cannot prevent delivery to others or fail the
   * publish() call itself.
   */
  public async publish<K extends EventType>(event: TypedCortexEvent<K>): Promise<void> {
    this.history.push(event as CortexEvent);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const subs = this.subscriptions.get(event.type) || [];

    observabilityService.recordExecution('event-bus', 'publish', {
      eventType: event.type,
      correlationId: event.correlationId,
      subscriberCount: subs.length
    });

    if (subs.length === 0) {
      return;
    }

    const dispatches = subs.map(async sub => {
      try {
        await sub.callback(event as CortexEvent);
      } catch (error: any) {
        observabilityService.recordError(
          'event-bus',
          'publish',
          error?.message || String(error),
          {
            eventType: event.type,
            correlationId: event.correlationId,
            subscriberName: sub.subscriberName,
            subscriptionId: sub.id
          }
        );
      }
    });

    await Promise.all(dispatches);
  }

  /**
   * Number of active subscribers for a given event type. Primarily
   * intended for verification/testing and operational introspection.
   */
  public getSubscriberCount(type: EventType): number {
    return this.subscriptions.get(type)?.length ?? 0;
  }

  /**
   * Read-only snapshot of active subscriptions, optionally filtered by
   * event type. Intended for verification/testing and diagnostics only;
   * callers must not mutate the returned array's contents.
   */
  public getActiveSubscriptions(type?: EventType): ReadonlyArray<Subscription> {
    if (type) {
      return [...(this.subscriptions.get(type) || [])];
    }

    return Array.from(this.subscriptions.values()).flat();
  }

  /**
   * Returns recently published events, most recent first, optionally
   * filtered by type.
   */
  public getRecentEvents(type?: EventType, limit = 20): ReadonlyArray<CortexEvent> {
    const source = type ? this.history.filter(e => e.type === type) : this.history;
    return [...source].reverse().slice(0, limit);
  }
}

export const eventBus = EventBus.getInstance();
export default eventBus;
