'use client';

import { useEffect, useCallback } from 'react';
import { EventType, EventPayloadMap, TypedCortexEvent, TypedEventCallback } from '@/types';
import { eventBus } from '@/services/event-bus/EventBus';

export function useEventBus() {
  // Bound to the Milestone 2 strongly typed EventBus: `K` ties `type` to
  // its exact payload shape via EventPayloadMap, matching IEventBus.publish's
  // `publish<K extends EventType>(event: TypedCortexEvent<K>)` signature.
  const publish = useCallback(async <K extends EventType>(
    type: K,
    source: string,
    payload: EventPayloadMap[K],
    userId?: string
  ) => {
    const event: TypedCortexEvent<K> = {
      id: `EVT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      type,
      timestamp: new Date().toISOString(),
      source,
      payload,
      userId,
      correlationId: `CORR-PUB-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };
    await eventBus.publish(event);
  }, []);

  /**
   * Helper to subscribe locally in components with automatic cleanup.
   */
  const useSubscription = <K extends EventType>(
    type: K,
    subscriberName: string,
    callback: TypedEventCallback<K>
  ) => {
    useEffect(() => {
      const subId = eventBus.subscribe<K>(type, subscriberName, callback);
      return () => {
        eventBus.unsubscribe(type, subId);
      };
    }, [type, subscriberName, callback]);
  };

  return {
    publish,
    useSubscription
  };
}
