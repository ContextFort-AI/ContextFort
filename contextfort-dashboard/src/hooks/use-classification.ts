'use client';

import { useState, useEffect } from 'react';
import { postMonitorAPI } from '@/lib/api/post-monitor';
import type { POSTRequest, ClassificationStats } from '@/types/incidents';

interface UseClassificationOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

export function useHumanRequests(options: UseClassificationOptions = {}) {
  const { refreshInterval = 5000, enabled = true } = options;
  const [requests, setRequests] = useState<POSTRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        const data = await postMonitorAPI.getHumanRequests();
        setRequests(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch human requests:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch human requests'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, enabled]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const data = await postMonitorAPI.getHumanRequests();
      setRequests(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch human requests:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch human requests'));
    } finally {
      setIsLoading(false);
    }
  };

  return { requests, isLoading, error, refetch };
}

export function useHumanBackgroundRequests(options: UseClassificationOptions = {}) {
  const { refreshInterval = 5000, enabled = true } = options;
  const [requests, setRequests] = useState<POSTRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        const data = await postMonitorAPI.getHumanBackgroundRequests();
        setRequests(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch human background requests:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch human background requests'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, enabled]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const data = await postMonitorAPI.getHumanBackgroundRequests();
      setRequests(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch human background requests:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch human background requests'));
    } finally {
      setIsLoading(false);
    }
  };

  return { requests, isLoading, error, refetch };
}

export function useBotRequests(options: UseClassificationOptions = {}) {
  const { refreshInterval = 5000, enabled = true } = options;
  const [requests, setRequests] = useState<POSTRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        const data = await postMonitorAPI.getBotRequests();
        setRequests(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch bot requests:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch bot requests'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, enabled]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const data = await postMonitorAPI.getBotRequests();
      setRequests(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch bot requests:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch bot requests'));
    } finally {
      setIsLoading(false);
    }
  };

  return { requests, isLoading, error, refetch };
}

export function useClassificationStats(options: UseClassificationOptions = {}) {
  const { refreshInterval = 10000, enabled = true } = options;
  const [stats, setStats] = useState<ClassificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchData = async () => {
      try {
        const data = await postMonitorAPI.getClassificationStats();
        setStats(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch classification stats:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch classification stats'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, enabled]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const data = await postMonitorAPI.getClassificationStats();
      setStats(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch classification stats:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch classification stats'));
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading, error, refetch };
}
