'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  GlobeIcon,
  RefreshCwIcon,
  Trash2Icon,
  LinkIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  ClockIcon,
  ActivityIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface Screenshot {
  id: number;
  tabId: number;
  url: string;
  title: string;
  reason: string;
  timestamp: string;
  dataUrl: string;
  sessionId?: number | null;
}

interface Session {
  id: number;
  startTime: string;
  endTime: string | null;
  tabId: number;
  tabTitle: string;
  tabUrl: string;
  screenshotCount: number;
  status: 'active' | 'ended';
  duration?: number;
}

interface URLVisit {
  url: string;
  hostname: string;
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
  titles: string[];
}

export default function ContextPage() {
  console.log('🌐 [Context Page] Component loaded!');

  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set());

  // Load data from Chrome storage
  const loadData = async () => {
    console.log('🌐 [Context Page] loadData() called');
    setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['screenshots', 'sessions']);
        const screenshotsList = result.screenshots || [];
        const sessionsList = result.sessions || [];

        // Deduplicate sessions
        const uniqueSessions = sessionsList.reduce((acc: Session[], session: Session) => {
          if (!acc.find(s => s.id === session.id)) {
            acc.push(session);
          }
          return acc;
        }, []);

        console.log('[Context Page] Loaded sessions:', uniqueSessions.length, 'Screenshots:', screenshotsList.length);
        setScreenshots(screenshotsList);
        setSessions(uniqueSessions);
      }
    } catch (error) {
      console.error('[Context Page] Error loading data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    // Refresh every 3 seconds
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Toggle session expansion
  const toggleSession = (sessionId: number) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  // Clear all data
  const clearAllData = async () => {
    if (confirm('Are you sure you want to clear all context data?')) {
      try {
        // @ts-ignore - Chrome extension API
        if (typeof chrome !== 'undefined' && chrome?.storage) {
          // @ts-ignore - Chrome extension API
          await chrome.storage.local.set({ screenshots: [], sessions: [] });
          setScreenshots([]);
          setSessions([]);
        }
      } catch (error) {
        console.error('[Context Page] Error clearing data:', error);
      }
    }
  };

  // Helper functions
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ${seconds % 60}s`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  // Group screenshots by session and extract unique URLs
  const groupedData = sessions.map(session => {
    const sessionScreenshots = screenshots.filter(s => s.sessionId === session.id);

    // Extract unique URLs with visit details
    const urlMap = new Map<string, URLVisit>();
    sessionScreenshots.forEach(screenshot => {
      const hostname = new URL(screenshot.url).hostname;
      const existing = urlMap.get(screenshot.url);

      if (existing) {
        existing.visitCount++;
        existing.lastVisit = screenshot.timestamp;
        if (!existing.titles.includes(screenshot.title)) {
          existing.titles.push(screenshot.title);
        }
      } else {
        urlMap.set(screenshot.url, {
          url: screenshot.url,
          hostname,
          visitCount: 1,
          firstVisit: screenshot.timestamp,
          lastVisit: screenshot.timestamp,
          titles: [screenshot.title]
        });
      }
    });

    return {
      session,
      urls: Array.from(urlMap.values()).sort((a, b) => b.visitCount - a.visitCount)
    };
  }).sort((a, b) => new Date(b.session.startTime).getTime() - new Date(a.session.startTime).getTime());

  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const totalUniqueURLs = groupedData.reduce((sum, data) => sum + data.urls.length, 0);
  const totalVisits = screenshots.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Context</h1>
          <p className="text-muted-foreground">
            Unique URLs visited per session with visit counts and timestamps
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearAllData}
            disabled={sessions.length === 0}
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Sessions"
          value={totalSessions}
          icon={<ActivityIcon className="h-4 w-4" />}
          description="Agent mode sessions"
        />
        <StatCard
          title="Active Sessions"
          value={activeSessions}
          variant={activeSessions > 0 ? 'error' : 'default'}
          icon={<ClockIcon className="h-4 w-4" />}
          description="Currently running"
        />
        <StatCard
          title="Unique URLs"
          value={totalUniqueURLs}
          icon={<GlobeIcon className="h-4 w-4" />}
          description="Across all sessions"
        />
        <StatCard
          title="Total Visits"
          value={totalVisits}
          icon={<LinkIcon className="h-4 w-4" />}
          description="All URL visits"
        />
      </div>

      {/* Sessions with URLs */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading sessions...</span>
            </div>
          </CardContent>
        </Card>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <GlobeIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No sessions yet</h3>
              <p className="text-sm text-muted-foreground">
                Sessions will appear here when agent mode (debugger) is attached
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {/* This will be overridden by dashboard-override.js */}
          <Card>
            <CardContent className="py-12">
              <div className="flex items-center justify-center">
                <span className="text-sm text-muted-foreground">
                  Loading context data...
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
