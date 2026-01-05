'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  LinkIcon,
  RefreshCwIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  ExternalLinkIcon
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
  hasInteraction: boolean; // true if destination page had click/inputtext
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

export default function PageMixingPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTransitions, setExpandedTransitions] = useState<Set<string>>(new Set());
  const [domainFilter, setDomainFilter] = useState<'cross-domain' | 'same-domain'>('cross-domain');
  const [interactionFilter, setInteractionFilter] = useState<'all' | 'with-interaction' | 'page-read-only'>('all');
  const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({});
  const [urlBlockingRules, setUrlBlockingRules] = useState<string[][]>([]);

  useEffect(() => {
    document.title = 'Page Mixing - ContextFort';
  }, []);

  const loadData = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['screenshots', 'sessions', 'urlBlockingRules']);
        const screenshotsList = result.screenshots || [];
        const sessionsList = result.sessions || [];
        const rules = result.urlBlockingRules || [];

        const uniqueSessions = sessionsList.reduce((acc: Session[], session: Session) => {
          if (!acc.find(s => s.id === session.id)) {
            acc.push(session);
          }
          return acc;
        }, []);

        setScreenshots(screenshotsList);
        setSessions(uniqueSessions);
        setUrlBlockingRules(rules);
      }
    } catch (error) {
      console.error('[Controls Page] Error loading data:', error);
    }
    if (showLoading) setIsLoading(false);
  };

  useEffect(() => {
    loadData();
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
      const fromShot = sortedShots[i];
      const toShot = sortedShots[i + 1];

      // Skip if URL and title are both the same
      if (fromShot.url === toShot.url && fromShot.title === toShot.title) continue;

      const transitionKey = `${fromShot.url}|||${toShot.url}`;

      try {
        const fromHostname = new URL(fromShot.url).hostname;
        const toHostname = new URL(toShot.url).hostname;

        // Check if destination page has any interaction events (click/input)
        const toUrlScreenshots = sortedShots.filter(s => s.url === toShot.url);
        const hasInteraction = toUrlScreenshots.some(s =>
          s.eventType === 'click' || s.eventType === 'input'
        );

        if (!transitionMap.has(transitionKey)) {
          transitionMap.set(transitionKey, {
            fromUrl: fromShot.url,
            toUrl: toShot.url,
            fromHostname,
            toHostname,
            transitionCount: 0,
            hasInteraction,
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

  // Filter by domain type first (for calculating interaction counts)
  const domainFilteredTransitions = sortedTransitions.filter((transition) => {
    const isCrossDomain = transition.fromHostname !== transition.toHostname;
    if (domainFilter === 'cross-domain') return isCrossDomain;
    if (domainFilter === 'same-domain') return !isCrossDomain;
    return true;
  });

  // Then filter by both domain and interaction type
  const filteredTransitions = domainFilteredTransitions.filter((transition) => {
    // Interaction filter
    if (interactionFilter === 'with-interaction' && !transition.hasInteraction) return false;
    if (interactionFilter === 'page-read-only' && transition.hasInteraction) return false;

    return true;
  });

  const handleImageLoad = (screenshotId: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions(prev => ({
      ...prev,
      [screenshotId]: {
        width: img.naturalWidth,
        height: img.naturalHeight
      }
    }));
  };

  const toggleTransition = (key: string) => {
    const newExpanded = new Set(expandedTransitions);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedTransitions(newExpanded);
  };

  // Check if a transition is blocked
  const isTransitionBlocked = (fromHostname: string, toHostname: string): boolean => {
    return urlBlockingRules.some(([domain1, domain2]) => {
      const match1 = fromHostname === domain1 && toHostname === domain2;
      const match2 = fromHostname === domain2 && toHostname === domain1;
      return match1 || match2;
    });
  };

  // Toggle blocking for a transition
  const handleToggleBlock = async (fromHostname: string, toHostname: string) => {
    const isBlocked = isTransitionBlocked(fromHostname, toHostname);
    let newRules: string[][];

    if (isBlocked) {
      // Remove the rule
      newRules = urlBlockingRules.filter(([domain1, domain2]) => {
        const match1 = fromHostname === domain1 && toHostname === domain2;
        const match2 = fromHostname === domain2 && toHostname === domain1;
        return !(match1 || match2);
      });
    } else {
      // Add the rule
      newRules = [...urlBlockingRules, [fromHostname, toHostname]];
    }

    setUrlBlockingRules(newRules);

    // @ts-ignore - Chrome extension API
    if (typeof chrome !== 'undefined' && chrome?.storage) {
      // @ts-ignore - Chrome extension API
      await chrome.storage.local.set({ urlBlockingRules: newRules });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Page Mixing</h1>
          <p className="text-muted-foreground">
            Track URL navigation patterns and transitions across sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => loadData(true)}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Domain:</span>
          <Button
            variant={domainFilter === 'cross-domain' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDomainFilter('cross-domain')}
          >
            Cross Domain ({sortedTransitions.filter(t => t.fromHostname !== t.toHostname).length})
          </Button>
          <Button
            variant={domainFilter === 'same-domain' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDomainFilter('same-domain')}
          >
            Same Domain ({sortedTransitions.filter(t => t.fromHostname === t.toHostname).length})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Interaction:</span>
          <Button
            variant={interactionFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInteractionFilter('all')}
          >
            All ({domainFilteredTransitions.length})
          </Button>
          <Button
            variant={interactionFilter === 'with-interaction' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInteractionFilter('with-interaction')}
          >
            With Interaction ({domainFilteredTransitions.filter(t => t.hasInteraction).length})
          </Button>
          <Button
            variant={interactionFilter === 'page-read-only' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setInteractionFilter('page-read-only')}
          >
            Page Read Only ({domainFilteredTransitions.filter(t => !t.hasInteraction).length})
          </Button>
        </div>
      </div>

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
      ) : filteredTransitions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <LinkIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No transitions match the current filters</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting the domain or interaction filters
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="w-[20%]">Domain</TableHead>
                <TableHead className="w-[25%]">From</TableHead>
                <TableHead className="w-[25%]">To</TableHead>
                <TableHead className="w-[10%] text-center">Count</TableHead>
                <TableHead className="w-[15%] text-center">Block</TableHead>
                <TableHead className="w-[5%] text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransitions.map((transition, index) => {
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
                    <TableRow
                      className="border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleTransition(transitionKey)}
                    >
                      <TableCell>
                        <Badge variant="outline" className={isCrossDomain ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}>
                          {isCrossDomain ? transition.fromHostname + ' → ' + transition.toHostname : transition.fromHostname}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm truncate" title={transition.fromUrl}>
                          {transition.fromUrl}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm truncate" title={transition.toUrl}>
                          {transition.toUrl}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-muted text-foreground border-border">
                          {transition.transitionCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center gap-2">
                          <Switch
                            checked={isTransitionBlocked(transition.fromHostname, transition.toHostname)}
                            onCheckedChange={() => handleToggleBlock(transition.fromHostname, transition.toHostname)}
                          />
                          <Badge
                            variant="outline"
                            className={isTransitionBlocked(transition.fromHostname, transition.toHostname)
                              ? 'bg-red-500/10 text-red-500 border-red-500/20 text-xs'
                              : 'bg-green-500/10 text-green-500 border-green-500/20 text-xs'
                            }
                          >
                            {isTransitionBlocked(transition.fromHostname, transition.toHostname) ? 'BLOCKED' : 'ACTIVE'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
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
                          <div className="p-6 space-y-4">
                            <h4 className="text-sm font-medium">Screenshots ({toUrlScreenshots.length})</h4>
                            <div className="flex flex-wrap gap-4">
                              {toUrlScreenshots.map((screenshot, idx) => {
                                const screenshotSession = sessions.find(s => s.id === screenshot.sessionId);
                                return (
                                  <Dialog key={screenshot.id}>
                                    <DialogTrigger asChild>
                                      <div className="w-[350px] bg-card rounded-lg border border-border overflow-hidden flex flex-col cursor-pointer hover:border-muted-foreground transition-colors">
                                        <div className="relative w-full h-[200px] bg-muted">
                                          {screenshot.dataUrl ? (
                                            <img
                                              src={screenshot.dataUrl}
                                              alt={`Screenshot ${screenshot.id}`}
                                              className="w-full h-full object-cover"
                                              onLoad={(e) => handleImageLoad(screenshot.id, e)}
                                            />
                                          ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                              <span className="text-4xl mb-2">📄</span>
                                              <span className="text-sm font-semibold text-muted-foreground">Page Read</span>
                                            </div>
                                          )}
                                          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                            {screenshot.eventType || 'Navigation'}
                                          </div>
                                        </div>
                                        <div className="p-3 flex-1 flex flex-col">
                                          <div className="text-xs text-muted-foreground mb-1">
                                            {formatDateTime(screenshot.timestamp)}
                                          </div>
                                          <div className="text-xs font-medium text-foreground truncate mb-1" title={screenshot.title}>
                                            {screenshot.title}
                                          </div>
                                          <div className="text-xs text-muted-foreground truncate mb-2" title={screenshot.url}>
                                            {screenshot.url}
                                          </div>
                                          {screenshot.sessionId && (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="mt-auto h-7 text-xs"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/dashboard/visibility?session=${screenshot.sessionId}`;
                                              }}
                                            >
                                              <ExternalLinkIcon className="mr-1 h-3 w-3" />
                                              View Session
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-[90vw] max-h-[90vh] p-4">
                                      <div className="relative">
                                        {screenshot.dataUrl ? (
                                          <img
                                            src={screenshot.dataUrl}
                                            alt={`Screenshot ${screenshot.id}`}
                                            className="w-full h-full object-contain"
                                            onLoad={(e) => handleImageLoad(screenshot.id, e)}
                                          />
                                        ) : (
                                          <div className="w-full h-[400px] flex flex-col items-center justify-center bg-muted">
                                            <span className="text-6xl mb-4">📄</span>
                                            <span className="text-lg font-semibold text-muted-foreground">Page Read Event</span>
                                            <span className="text-sm text-muted-foreground/60 mt-2">No screenshot available</span>
                                          </div>
                                        )}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                );
                              })}
                            </div>
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
    </div>
  );
}
