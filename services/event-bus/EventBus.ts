import { CortexEvent, EventCallback, EventType, Subscription } from '@/types';

export class EventBus {
  private static instance: EventBus;
  private subscriptions: Map<EventType, Subscription[]> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe a callback to a specific Cortex event type.
   */
  public subscribe<T = any>(
    type: EventType,
    subscriberName: string,
    callback: EventCallback<T>
  ): string {
    const id = `${type}-${subscriberName}-${Math.random().toString(36).substr(2, 9)}`;
    const subscription: Subscription = {
      id,
      type,
      callback,
      subscriberName
    };

    const currentSubs = this.subscriptions.get(type) || [];
    this.subscriptions.set(type, [...currentSubs, subscription]);

    // Record system observability event (stub log)
    console.log(`[EventBus] Subscriber "${subscriberName}" registered to event: ${type} (ID: ${id})`);
    
    return id;
  }

  /**
   * Unsubscribe using a subscription ID.
   */
  public unsubscribe(type: EventType, id: string): boolean {
    const currentSubs = this.subscriptions.get(type);
    if (!currentSubs) return false;

    const filtered = currentSubs.filter(sub => sub.id !== id);
    this.subscriptions.set(type, filtered);
    
    console.log(`[EventBus] Unsubscribed ID: ${id} from event: ${type}`);
    return true;
  }

  /**
   * Publish an event to all active subscribers.
   */
  public async publish<T = any>(event: CortexEvent<T>): Promise<void> {
    const subs = this.subscriptions.get(event.type) || [];
    if (subs.length === 0) {
      console.log(`[EventBus] Published event "${event.type}" (CorrelationID: ${event.correlationId}) with 0 subscribers.`);
      return;
    }

    console.log(`[EventBus] Publishing event "${event.type}" to ${subs.length} subscribers...`);

    // Asynchronous dispatch to ensure non-blocking execution
    const promises = subs.map(sub => {
      return (async () => {
        try {
          await sub.callback(event);
          console.log(`[EventBus] Successfully notified "${sub.subscriberName}" of event ${event.type}`);
        } catch (error) {
          console.error(`[EventBus] Error in subscriber "${sub.subscriberName}" for event ${event.type}:`, error);
        }
      })();
    });

    await Promise.all(promises);
  }
}

export const eventBus = EventBus.getInstance();
export default eventBus;
