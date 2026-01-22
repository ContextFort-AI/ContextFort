'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RefreshCwIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  KeyIcon,
  ShieldCheckIcon,
  TimerIcon,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface CredentialGrant {
  id: string;
  domain: string;
  expiresAt: number;
  grantedAt: string;
  grantedBy: string;
  reason: string | null;
}

const DURATION_OPTIONS = [
  { value: '5', label: '5 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '120', label: '2 hours' },
  { value: '480', label: '8 hours' },
];

export default function CredentialsPage() {
  const [grants, setGrants] = useState<CredentialGrant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newDuration, setNewDuration] = useState('30');
  const [newReason, setNewReason] = useState('');
  const [isGranting, setIsGranting] = useState(false);

  useEffect(() => {
    document.title = 'Credentials - ContextFort';
  }, []);

  const loadGrants = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({ type: 'GET_CREDENTIAL_GRANTS' }, (response: { success: boolean; grants: CredentialGrant[] }) => {
          if (response?.success) {
            setGrants(response.grants || []);
          }
        });
      }
    } catch (error) {
      console.error('[Credentials Page] Error loading grants:', error);
    }
    if (showLoading) setIsLoading(false);
  }, []);

  useEffect(() => {
    loadGrants();
    // Refresh every 10 seconds to update time remaining
    const interval = setInterval(() => loadGrants(), 10000);
    return () => clearInterval(interval);
  }, [loadGrants]);

  const formatTimeRemaining = (expiresAt: number) => {
    const now = Date.now();
    const remaining = expiresAt - now;

    if (remaining <= 0) return 'Expired';

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
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

  const handleGrantAccess = async () => {
    if (!newDomain.trim()) return;

    setIsGranting(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({
          type: 'GRANT_CREDENTIAL_ACCESS',
          domain: newDomain.trim().toLowerCase(),
          durationMinutes: parseInt(newDuration, 10),
          grantedBy: 'user',
          reason: newReason.trim() || undefined,
        }, (response: { success: boolean; grant: CredentialGrant }) => {
          if (response?.success) {
            setGrants(prev => [...prev, response.grant]);
            setNewDomain('');
            setNewReason('');
          }
        });
      }
    } catch (error) {
      console.error('[Credentials Page] Error granting access:', error);
    }
    setIsGranting(false);
  };

  const handleRevokeAccess = async (grantId: string) => {
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({
          type: 'REVOKE_CREDENTIAL_ACCESS',
          grantId,
        }, (response: { success: boolean }) => {
          if (response?.success) {
            setGrants(prev => prev.filter(g => g.id !== grantId));
          }
        });
      }
    } catch (error) {
      console.error('[Credentials Page] Error revoking access:', error);
    }
  };

  const handleExtendGrant = async (grantId: string, additionalMinutes: number) => {
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage) {
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({
          type: 'EXTEND_CREDENTIAL_GRANT',
          grantId,
          additionalMinutes,
        }, (response: { success: boolean; grant: CredentialGrant }) => {
          if (response?.success && response.grant) {
            setGrants(prev => prev.map(g => g.id === grantId ? response.grant : g));
          }
        });
      }
    } catch (error) {
      console.error('[Credentials Page] Error extending grant:', error);
    }
  };

  const getTimeRemainingBadge = (expiresAt: number) => {
    const remaining = expiresAt - Date.now();
    const minutes = Math.floor(remaining / 60000);

    if (remaining <= 0) {
      return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Expired</Badge>;
    }
    if (minutes < 5) {
      return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">{formatTimeRemaining(expiresAt)}</Badge>;
    }
    return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{formatTimeRemaining(expiresAt)}</Badge>;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credential Grants</h1>
          <p className="text-muted-foreground">
            Grant time-limited write access to specific domains for agent operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => loadGrants(true)}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="h-5 w-5 text-blue-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-500">How Credential Grants Work</p>
              <p className="text-muted-foreground mt-1">
                By default, agent tabs cannot make POST/PUT/PATCH/DELETE requests to any domain (except Claude).
                Credential grants allow you to temporarily enable write access to specific domains for a limited time.
                When the grant expires, write access is automatically revoked.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grant New Access Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Grant New Access
          </CardTitle>
          <CardDescription>
            Allow agent to make write requests to a specific domain for a limited time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="e.g., github.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGrantAccess()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={newDuration} onValueChange={setNewDuration}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                placeholder="e.g., Deploy PR #123"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGrantAccess()}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGrantAccess}
                disabled={!newDomain.trim() || isGranting}
                className="w-full"
              >
                <KeyIcon className="mr-2 h-4 w-4" />
                Grant Access
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Grants Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TimerIcon className="h-5 w-5" />
            Active Grants
          </CardTitle>
          <CardDescription>
            {grants.length} active credential {grants.length === 1 ? 'grant' : 'grants'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading grants...</span>
            </div>
          ) : grants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <KeyIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="mb-2 text-lg font-medium">No Active Grants</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Grant access to specific domains above to allow agent write operations.
                All grants auto-expire for security.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border">
                    <TableHead className="w-[25%]">Domain</TableHead>
                    <TableHead className="w-[15%]">Time Remaining</TableHead>
                    <TableHead className="w-[20%]">Granted At</TableHead>
                    <TableHead className="w-[20%]">Reason</TableHead>
                    <TableHead className="w-[20%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grants.map((grant) => (
                    <TableRow key={grant.id} className="border-b border-border">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <KeyIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{grant.domain}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTimeRemainingBadge(grant.expiresAt)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(grant.grantedAt)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {grant.reason || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExtendGrant(grant.id, 15)}
                          >
                            <ClockIcon className="mr-1 h-3 w-3" />
                            +15m
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevokeAccess(grant.id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
