'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCwIcon, EyeIcon } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { columns, Screenshot, Session, SessionRow } from './columns';
import { DataTable } from './data-table';

export default function VisibilityPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set());
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState<Record<number, number>>({});
  const hasAutoExpandedRef = useRef(false);

  // Set page title
  useEffect(() => {
    document.title = 'Visibility - ContextFort';
  }, []);

  // Load screenshots and sessions from Chrome storage
  const loadScreenshots = async () => {
    setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['screenshots', 'sessions']);
        const screenshotsList = result.screenshots || [];
        const sessionsList = result.sessions || [];

        // Deduplicate sessions by ID
        const uniqueSessions = sessionsList.reduce((acc: Session[], session: Session) => {
          if (!acc.find(s => s.id === session.id)) {
            acc.push(session);
          }
          return acc;
        }, []);

        // Show earliest first (chronological order)
        setScreenshots(screenshotsList);
        setSessions(uniqueSessions);

        // Auto-expand the first (most recent) session ONLY on first load
        if (uniqueSessions.length > 0 && !hasAutoExpandedRef.current) {
          setExpandedSessions(new Set([uniqueSessions[0].id]));
          hasAutoExpandedRef.current = true;
        }
      }
    } catch (error) {
      console.error('Error loading screenshots:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadScreenshots();
    // Refresh every 3 seconds
    const interval = setInterval(loadScreenshots, 3000);
    return () => clearInterval(interval);
  }, []);

  // Group screenshots by session and filter out sessions with no screenshots
  const groupedScreenshots = useMemo(() =>
    sessions.map(session => ({
      session,
      screenshots: screenshots.filter(s => s.sessionId === session.id)
    })).filter(group => group.screenshots.length > 0),
    [sessions, screenshots]
  );

  // Rotation timer for screenshot previews (every 2 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreenshotIndex(prevIndices => {
        const newIndices = { ...prevIndices };
        groupedScreenshots.forEach(({ session, screenshots: sessionScreenshots }) => {
          if (sessionScreenshots.length > 0) {
            const currentIndex = newIndices[session.id] || 0;
            newIndices[session.id] = (currentIndex + 1) % sessionScreenshots.length;
          }
        });
        return newIndices;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [groupedScreenshots]);

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

  const handleRefetch = () => {
    loadScreenshots();
  };

  // Transform data for TanStack Table
  const tableData: SessionRow[] = useMemo(() =>
    groupedScreenshots.map(({ session, screenshots: sessionScreenshots }) => {
      const currentIndex = currentScreenshotIndex[session.id] || 0;
      const currentScreenshot = sessionScreenshots[currentIndex] || null;

      return {
        session,
        screenshots: sessionScreenshots,
        currentScreenshot,
        isExpanded: expandedSessions.has(session.id),
      };
    }),
    [groupedScreenshots, currentScreenshotIndex, expandedSessions]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visibility</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleRefetch}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Sessions Table */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading sessions...</span>
            </div>
          </CardContent>
        </Card>
      ) : tableData.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <EyeIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No sessions found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Sessions will appear here when screenshots are captured
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTable columns={columns} data={tableData} onRowClick={toggleSession} />
      )}
    </div>
  );
}
