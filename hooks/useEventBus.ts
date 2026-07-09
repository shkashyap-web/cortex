'use client';

import { useEffect, useCallback } from 'react';
import { EventType, CortexEvent, EventCallback } from '@/types';
import { eventBus } from '@/services/event-bus/EventBus';

export function useEventBus() {
  const publish = useCallback(async <T = any>(
    type: EventType,
    source: string,
    payload: T,
    userId?: string
  ) => {
    const event: CortexEvent<T> = {
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
  const useSubscription = <T = any>(
    type: EventType,
    subscriberName: string,
    callback: EventCallback<T>
  ) => {
    useEffect(() => {
      const subId = eventBus.subscribe<T>(type, subscriberName, callback);
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
