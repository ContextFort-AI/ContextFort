'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  LinkIcon,
  RefreshCwIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  ShieldBanIcon
} from 'lucide-react';
import { useState, useEffect, Fragment } from 'react';

interface Screenshot {
  id: number;
  tabId: number;
  url: string;
  title: string;
  reason: string;
  timestamp: string;
  dataUrl: string;
  eventType?: string;
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

interface TransitionData {
  fromUrl: string;
  toUrl: string;
  fromHostname: string;
  toHostname: string;
  transitionCount: number;
  sessions: Map<number, {
    sessionId: number;
    sessionTitle: string;
    sessionStatus: 'active' | 'ended';
    sessionStartTime: string;
    transitionCount: number;
    firstTransition: string;
    lastTransition: string;
  }>;
}

export default function ControlsPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTransitions, setExpandedTransitions] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<'page-mixing' | 'action-block'>('page-mixing');

  useEffect(() => {
    document.title = 'Controls - ContextFort';
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['screenshots', 'sessions']);
        const screenshotsList = result.screenshots || [];
        const sessionsList = result.sessions || [];

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
      console.error('[Controls Page] Error loading data:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

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

  // Group screenshots by session
  const sessionScreenshots = new Map<number, Screenshot[]>();
  screenshots.forEach(screenshot => {
    const sessionId = screenshot.sessionId;
    if (!sessionId) return;
    if (!sessionScreenshots.has(sessionId)) {
      sessionScreenshots.set(sessionId, []);
    }
    sessionScreenshots.get(sessionId)!.push(screenshot);
  });

  // Create URL transitions
  const transitionMap = new Map<string, TransitionData>();

  sessionScreenshots.forEach((sessionShots, sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const sortedShots = sessionShots.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    for (let i = 0; i < sortedShots.length - 1; i++) {
      const fromUrl = sortedShots[i].url;
      const toUrl = sortedShots[i + 1].url;
      if (fromUrl === toUrl) continue;

      const transitionKey = `${fromUrl}|||${toUrl}`;

      try {
        const fromHostname = new URL(fromUrl).hostname;
        const toHostname = new URL(toUrl).hostname;

        if (!transitionMap.has(transitionKey)) {
          transitionMap.set(transitionKey, {
            fromUrl,
            toUrl,
            fromHostname,
            toHostname,
            transitionCount: 0,
            sessions: new Map()
          });
        }
        const transitionData = transitionMap.get(transitionKey)!;

        if (!transitionData.sessions.has(sessionId)) {
          transitionData.sessions.set(sessionId, {
            sessionId,
            sessionTitle: session.tabTitle || 'Unknown Page',
            sessionStatus: session.status,
            sessionStartTime: session.startTime,
            transitionCount: 0,
            firstTransition: sortedShots[i].timestamp,
            lastTransition: sortedShots[i + 1].timestamp
          });
        }
        const sessionData = transitionData.sessions.get(sessionId)!;

        transitionData.transitionCount++;
        sessionData.transitionCount++;
        sessionData.lastTransition = sortedShots[i + 1].timestamp;
      } catch (error) {
        console.error('[URL Logs] Error processing transition:', error);
      }
    }
  });

  const sortedTransitions = Array.from(transitionMap.values()).sort((a, b) => b.transitionCount - a.transitionCount);

  const toggleTransition = (key: string) => {
    const newExpanded = new Set(expandedTransitions);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedTransitions(newExpanded);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controls</h1>
          <p className="text-muted-foreground">
            Track URL navigation patterns and agent actions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Sub-sidebar and content */}
      <div className="flex gap-6">
        {/* Sub-sidebar */}
        <div className="w-[220px] flex-shrink-0">
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-col gap-1">
                <Button
                  variant={activeView === 'page-mixing' ? 'secondary' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveView('page-mixing')}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Page Mixing
                </Button>
                <Button
                  variant={activeView === 'action-block' ? 'secondary' : 'ghost'}
                  className="justify-start"
                  onClick={() => setActiveView('action-block')}
                >
                  <ShieldBanIcon className="mr-2 h-4 w-4" />
                  Action Block
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {activeView === 'page-mixing' && (
            <>
              {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading URL logs...</span>
            </div>
          </CardContent>
        </Card>
      ) : sortedTransitions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <LinkIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No URL transitions yet</h3>
              <p className="text-sm text-muted-foreground">
                Navigation patterns will appear when multiple URLs are visited in a session
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="w-[18%]">From URL</TableHead>
                <TableHead className="w-[18%]">To URL</TableHead>
                <TableHead className="w-[13%]">Navigation Type</TableHead>
                <TableHead className="w-[38%]">Sessions</TableHead>
                <TableHead className="w-[13%] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTransitions.map((transition, index) => {
                const isCrossDomain = transition.fromHostname !== transition.toHostname;
                const transitionKey = `${transition.fromUrl}|||${transition.toUrl}`;
                const isExpanded = expandedTransitions.has(transitionKey);

                const toUrlScreenshots = screenshots
                  .filter(s => s.url === transition.toUrl && s.sessionId)
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                const sessionsArray = Array.from(transition.sessions.values()).sort((a, b) =>
                  new Date(b.sessionStartTime).getTime() - new Date(a.sessionStartTime).getTime()
                );
                const latestSession = sessionsArray[0];

                return (
                  <Fragment key={transitionKey}>
                    <TableRow className="border-b border-border">
                      <TableCell>
                        <span className="text-sm font-medium" title={transition.fromUrl}>
                          {transition.fromHostname}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium" title={transition.toUrl}>
                          {transition.toHostname}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={isCrossDomain ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-background'}>
                          {isCrossDomain ? 'Cross-domain' : 'Same-domain'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 p-2 border border-border rounded-md">
                          <ClockIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm">
                              Session | Started: {formatDateTime(latestSession.sessionStartTime)}
                              {latestSession.sessionStatus === 'active' && (
                                <span className="ml-2 text-xs">(Active)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleTransition(transitionKey)}
                          disabled={toUrlScreenshots.length === 0}
                        >
                          {isExpanded ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {isExpanded && toUrlScreenshots.length > 0 && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-6">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-b border-border">
                                  <TableHead className="w-[35%]">Screenshot</TableHead>
                                  <TableHead className="w-[15%]">Event</TableHead>
                                  <TableHead className="w-[30%]">URL</TableHead>
                                  <TableHead className="w-[20%]">Session</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {toUrlScreenshots.map((screenshot, idx) => {
                                  const screenshotSession = sessions.find(s => s.id === screenshot.sessionId);
                                  return (
                                    <TableRow key={screenshot.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                                      <TableCell>
                                        {screenshot.dataUrl ? (
                                          <img
                                            src={screenshot.dataUrl}
                                            alt="Screenshot"
                                            className="w-[350px] h-auto rounded-md border border-border cursor-pointer hover:scale-[1.02] transition-transform"
                                            onClick={() => window.open(screenshot.dataUrl, '_blank')}
                                          />
                                        ) : (
                                          <div className="w-[350px] h-[200px] flex flex-col items-center justify-center bg-muted border-2 border-dashed border-muted-foreground/50 rounded-md">
                                            <span className="text-4xl mb-2">📄</span>
                                            <span className="text-sm font-semibold text-muted-foreground">Page Read</span>
                                            <span className="text-xs text-muted-foreground/60 mt-1">No screenshot</span>
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <span className="text-base font-semibold">{screenshot.eventType || 'N/A'}</span>
                                      </TableCell>
                                      <TableCell className="break-words">
                                        <a
                                          href={screenshot.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-500 hover:underline"
                                        >
                                          {screenshot.url}
                                        </a>
                                      </TableCell>
                                      <TableCell className="break-words">
                                        <span className="text-sm">
                                          {screenshotSession
                                            ? `Session | Started: ${formatDateTime(screenshotSession.startTime)}`
                                            : 'N/A'}
                                        </span>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
            </>
          )}

          {activeView === 'action-block' && (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center">
                  <RefreshCwIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-medium">Action Block</h3>
                  <p className="text-sm text-muted-foreground">
                    Coming soon: Block specific agent actions
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
