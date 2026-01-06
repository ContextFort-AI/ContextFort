'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  RefreshCwIcon,
  HistoryIcon,
  LinkIcon,
  MessageSquareIcon,
  ExternalLinkIcon,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

interface RuleInstance {
  id: number;
  ruleId: string;
  ruleName: string;
  timestamp: string;
  details: string;
  blockedUrl?: string;
  sessionId?: number;
  tabId?: number;
}

const RULE_METADATA: Record<string, { name: string; icon: React.ComponentType<{ className?: string }> }> = {
  disallow_query_params: {
    name: 'Disallow URLs with Query Parameters',
    icon: LinkIcon,
  },
  disallow_clickable_urls: {
    name: 'Disallow Printing Clickable URLs',
    icon: MessageSquareIcon,
  },
};

export default function GovernanceInstancesPage() {
  const [instances, setInstances] = useState<RuleInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRules, setSelectedRules] = useState<Set<string>>(new Set(['disallow_query_params', 'disallow_clickable_urls']));

  useEffect(() => {
    document.title = 'Rules Applied Instances - ContextFort';
  }, []);

  const loadInstances = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['governanceInstances']);
        const instancesList = result.governanceInstances || [];

        // Sort by timestamp (most recent first)
        const sortedInstances = instancesList.sort((a: RuleInstance, b: RuleInstance) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setInstances(sortedInstances);
      }
    } catch (error) {
      console.error('[Governance Instances] Error loading instances:', error);
    }
    if (showLoading) setIsLoading(false);
  };

  useEffect(() => {
    loadInstances();
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

  const toggleRuleFilter = (ruleId: string) => {
    const newSelected = new Set(selectedRules);
    if (newSelected.has(ruleId)) {
      newSelected.delete(ruleId);
    } else {
      newSelected.add(ruleId);
    }
    setSelectedRules(newSelected);
  };

  const selectAllRules = () => {
    setSelectedRules(new Set(Object.keys(RULE_METADATA)));
  };

  const clearAllRules = () => {
    setSelectedRules(new Set());
  };

  const filteredInstances = useMemo(() => {
    if (selectedRules.size === 0) return [];
    return instances.filter(instance => selectedRules.has(instance.ruleId));
  }, [instances, selectedRules]);

  const getRuleIcon = (ruleId: string) => {
    const Icon = RULE_METADATA[ruleId]?.icon || HistoryIcon;
    return Icon;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rules Applied Instances</h1>
          <p className="text-muted-foreground">
            View when governance rules were enforced
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => loadInstances(true)}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card>
        <CardContent className="py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Filter by Rule</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllRules}
                  className="h-7 text-xs"
                >
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllRules}
                  className="h-7 text-xs"
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(RULE_METADATA).map(([ruleId, metadata]) => {
                const isSelected = selectedRules.has(ruleId);
                const Icon = metadata.icon;
                const ruleInstances = instances.filter(i => i.ruleId === ruleId);

                return (
                  <Button
                    key={ruleId}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleRuleFilter(ruleId)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {metadata.name}
                    <Badge
                      variant="outline"
                      className={
                        isSelected
                          ? "bg-background/20 text-background border-background/30"
                          : "bg-muted text-foreground border-border"
                      }
                    >
                      {ruleInstances.length}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instances Table */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading instances...</span>
            </div>
          </CardContent>
        </Card>
      ) : filteredInstances.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <HistoryIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No rule enforcement instances</h3>
              <p className="text-sm text-muted-foreground">
                {selectedRules.size === 0
                  ? 'Select rules above to view their enforcement history'
                  : 'Rule enforcement instances will appear here when governance rules are triggered'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="w-[5%]"></TableHead>
                <TableHead className="w-[20%]">Timestamp</TableHead>
                <TableHead className="w-[25%]">Rule</TableHead>
                <TableHead className="w-[40%]">Details</TableHead>
                <TableHead className="w-[10%] text-center">Session</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstances.map((instance) => {
                const Icon = getRuleIcon(instance.ruleId);

                return (
                  <TableRow key={instance.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDateTime(instance.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{instance.ruleName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">
                        {instance.details}
                      </div>
                      {instance.blockedUrl && (
                        <div className="text-xs text-muted-foreground truncate mt-1">
                          {instance.blockedUrl}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {instance.sessionId ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => {
                            window.location.href = `/dashboard/visibility?session=${instance.sessionId}`;
                          }}
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Summary */}
      {filteredInstances.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {filteredInstances.length} instance{filteredInstances.length !== 1 ? 's' : ''} across {selectedRules.size} rule{selectedRules.size !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
