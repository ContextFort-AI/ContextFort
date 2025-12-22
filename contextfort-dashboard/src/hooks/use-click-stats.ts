'use client';

import { clickDetectionAPI } from '@/lib/api/click-detection';
import type { ClickEvent, ClickStats } from '@/types/incidents';
import { useEffect, useState } from 'react';

interface UseClickStatsOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function useClickStats(options: UseClickStatsOptions = {}) {
  const { refreshInterval = 2000, enabled = true } = options;
  const [stats, setStats] = useState<ClickStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await clickDetectionAPI.getStats();
      setStats(data);
      setError(null);
      setIsOnline(true);
    } catch (err) {
      setError(err as Error);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchStats();

    const interval = setInterval(fetchStats, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, enabled]);

  return { stats, isLoading, error, isOnline, refetch: fetchStats };
}

export function useClickEvents(options: UseClickStatsOptions = {}) {
  const { refreshInterval = 2000, enabled = true } = options;
  const [events, setEvents] = useState<ClickEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    try {
      const data = await clickDetectionAPI.getRecent(100);
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchEvents();

    const interval = setInterval(fetchEvents, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, enabled]);

  return { events, isLoading, error, refetch: fetchEvents };
}
