'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RefreshCwIcon,
  ChevronDownIcon,
  ChevronRightIcon
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
  visitedUrls?: string[];
}

interface DomainData {
  domain: string;
  sessionCount: number;
  lastSession: Session;
  sessions: Session[];
}

type BlockMode = 'none' | 'visiting' | 'leaving' | 'both';

export default function DomainsPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({});
  const [urlBlockingRules, setUrlBlockingRules] = useState<string[][]>([]);

  useEffect(() => {
    document.title = 'Domains - ContextFort';
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
      console.error('[Domains Page] Error loading data:', error);
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

  // Group sessions by domain
  const domainMap = new Map<string, DomainData>();

  sessions.forEach(session => {
    try {
      const url = new URL(session.tabUrl);
      const domain = url.hostname;

      if (!domainMap.has(domain)) {
        domainMap.set(domain, {
          domain,
          sessionCount: 0,
          lastSession: session,
          sessions: []
        });
      }

      const domainData = domainMap.get(domain)!;
      domainData.sessions.push(session);
      domainData.sessionCount++;

      // Update last session if this one is more recent
      if (new Date(session.startTime) > new Date(domainData.lastSession.startTime)) {
        domainData.lastSession = session;
      }
    } catch (error) {
      console.error('[Domains] Error processing session:', error);
    }
  });

  // Sort domains by last session time (most recent first)
  const sortedDomains = Array.from(domainMap.values()).sort((a, b) =>
    new Date(b.lastSession.startTime).getTime() - new Date(a.lastSession.startTime).getTime()
  );

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

  const toggleDomain = (domain: string) => {
    const newExpanded = new Set(expandedDomains);
    if (newExpanded.has(domain)) {
      newExpanded.delete(domain);
    } else {
      newExpanded.add(domain);
    }
    setExpandedDomains(newExpanded);
  };

  // Get current block mode for a domain
  const getBlockMode = (domain: string): BlockMode => {
    const hasVisitingRule = urlBlockingRules.some(([from, to]) => from === '' && to === domain);
    const hasLeavingRule = urlBlockingRules.some(([from, to]) => from === domain && to === '');

    if (hasVisitingRule && hasLeavingRule) return 'both';
    if (hasVisitingRule) return 'visiting';
    if (hasLeavingRule) return 'leaving';
    return 'none';
  };

  // Update block mode for a domain
  const handleBlockModeChange = async (domain: string, mode: BlockMode) => {
    let newRules = [...urlBlockingRules];

    // Remove existing rules for this domain
    newRules = newRules.filter(([from, to]) =>
      !(from === '' && to === domain) &&  // Remove visiting rule
      !(from === domain && to === '')     // Remove leaving rule
    );

    // Add new rules based on mode
    if (mode === 'visiting') {
      newRules.push(['', domain]);
    } else if (mode === 'leaving') {
      newRules.push([domain, '']);
    } else if (mode === 'both') {
      newRules.push(['', domain]);
      newRules.push([domain, '']);
    }
    // mode === 'none': no rules added

    setUrlBlockingRules(newRules);

    // @ts-ignore - Chrome extension API
    if (typeof chrome !== 'undefined' && chrome?.storage) {
      // @ts-ignore - Chrome extension API
      await chrome.storage.local.set({ urlBlockingRules: newRules });

      // Notify background.js to reload the rules
      // @ts-ignore - Chrome extension API
      chrome.runtime.sendMessage({
        type: 'RELOAD_BLOCKING_RULES',
        rules: newRules
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Domains</h1>
          <p className="text-muted-foreground">
            View all domains visited during agent sessions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => loadData(true)}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading domains...</span>
            </div>
          </CardContent>
        </Card>
      ) : sortedDomains.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <h3 className="mb-2 text-lg font-medium">No domains visited yet</h3>
              <p className="text-sm text-muted-foreground">
                Domains will appear when agent sessions are recorded
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="w-[30%]">Domain</TableHead>
                <TableHead className="w-[15%] text-center">Sessions</TableHead>
                <TableHead className="w-[25%]">Last Session</TableHead>
                <TableHead className="w-[25%]">Block</TableHead>
                <TableHead className="w-[5%] text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDomains.map((domainData) => {
                const isExpanded = expandedDomains.has(domainData.domain);

                // Sort sessions within domain by start time (most recent first)
                const sortedSessions = domainData.sessions.sort((a, b) =>
                  new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
                );

                return (
                  <Fragment key={domainData.domain}>
                    <TableRow
                      className="border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => toggleDomain(domainData.domain)}
                    >
                      <TableCell>
                        <span className="font-medium">{domainData.domain}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-muted text-foreground border-border">
                          {domainData.sessionCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDateTime(domainData.lastSession.startTime)}
                        </div>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={getBlockMode(domainData.domain)}
                          onValueChange={(value: BlockMode) => handleBlockModeChange(domainData.domain, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                                  ALLOWED
                                </Badge>
                                <span className="text-xs text-muted-foreground">No blocking</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="visiting">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">
                                  BLOCK VISIT
                                </Badge>
                                <span className="text-xs text-muted-foreground">Can't go TO</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="leaving">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                                  BLOCK EXIT
                                </Badge>
                                <span className="text-xs text-muted-foreground">Can't leave FROM</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="both">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-xs">
                                  BLOCK BOTH
                                </Badge>
                                <span className="text-xs text-muted-foreground">Fully blocked</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleDomain(domainData.domain)}
                        >
                          {isExpanded ? (
                            <ChevronDownIcon className="h-4 w-4" />
                          ) : (
                            <ChevronRightIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={4} className="p-0">
                          <div className="p-6 space-y-4">
                            <h4 className="text-sm font-medium">Sessions ({sortedSessions.length})</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {sortedSessions.map((session) => {
                                const sessionScreenshots = screenshots
                                  .filter(s => s.sessionId === session.id)
                                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                                const previewScreenshot = sessionScreenshots[0];

                                return (
                                  <div
                                    key={session.id}
                                    className="bg-card rounded-lg border border-border overflow-hidden flex flex-col"
                                  >
                                    <div className="relative w-full h-[180px] bg-muted">
                                      {previewScreenshot?.dataUrl ? (
                                        <img
                                          src={previewScreenshot.dataUrl}
                                          alt={`Session ${session.id}`}
                                          className="w-full h-full object-cover"
                                          onLoad={(e) => handleImageLoad(previewScreenshot.id, e)}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                          <span className="text-4xl mb-2">📄</span>
                                          <span className="text-sm font-semibold text-muted-foreground">No Screenshots</span>
                                        </div>
                                      )}
                                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                        {sessionScreenshots.length} shots
                                      </div>
                                      <div className="absolute top-2 left-2">
                                        <Badge
                                          variant="outline"
                                          className={
                                            session.status === 'active'
                                              ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                              : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                          }
                                        >
                                          {session.status}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                      <div className="text-xs text-muted-foreground mb-1">
                                        {formatDateTime(session.startTime)}
                                      </div>
                                      <div className="text-xs font-medium text-foreground truncate mb-1" title={session.tabTitle}>
                                        {session.tabTitle}
                                      </div>
                                      <div className="text-xs text-muted-foreground truncate mb-2" title={session.tabUrl}>
                                        {session.tabUrl}
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-auto h-7 text-xs"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          window.location.href = `/dashboard/visibility?session=${session.id}`;
                                        }}
                                      >
                                        View Session
                                      </Button>
                                    </div>
                                  </div>
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
