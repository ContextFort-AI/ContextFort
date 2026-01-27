'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  RefreshCwIcon,
  TrashIcon,
  CookieIcon,
  DatabaseIcon,
  EyeIcon,
  UserIcon,
  BotIcon,
  InfoIcon,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: string;
  expirationDate?: number;
}

interface SessionProfile {
  domain: string;
  capturedAt: string;
  cookies: Cookie[];
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
}

interface SessionProfiles {
  [domain: string]: {
    human?: SessionProfile;
    agent?: SessionProfile;
  };
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionProfiles>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionProfile | null>(null);
  const [selectedType, setSelectedType] = useState<'human' | 'agent'>('human');
  const [selectedDomain, setSelectedDomain] = useState<string>('');

  useEffect(() => {
    document.title = 'Sessions - ContextFort';
  }, []);

  const loadSessions = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({ type: 'VIEW_STORED_SESSIONS' }, (response: SessionProfiles) => {
          if (response) {
            setSessions(response);
          }
        });
      }
    } catch (error) {
      console.error('[Sessions Page] Error loading sessions:', error);
    }
    if (showLoading) setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSessions(true);
    // Refresh every 30 seconds
    const interval = setInterval(() => loadSessions(), 30000);
    return () => clearInterval(interval);
  }, [loadSessions]);

  const handleDeleteSession = async (domain: string, profileType: 'human' | 'agent') => {
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({
          type: 'DELETE_SESSION_PROFILE',
          domain,
          profileType,
        }, (response: { success: boolean }) => {
          if (response?.success) {
            setSessions(prev => {
              const updated = { ...prev };
              if (updated[domain]) {
                delete updated[domain][profileType];
                if (!updated[domain].human && !updated[domain].agent) {
                  delete updated[domain];
                }
              }
              return updated;
            });
          }
        });
      }
    } catch (error) {
      console.error('[Sessions Page] Error deleting session:', error);
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openCookieViewer = (domain: string, profileType: 'human' | 'agent', profile: SessionProfile) => {
    setSelectedDomain(domain);
    setSelectedType(profileType);
    setSelectedSession(profile);
  };

  const domains = Object.keys(sessions).sort();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Session Profiles</h1>
          <p className="text-muted-foreground">
            View and manage saved session data for human and agent modes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => loadSessions(true)}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-500">Session Isolation</p>
              <p className="text-muted-foreground mt-1">
                When an agent starts, your human session is saved and the agent gets its own isolated session.
                When the agent stops, your human session is restored. This prevents agents from accessing your personal accounts.
                Use Cmd+Shift+S to manually snapshot your current session before starting an agent.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DatabaseIcon className="h-5 w-5" />
            Saved Sessions
          </CardTitle>
          <CardDescription>
            {domains.length} {domains.length === 1 ? 'domain' : 'domains'} with saved sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading sessions...</span>
            </div>
          ) : domains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <DatabaseIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="mb-2 text-lg font-medium">No Saved Sessions</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Sessions will be automatically saved when you start an agent.
                You can also manually snapshot your current session with Cmd+Shift+S.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="w-[25%]">Domain</TableHead>
                    <TableHead className="w-[15%]">Type</TableHead>
                    <TableHead className="w-[15%]">Cookies</TableHead>
                    <TableHead className="w-[15%]">Storage</TableHead>
                    <TableHead className="w-[20%]">Captured At</TableHead>
                    <TableHead className="w-[10%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.flatMap((domain) => {
                    const domainSessions = sessions[domain];
                    const rows = [];

                    if (domainSessions.human) {
                      rows.push(
                        <TableRow key={`${domain}-human`} className="border-b border-border">
                          <TableCell>
                            <span className="font-medium">{domain}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              <UserIcon className="mr-1 h-3 w-3" />
                              Human
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CookieIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{domainSessions.human.cookies.length}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {Object.keys(domainSessions.human.localStorage).length + Object.keys(domainSessions.human.sessionStorage).length}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDateTime(domainSessions.human.capturedAt)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openCookieViewer(domain, 'human', domainSessions.human!)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <UserIcon className="h-5 w-5 text-green-500" />
                                      Human Session: {domain}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Captured at {formatDateTime(domainSessions.human!.capturedAt)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <CookieIcon className="h-4 w-4" />
                                        Cookies ({domainSessions.human!.cookies.length})
                                      </h4>
                                      <div className="space-y-2">
                                        {domainSessions.human!.cookies.map((cookie, i) => (
                                          <div key={i} className="p-3 bg-muted rounded-md text-sm">
                                            <div className="font-medium">{cookie.name}</div>
                                            <div className="text-xs text-muted-foreground break-all">{cookie.value.substring(0, 100)}{cookie.value.length > 100 ? '...' : ''}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                              {cookie.domain} • {cookie.path} • {cookie.secure ? 'Secure' : ''} {cookie.httpOnly ? 'HttpOnly' : ''}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">localStorage ({Object.keys(domainSessions.human!.localStorage).length})</h4>
                                      <div className="space-y-1">
                                        {Object.entries(domainSessions.human!.localStorage).map(([key, value]) => (
                                          <div key={key} className="p-2 bg-muted rounded-md text-sm">
                                            <div className="font-medium text-xs">{key}</div>
                                            <div className="text-xs text-muted-foreground break-all">{value.substring(0, 100)}{value.length > 100 ? '...' : ''}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteSession(domain, 'human')}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    if (domainSessions.agent) {
                      rows.push(
                        <TableRow key={`${domain}-agent`} className="border-b border-border">
                          <TableCell>
                            <span className="font-medium">{domain}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                              <BotIcon className="mr-1 h-3 w-3" />
                              Agent
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CookieIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{domainSessions.agent.cookies.length}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {Object.keys(domainSessions.agent.localStorage).length + Object.keys(domainSessions.agent.sessionStorage).length}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDateTime(domainSessions.agent.capturedAt)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openCookieViewer(domain, 'agent', domainSessions.agent!)}
                                  >
                                    <EyeIcon className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <BotIcon className="h-5 w-5 text-purple-500" />
                                      Agent Session: {domain}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Captured at {formatDateTime(domainSessions.agent!.capturedAt)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                                        <CookieIcon className="h-4 w-4" />
                                        Cookies ({domainSessions.agent!.cookies.length})
                                      </h4>
                                      <div className="space-y-2">
                                        {domainSessions.agent!.cookies.map((cookie, i) => (
                                          <div key={i} className="p-3 bg-muted rounded-md text-sm">
                                            <div className="font-medium">{cookie.name}</div>
                                            <div className="text-xs text-muted-foreground break-all">{cookie.value.substring(0, 100)}{cookie.value.length > 100 ? '...' : ''}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                              {cookie.domain} • {cookie.path} • {cookie.secure ? 'Secure' : ''} {cookie.httpOnly ? 'HttpOnly' : ''}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">localStorage ({Object.keys(domainSessions.agent!.localStorage).length})</h4>
                                      <div className="space-y-1">
                                        {Object.entries(domainSessions.agent!.localStorage).map(([key, value]) => (
                                          <div key={key} className="p-2 bg-muted rounded-md text-sm">
                                            <div className="font-medium text-xs">{key}</div>
                                            <div className="text-xs text-muted-foreground break-all">{value.substring(0, 100)}{value.length > 100 ? '...' : ''}</div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteSession(domain, 'agent')}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }

                    return rows;
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
