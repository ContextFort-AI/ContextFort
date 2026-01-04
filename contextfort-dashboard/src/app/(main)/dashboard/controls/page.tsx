'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LinkIcon,
  RefreshCwIcon,
  Trash2Icon,
  GlobeIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  ClockIcon,
  ActivityIcon,
  LayersIcon
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

interface SessionVisit {
  sessionId: number;
  sessionStartTime: string;
  sessionStatus: 'active' | 'ended';
  visitCount: number;
  firstVisit: string;
  lastVisit: string;
  titles: string[];
}

interface URLData {
  url: string;
  hostname: string;
  totalVisits: number;
  sessionCount: number;
  firstVisit: string;
  lastVisit: string;
  sessions: SessionVisit[];
}

export default function URLLogsPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedURLs, setExpandedURLs] = useState<Set<string>>(new Set());

  // Set page title
  useEffect(() => {
    document.title = 'Controls - ContextFort';
  }, []);

  // Load data from Chrome storage
  const loadData = async () => {
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

        setScreenshots(screenshotsList);
        setSessions(uniqueSessions);
      }
    } catch (error) {
      console.error('[URL Logs Page] Error loading data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    // Refresh every 3 seconds
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Toggle URL expansion
  const toggleURL = (url: string) => {
    const newExpanded = new Set(expandedURLs);
    if (newExpanded.has(url)) {
      newExpanded.delete(url);
    } else {
      newExpanded.add(url);
    }
    setExpandedURLs(newExpanded);
  };

  // Clear all data
  const clearAllData = async () => {
    if (confirm('Are you sure you want to clear all URL logs data?')) {
      try {
        // @ts-ignore - Chrome extension API
        if (typeof chrome !== 'undefined' && chrome?.storage) {
          // @ts-ignore - Chrome extension API
          await chrome.storage.local.set({ screenshots: [], sessions: [] });
          setScreenshots([]);
          setSessions([]);
        }
      } catch (error) {
        console.error('[URL Logs Page] Error clearing data:', error);
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (timestamp: string) => {
    return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
  };

  // Group screenshots by URL
  const urlMap = new Map<string, URLData>();

  screenshots.forEach(screenshot => {
    try {
      const hostname = new URL(screenshot.url).hostname;
      const sessionId = screenshot.sessionId;

      if (!sessionId) return;

      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;

      let urlData = urlMap.get(screenshot.url);

      if (!urlData) {
        urlData = {
          url: screenshot.url,
          hostname: hostname,
          totalVisits: 0,
          sessionCount: 0,
          firstVisit: screenshot.timestamp,
          lastVisit: screenshot.timestamp,
          sessions: []
        };
        urlMap.set(screenshot.url, urlData);
      }

      // Update URL-level data
      urlData.totalVisits++;
      if (new Date(screenshot.timestamp) < new Date(urlData.firstVisit)) {
        urlData.firstVisit = screenshot.timestamp;
      }
      if (new Date(screenshot.timestamp) > new Date(urlData.lastVisit)) {
        urlData.lastVisit = screenshot.timestamp;
      }

      // Find or create session visit data
      let sessionVisit = urlData.sessions.find(s => s.sessionId === sessionId);

      if (!sessionVisit) {
        sessionVisit = {
          sessionId: sessionId,
          sessionStartTime: session.startTime,
          sessionStatus: session.status,
          visitCount: 0,
          firstVisit: screenshot.timestamp,
          lastVisit: screenshot.timestamp,
          titles: []
        };
        urlData.sessions.push(sessionVisit);
        urlData.sessionCount++;
      }

      // Update session visit data
      sessionVisit.visitCount++;
      if (new Date(screenshot.timestamp) > new Date(sessionVisit.lastVisit)) {
        sessionVisit.lastVisit = screenshot.timestamp;
      }
      if (!sessionVisit.titles.includes(screenshot.title)) {
        sessionVisit.titles.push(screenshot.title);
      }
    } catch (error) {
      console.error('[URL Logs] Error processing screenshot:', error);
    }
  });

  const urlDataList = Array.from(urlMap.values()).sort((a, b) => b.totalVisits - a.totalVisits);

  const totalURLs = urlDataList.length;
  const urlsWithMultipleSessions = urlDataList.filter(u => u.sessionCount > 1).length;
  const totalSessions = sessions.length;
  const totalVisits = screenshots.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controls</h1>
          <p className="text-muted-foreground">
            Track URL navigation patterns and transitions across sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* URL List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading URL logs...</span>
            </div>
          </CardContent>
        </Card>
      ) : urlDataList.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <LinkIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No URL logs yet</h3>
              <p className="text-sm text-muted-foreground">
                URL logs will appear here when agent mode (debugger) is attached
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {urlDataList.map((urlData) => (
            <Card key={urlData.url}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{urlData.hostname}</CardTitle>
                    <CardDescription className="truncate">{urlData.url}</CardDescription>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <ActivityIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{urlData.totalVisits} visits</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LayersIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{urlData.sessionCount} sessions</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {urlData.sessions.map((sessionVisit) => (
                    <div
                      key={sessionVisit.sessionId}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{formatDateTime(sessionVisit.sessionStartTime)}</span>
                        </div>
                        <Badge variant="outline" className="bg-background">
                          Session {sessionVisit.sessionId}
                        </Badge>
                        <Badge variant="outline" className="bg-background">
                          {sessionVisit.visitCount} visits
                        </Badge>
                        <Badge
                          variant="outline"
                          className={sessionVisit.sessionStatus === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-background'}
                        >
                          {sessionVisit.sessionStatus}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleURL(urlData.url)}
                      >
                        <ChevronDownIcon
                          className={`h-4 w-4 transition-transform ${
                            expandedURLs.has(urlData.url) ? 'rotate-180' : ''
                          }`}
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
