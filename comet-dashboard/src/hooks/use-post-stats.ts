'use client';

import { postMonitorAPI } from '@/lib/api/post-monitor';
import type { POSTRequest, POSTStats } from '@/types/incidents';
import { useEffect, useState } from 'react';

interface UsePostStatsOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function usePostStats(options: UsePostStatsOptions = {}) {
  const { refreshInterval = 5000, enabled = true } = options;
  const [stats, setStats] = useState<POSTStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await postMonitorAPI.getStats();
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

export function usePostRequests(options: UsePostStatsOptions = {}) {
  const { refreshInterval = 5000, enabled = true } = options;
  const [requests, setRequests] = useState<POSTRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequests = async () => {
    try {
      const data = await postMonitorAPI.getRequests();
      setRequests(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRequest = async (id: number) => {
    try {
      await postMonitorAPI.deleteRequest(id);
      await fetchRequests();
    } catch (err) {
      setError(err as Error);
    }
  };

  const clearAll = async () => {
    try {
      await postMonitorAPI.clearAll();
      await fetchRequests();
    } catch (err) {
      setError(err as Error);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchRequests();

    const interval = setInterval(fetchRequests, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, enabled]);

  return {
    requests,
    isLoading,
    error,
    refetch: fetchRequests,
    deleteRequest,
    clearAll,
  };
}
