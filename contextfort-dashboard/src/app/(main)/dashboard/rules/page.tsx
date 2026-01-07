'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  RefreshCwIcon
} from 'lucide-react';
import { useState, useEffect, Fragment } from 'react';

interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const GOVERNANCE_RULES: Omit<GovernanceRule, 'enabled'>[] = [
  {
    id: 'disallow_query_params',
    name: 'Disallow URLs with Query Parameters',
    description: 'Prevents the agent from opening any URLs that contain query parameters (e.g., ?param=value). This protects against potential data leakage through URL parameters and ensures agents only visit clean, parameterless URLs.',
  },
  {
    id: 'disallow_clickable_urls',
    name: 'Disallow Printing Clickable URLs in Sidechat',
    description: 'Prevents the agent from printing any clickable URLs in the Claude sidechat interface. This ensures that sensitive or internal URLs cannot be accidentally exposed or shared through the chat interface.',
  },
];

export default function GovernanceRulesPage() {
  const [rules, setRules] = useState<GovernanceRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Governance Rules - ContextFort';
  }, []);

  const loadRules = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['governanceRules']);
        const storedRules = result.governanceRules || {};

        // Merge default rules with stored enabled states
        const mergedRules = GOVERNANCE_RULES.map(rule => ({
          ...rule,
          enabled: storedRules[rule.id] ?? false, // Default to false if not set
        }));

        setRules(mergedRules);
      } else {
        // Fallback for non-extension environment
        const mergedRules = GOVERNANCE_RULES.map(rule => ({
          ...rule,
          enabled: false,
        }));
        setRules(mergedRules);
      }
    } catch (error) {
      console.error('[Governance Rules] Error loading rules:', error);
    }
    if (showLoading) setIsLoading(false);
  };

  useEffect(() => {
    loadRules();
  }, []);

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    // Update local state
    setRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled } : rule
      )
    );

    // Save to storage
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['governanceRules']);
        const storedRules = result.governanceRules || {};

        storedRules[ruleId] = enabled;

        // @ts-ignore - Chrome extension API
        await chrome.storage.local.set({ governanceRules: storedRules });

        // Notify background.js to reload governance rules and update DNR
        // @ts-ignore - Chrome extension API
        chrome.runtime.sendMessage({
          type: 'RELOAD_GOVERNANCE_RULES',
          rules: storedRules
        });
      }
    } catch (error) {
      console.error('[Governance Rules] Error saving rule state:', error);
    }
  };


  const enabledCount = rules.filter(r => r.enabled).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Governance Rules</h1>
          <p className="text-muted-foreground">
            Configure governance policies to control agent behavior
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => loadRules(true)}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <div className="text-2xl font-bold">{enabledCount} / {rules.length}</div>
                <div className="text-sm text-muted-foreground">Rules Enabled</div>
              </div>
            </div>
            <Badge variant="outline" className="bg-muted text-foreground border-border">
              {rules.length} Total Rules
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Rules Table */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading rules...</span>
            </div>
          </CardContent>
        </Card>
      ) : rules.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <h3 className="mb-2 text-lg font-medium">No rules configured</h3>
              <p className="text-sm text-muted-foreground">
                Governance rules will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border border-border overflow-auto max-h-[calc(100vh-20rem)]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead>Rule Name</TableHead>
                <TableHead className="w-32 text-center">Status</TableHead>
                <TableHead className="w-32 text-center">Enabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                  <Fragment key={rule.id}>
                    <TableRow className="border-b border-border">
                      <TableCell>
                        <div className="flex flex-col gap-2 max-w-full">
                          <div className="font-medium">{rule.name}</div>
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-normal break-words">
                            {rule.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={
                            rule.enabled
                              ? 'bg-green-500/10 text-green-500 border-green-500/20'
                              : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                          }
                        >
                          {rule.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
