'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CameraIcon, ChevronLeftIcon, ChevronRightIcon, RefreshCwIcon, MousePointerIcon, FileTextIcon, Trash2Icon, BugIcon, ChevronDownIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

interface ClickedElement {
  tag: string;
  id: string;
  className: string;
  text: string;
  type: string | null;
}

interface PostRequest {
  url: string;
  hostname: string;
  method: string;
  matched_fields: string[];
  matched_values: Record<string, string>;
  status: string;
  is_bot: boolean;
  agent_mode_detected: boolean;
  timestamp: string;
}

interface Screenshot {
  id: number;
  tabId: number;
  url: string;
  title: string;
  reason: string;
  timestamp: string;
  dataUrl: string;
  clickedElement?: ClickedElement | null;
  clickCoordinates?: { x: number; y: number } | null;
  inputFields?: string[];
  inputValues?: Record<string, string>;
  postRequest?: PostRequest | null;
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

export default function ScreenshotsPage() {
  console.log('🚀 [Screenshots Page] Component loaded! Version: 4.0 - Back to basics');

  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  const [expandedSessions, setExpandedSessions] = useState<Set<number>>(new Set());
  const [showDebugPanel, setShowDebugPanel] = useState(true);
  const [rawSessionData, setRawSessionData] = useState<Session[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const itemsPerPage = 12;

  // Load screenshots and sessions from Chrome storage
  const loadScreenshots = async () => {
    console.log('📸 [Screenshots Page] loadScreenshots() called');
    setLoadAttempts(prev => prev + 1);
    setIsLoading(true);
    setLoadError(null);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['screenshots', 'sessions']);
        const screenshotsList = result.screenshots || [];
        const sessionsList = result.sessions || [];

        // Store raw session data for debug panel
        setRawSessionData(sessionsList);
        setLoadError(null); // Clear error on success

        // Deduplicate sessions by ID (keep the first occurrence)
        const uniqueSessions = sessionsList.reduce((acc: Session[], session: Session) => {
          if (!acc.find(s => s.id === session.id)) {
            acc.push(session);
          }
          return acc;
        }, []);

        console.log('[Screenshots Page] Total sessions in storage:', sessionsList.length);
        console.log('[Screenshots Page] Unique sessions after dedup:', uniqueSessions.length);
        console.log('[Screenshots Page] Session IDs:', uniqueSessions.map((s: Session) => s.id));
        console.log('[Screenshots Page] Total screenshots:', screenshotsList.length);
        console.log('[Screenshots Page] Screenshot sessionIds:', screenshotsList.map((s: Screenshot) => s.sessionId));

        // Reverse to show newest first
        setScreenshots([...screenshotsList].reverse());
        setSessions(uniqueSessions); // Use deduplicated sessions

        // Auto-expand the first (most recent) session
        if (uniqueSessions.length > 0) {
          setExpandedSessions(new Set([uniqueSessions[0].id]));
        }
      } else {
        setLoadError('Chrome storage API not available');
      }
    } catch (error) {
      console.error('Error loading screenshots:', error);
      setLoadError(error instanceof Error ? error.message : 'Unknown error');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    console.log('⚡ [Screenshots Page] useEffect running - loading data');
    loadScreenshots();
    // Refresh every 3 seconds
    const interval = setInterval(loadScreenshots, 3000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const totalScreenshots = screenshots.length;
  const suspiciousClickCount = screenshots.filter(s => s.reason === 'suspicious_click').length;
  const withPostRequestCount = screenshots.filter(s => s.postRequest !== null && s.postRequest !== undefined).length;
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => s.status === 'active').length;

  // Group screenshots by session
  const groupedScreenshots = sessions.map(session => ({
    session,
    screenshots: screenshots.filter(s => s.sessionId === session.id)
  }));

  console.log('[Screenshots Page] Grouped screenshots:', groupedScreenshots.map(g => ({
    sessionId: g.session.id,
    screenshotCount: g.screenshots.length,
    screenshotIds: g.screenshots.map(s => s.id)
  })));

  // Screenshots without session (old screenshots or non-agent mode)
  const orphanedScreenshots = screenshots.filter(s => !s.sessionId);
  console.log('[Screenshots Page] Orphaned screenshots (no sessionId):', orphanedScreenshots.length);

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
    setCurrentPage(1);
    loadScreenshots();
  };

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all sessions and screenshots?')) {
      try {
        // @ts-ignore - Chrome extension API
        if (typeof chrome !== 'undefined' && chrome?.storage) {
          // @ts-ignore - Chrome extension API
          await chrome.storage.local.set({
            screenshots: [],
            sessions: []
          });
          setScreenshots([]);
          setSessions([]);
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Error clearing screenshots and sessions:', error);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getSessionDuration = (session: Session) => {
    if (session.duration) {
      return formatDuration(session.duration);
    }
    if (session.status === 'active') {
      const start = new Date(session.startTime);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
      return formatDuration(seconds) + ' (active)';
    }
    return 'Unknown';
  };

  const getReasonBadge = (reason: string) => {
    if (reason === 'suspicious_click') {
      return { color: 'bg-red-500/10 text-red-500 border-red-500/30', icon: <MousePointerIcon className="h-3 w-3" />, label: 'Suspicious Click' };
    } else if (reason.includes('dom_change')) {
      return { color: 'bg-purple-500/10 text-purple-500 border-purple-500/30', icon: <FileTextIcon className="h-3 w-3" />, label: 'DOM Change' };
    } else if (reason.includes('scroll')) {
      return { color: 'bg-blue-500/10 text-blue-500 border-blue-500/30', icon: <MousePointerIcon className="h-3 w-3" />, label: 'Scroll' };
    }
    return { color: 'bg-gray-500/10 text-gray-500 border-gray-500/30', icon: <CameraIcon className="h-3 w-3" />, label: 'Other' };
  };

  const openFullSize = (screenshot: Screenshot) => {
    setSelectedScreenshot(screenshot);
  };

  const closeFullSize = () => {
    setSelectedScreenshot(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Screenshots</h1>
          <p className="text-muted-foreground">
            Screenshots grouped by agent mode sessions (debugger attached → detached), showing suspicious clicks and POST API calls
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showDebugPanel ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDebugPanel(!showDebugPanel)}
          >
            <BugIcon className="mr-2 h-4 w-4" />
            Debug Panel
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefetch}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearAll} disabled={screenshots.length === 0 && sessions.length === 0}>
            <Trash2Icon className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebugPanel && (
        <Card className="bg-yellow-500/5 border-yellow-500/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BugIcon className="h-5 w-5 text-yellow-600" />
              Debug Panel - Session Storage Analysis v4.0
            </CardTitle>
            <CardDescription>
              Real-time view of session storage data |
              Chrome API: {typeof window !== 'undefined' && (window as any).chrome?.storage ? 'Available ✓' : 'Not Available'} |
              Loading: {isLoading ? 'Yes' : 'No'} |
              Load attempts: {loadAttempts}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Display */}
            {loadError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                <h4 className="font-semibold text-red-600 text-sm mb-2">❌ Load Error:</h4>
                <p className="text-sm text-red-700">{loadError}</p>
              </div>
            )}
            {/* Storage Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background p-3 rounded border">
                <div className="text-2xl font-bold text-red-600">{rawSessionData.length}</div>
                <div className="text-xs text-muted-foreground">Sessions in Storage (RAW)</div>
              </div>
              <div className="bg-background p-3 rounded border">
                <div className="text-2xl font-bold text-green-600">{sessions.length}</div>
                <div className="text-xs text-muted-foreground">Unique Sessions (Deduplicated)</div>
              </div>
              <div className="bg-background p-3 rounded border">
                <div className="text-2xl font-bold text-orange-600">{rawSessionData.length - sessions.length}</div>
                <div className="text-xs text-muted-foreground">Duplicate Sessions Found</div>
              </div>
              <div className="bg-background p-3 rounded border">
                <div className="text-2xl font-bold text-blue-600">{screenshots.length}</div>
                <div className="text-xs text-muted-foreground">Total Screenshots</div>
              </div>
            </div>

            {/* Session Details Table */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">All Sessions in Storage (Raw Data):</h4>
              <div className="bg-background rounded border overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left">#</th>
                      <th className="px-3 py-2 text-left">Session ID</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Tab ID</th>
                      <th className="px-3 py-2 text-left">Start Time</th>
                      <th className="px-3 py-2 text-left">Screenshots</th>
                      <th className="px-3 py-2 text-left">Duplicate?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rawSessionData.map((session, index) => {
                      const isDuplicate = rawSessionData.filter(s => s.id === session.id).length > 1;
                      const screenshotsInSession = screenshots.filter(s => s.sessionId === session.id).length;
                      return (
                        <tr key={`${session.id}-${index}`} className={isDuplicate ? 'bg-red-500/10' : ''}>
                          <td className="px-3 py-2 border-t">{index + 1}</td>
                          <td className="px-3 py-2 border-t font-mono">{session.id}</td>
                          <td className="px-3 py-2 border-t">
                            <Badge className={session.status === 'active' ? 'bg-orange-500 text-xs' : 'bg-green-500 text-xs'}>
                              {session.status}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 border-t">{session.tabId}</td>
                          <td className="px-3 py-2 border-t">{formatTime(session.startTime)}</td>
                          <td className="px-3 py-2 border-t">{screenshotsInSession}</td>
                          <td className="px-3 py-2 border-t">
                            {isDuplicate ? (
                              <Badge variant="destructive" className="text-xs">YES ⚠️</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">No</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Duplicate Session IDs */}
            {(() => {
              const duplicateIds = rawSessionData
                .filter((session, index, self) =>
                  self.filter(s => s.id === session.id).length > 1
                )
                .map(s => s.id)
                .filter((id, index, self) => self.indexOf(id) === index);

              if (duplicateIds.length > 0) {
                return (
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                    <h4 className="font-semibold text-red-600 text-sm mb-2">⚠️ Duplicate Session IDs Detected:</h4>
                    <div className="flex flex-wrap gap-2">
                      {duplicateIds.map(id => (
                        <Badge key={id} variant="destructive">
                          {id} (appears {rawSessionData.filter(s => s.id === id).length}x)
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div className="bg-green-500/10 border border-green-500/30 rounded p-3">
                  <h4 className="font-semibold text-green-600 text-sm">✅ No duplicate session IDs found!</h4>
                </div>
              );
            })()}

            {/* Raw Session Data JSON */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Raw Session Data (JSON):</h4>
              <div className="bg-background rounded border p-3 overflow-x-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {rawSessionData.length === 0
                    ? 'No raw session data'
                    : JSON.stringify(rawSessionData, null, 2)}
                </pre>
              </div>
            </div>

            {/* Screenshot Session IDs */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">Screenshots by Session:</h4>
              <div className="bg-background rounded border p-3">
                {sessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No sessions found (after deduplication)</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map(session => {
                      const sessionScreenshots = screenshots.filter(s => s.sessionId === session.id);
                      return (
                        <div key={session.id} className="flex items-center justify-between text-xs">
                          <span className="font-mono">Session #{session.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {sessionScreenshots.length} screenshot{sessionScreenshots.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Total Sessions"
          value={totalSessions}
          icon={<CameraIcon className="h-4 w-4" />}
          description="Agent mode sessions"
        />
        <StatCard
          title="Active Sessions"
          value={activeSessions}
          variant={activeSessions > 0 ? "error" : "default"}
          icon={<MousePointerIcon className="h-4 w-4" />}
          description="Currently running"
        />
        <StatCard
          title="Total Screenshots"
          value={totalScreenshots}
          icon={<CameraIcon className="h-4 w-4" />}
          description="All captured"
        />
        <StatCard
          title="With POST Requests"
          value={withPostRequestCount}
          icon={<FileTextIcon className="h-4 w-4" />}
          description="API calls detected"
        />
      </div>

      {/* Sessions Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading sessions...</span>
            </div>
          </CardContent>
        </Card>
      ) : sessions.length === 0 && screenshots.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <CameraIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No sessions yet</h3>
              <p className="text-sm text-muted-foreground">
                Sessions will appear here when agent mode (debugger) is attached
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Render each session */}
          {groupedScreenshots.map(({ session, screenshots: sessionScreenshots }) => (
            <Card key={session.id} className={session.status === 'active' ? 'border-orange-500/50' : ''}>
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleSession(session.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${session.status === 'active' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`} />
                    <div>
                      <CardTitle className="text-lg">
                        Session #{session.id}
                        {session.status === 'active' && <Badge className="ml-2 bg-orange-500">Active</Badge>}
                      </CardTitle>
                      <CardDescription>
                        {session.tabTitle || 'Unknown Page'} • {getSessionDuration(session)} • {sessionScreenshots.length} screenshots
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {formatDate(session.startTime)} {formatTime(session.startTime)}
                    </Badge>
                    <ChevronRightIcon
                      className={`h-5 w-5 transition-transform ${expandedSessions.has(session.id) ? 'rotate-90' : ''}`}
                    />
                  </div>
                </div>
              </CardHeader>
              {expandedSessions.has(session.id) && (
                <CardContent>
                  {sessionScreenshots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <CameraIcon className="mb-2 h-8 w-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">No screenshots captured in this session</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sessionScreenshots.map((screenshot) => {
                        const reasonBadge = getReasonBadge(screenshot.reason);
                        const isSuspicious = screenshot.reason === 'suspicious_click';
                        return (
                          <div
                            key={screenshot.id}
                            className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${isSuspicious ? 'border-red-500/50 bg-red-500/5' : ''}`}
                            onClick={() => openFullSize(screenshot)}
                          >
                            <div className="relative w-full h-48 bg-muted">
                              <img
                                src={screenshot.dataUrl}
                                alt={`Screenshot ${screenshot.id}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className={`text-xs gap-1 ${reasonBadge.color}`}>
                                  {reasonBadge.icon}
                                  {reasonBadge.label}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  #{screenshot.id}
                                </span>
                              </div>
                              <div className="text-xs font-medium truncate mb-1" title={screenshot.title}>
                                {screenshot.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate mb-2" title={screenshot.url}>
                                {new URL(screenshot.url).hostname}
                              </div>

                              {/* Show clicked element info for suspicious clicks */}
                              {screenshot.clickedElement && (
                                <div className="mb-2 p-2 bg-orange-500/10 rounded text-xs border border-orange-500/30">
                                  <div className="font-semibold text-orange-600 mb-1">🖱️ Clicked Element:</div>
                                  <div className="text-orange-700">
                                    &lt;{screenshot.clickedElement.tag.toLowerCase()}&gt; {screenshot.clickedElement.text.substring(0, 30)}
                                    {screenshot.clickedElement.text.length > 30 ? '...' : ''}
                                  </div>
                                </div>
                              )}

                              {/* Show POST request info if available */}
                              {screenshot.postRequest && (
                                <div className="mb-2 p-2 bg-blue-500/10 rounded text-xs border border-blue-500/30">
                                  <div className="font-semibold text-blue-600 mb-1">📡 POST Request:</div>
                                  <div className="text-blue-700 truncate" title={screenshot.postRequest.url}>
                                    {screenshot.postRequest.method} → {screenshot.postRequest.hostname}
                                  </div>
                                  {screenshot.postRequest.matched_fields.length > 0 && (
                                    <div className="text-blue-600 mt-1">
                                      Fields: {screenshot.postRequest.matched_fields.join(', ')}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{formatDate(screenshot.timestamp)}</span>
                                <span className="font-mono">{formatTime(screenshot.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Full Size Screenshot Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={closeFullSize}
        >
          <div className="max-w-6xl w-full max-h-[90vh] overflow-auto bg-background rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Screenshot #{selectedScreenshot.id}</h3>
                <p className="text-sm text-muted-foreground">{selectedScreenshot.title}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeFullSize}>
                Close
              </Button>
            </div>
            <div className="p-4">
              <img
                src={selectedScreenshot.dataUrl}
                alt={`Screenshot ${selectedScreenshot.id}`}
                className="w-full h-auto rounded-md"
              />
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">URL:</span>
                  <span className="text-muted-foreground break-all">{selectedScreenshot.url}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Reason:</span>
                  <span className="text-muted-foreground">{selectedScreenshot.reason}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Time:</span>
                  <span className="text-muted-foreground">
                    {formatDate(selectedScreenshot.timestamp)} {formatTime(selectedScreenshot.timestamp)}
                  </span>
                </div>

                {/* Clicked Element Details */}
                {selectedScreenshot.clickedElement && (
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-orange-600 mb-2">🖱️ Clicked Element</h4>
                    <div className="space-y-1 bg-orange-500/5 p-3 rounded border border-orange-500/20">
                      <div className="flex gap-2">
                        <span className="font-medium">Tag:</span>
                        <span className="text-muted-foreground">&lt;{selectedScreenshot.clickedElement.tag.toLowerCase()}&gt;</span>
                      </div>
                      {selectedScreenshot.clickedElement.id && (
                        <div className="flex gap-2">
                          <span className="font-medium">ID:</span>
                          <span className="text-muted-foreground">{selectedScreenshot.clickedElement.id}</span>
                        </div>
                      )}
                      {selectedScreenshot.clickedElement.className && (
                        <div className="flex gap-2">
                          <span className="font-medium">Class:</span>
                          <span className="text-muted-foreground">{selectedScreenshot.clickedElement.className}</span>
                        </div>
                      )}
                      {selectedScreenshot.clickedElement.text && (
                        <div className="flex gap-2">
                          <span className="font-medium">Text:</span>
                          <span className="text-muted-foreground break-words">{selectedScreenshot.clickedElement.text}</span>
                        </div>
                      )}
                      {selectedScreenshot.clickCoordinates && (
                        <div className="flex gap-2">
                          <span className="font-medium">Coordinates:</span>
                          <span className="text-muted-foreground">
                            x: {selectedScreenshot.clickCoordinates.x}, y: {selectedScreenshot.clickCoordinates.y}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* POST Request Details */}
                {selectedScreenshot.postRequest && (
                  <div className="border-t pt-3 mt-3">
                    <h4 className="font-semibold text-blue-600 mb-2">📡 POST Request</h4>
                    <div className="space-y-2 bg-blue-500/5 p-3 rounded border border-blue-500/20">
                      <div className="flex gap-2">
                        <span className="font-medium">Method:</span>
                        <span className="text-muted-foreground">{selectedScreenshot.postRequest.method}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium">Hostname:</span>
                        <span className="text-muted-foreground">{selectedScreenshot.postRequest.hostname}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium">URL:</span>
                        <span className="text-muted-foreground break-all text-xs">{selectedScreenshot.postRequest.url}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-medium">Status:</span>
                        <Badge className={selectedScreenshot.postRequest.status === 'blocked' ? 'bg-red-500' : 'bg-green-500'}>
                          {selectedScreenshot.postRequest.status.toUpperCase()}
                        </Badge>
                      </div>
                      {selectedScreenshot.postRequest.matched_fields.length > 0 && (
                        <div>
                          <div className="font-medium mb-1">Matched Fields:</div>
                          <div className="flex flex-wrap gap-1">
                            {selectedScreenshot.postRequest.matched_fields.map((field, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                          <div className="mt-2 space-y-1 text-xs">
                            {Object.entries(selectedScreenshot.postRequest.matched_values).map(([key, value]) => (
                              <div key={key} className="bg-muted p-2 rounded">
                                <span className="font-mono font-semibold">{key}:</span>{' '}
                                <span className="text-muted-foreground">{value.substring(0, 50)}{value.length > 50 ? '...' : ''}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
