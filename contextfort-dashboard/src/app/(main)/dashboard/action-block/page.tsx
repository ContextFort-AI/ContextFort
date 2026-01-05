'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
  ShieldBanIcon,
  RefreshCwIcon,
  MousePointerIcon,
  MousePointerClickIcon,
  MenuIcon,
  KeyboardIcon,
  EditIcon,
  ArrowUpDownIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronRightIcon,
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
  eventDetails?: {
    element: {
      tag: string;
      id: string | null;
      className: string | null;
      text: string | null;
      type: string | null;
      name: string | null;
    } | null;
    coordinates: { x: number; y: number } | null;
    inputValue: string | null;
    actionType: string;
    actionId?: number;  // Links result to action (stored in eventDetails)
  } | null;
  sessionId?: number | null;
}

interface GroupedAction {
  actionType: string;
  url: string;
  title: string;
  elementTag?: string | null;
  elementId?: string | null;
  elementClass?: string | null;
  elementText?: string | null;
  elementType?: string | null;
  elementName?: string | null;
  inputValue?: string | null;
  coordinates?: string | null;
  count: number;
  sessionIds: Set<number>;
  screenshots: Screenshot[];
}

interface BlockedAction {
  id: string;
  actionType: string;
  url: string;
  title: string;
  elementTag?: string | null;
  elementId?: string | null;
  elementClass?: string | null;
  elementText?: string | null;
  elementType?: string | null;
  elementName?: string | null;
  inputValue?: string | null;
  coordinatesX?: number | null;
  coordinatesY?: number | null;
  blocked: boolean;
  createdAt: string;
}

export default function ActionBlockPage() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  const [blockedActions, setBlockedActions] = useState<BlockedAction[]>([]);
  const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({});
  const [filter, setFilter] = useState<'all' | 'blocked' | 'unblocked'>('all');

  useEffect(() => {
    document.title = 'Action Block - ContextFort';
    loadData();
    loadBlockedActions();
  }, []);

  const loadData = async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['screenshots']);
        const screenshotsList = result.screenshots || [];
        setScreenshots(screenshotsList);
      }
    } catch (error) {
      console.error('Error loading screenshots:', error);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  const loadBlockedActions = async () => {
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['blockedActions']);
        const blocked = result.blockedActions || [];
        setBlockedActions(blocked);
      }
    } catch (error) {
      console.error('Error loading blocked actions:', error);
    }
  };

  // Generate unique ID for action based on its signature
  const generateActionId = (action: GroupedAction): string => {
    const parts = [
      action.actionType,
      action.url,
      action.title,
      action.elementTag || '',
      action.elementId || '',
      action.elementClass || '',
      action.elementText || '',
      action.elementType || '',  // CRITICAL: type field
      action.elementName || '',  // CRITICAL: name field
      action.inputValue || '',
      action.coordinates || ''
    ];
    // Simple hash function for unique ID
    const signature = parts.join('|||');
    let hash = 0;
    for (let i = 0; i < signature.length; i++) {
      const char = signature.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `action_${Math.abs(hash).toString(36)}`;
  };

  const isActionBlocked = (action: GroupedAction): boolean => {
    const id = generateActionId(action);
    return blockedActions.some(ba => ba.id === id && ba.blocked);
  };

  const toggleBlockAction = async (action: GroupedAction, blocked: boolean) => {
    const id = generateActionId(action);

    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        let updatedBlockedActions = [...blockedActions];

        if (blocked) {
          // Add to blocked list
          const coords = action.coordinates ? action.coordinates.match(/\((\d+), (\d+)\)/) : null;
          const newBlockedAction: BlockedAction = {
            id,
            actionType: action.actionType,
            url: action.url,
            title: action.title,
            elementTag: action.elementTag,
            elementId: action.elementId,
            elementClass: action.elementClass,
            elementText: action.elementText,
            elementType: action.elementType,      // CRITICAL: type field
            elementName: action.elementName,      // CRITICAL: name field
            inputValue: action.inputValue,
            coordinatesX: coords ? parseInt(coords[1], 10) : null,
            coordinatesY: coords ? parseInt(coords[2], 10) : null,
            blocked: true,
            createdAt: new Date().toISOString()
          };
          updatedBlockedActions.push(newBlockedAction);
        } else {
          // Remove from blocked list
          updatedBlockedActions = updatedBlockedActions.filter(ba => ba.id !== id);
        }

        // @ts-ignore - Chrome extension API
        await chrome.storage.local.set({ blockedActions: updatedBlockedActions });
        setBlockedActions(updatedBlockedActions);
      }
    } catch (error) {
      console.error('Error toggling block action:', error);
    }
  };

  const getActionIcon = (actionType: string) => {
    if (actionType === 'click') return <MousePointerIcon className="h-4 w-4" />;
    if (actionType === 'dblclick') return <MousePointerClickIcon className="h-4 w-4" />;
    if (actionType === 'rightclick') return <MenuIcon className="h-4 w-4" />;
    if (actionType === 'input') return <KeyboardIcon className="h-4 w-4" />;
    if (actionType === 'change') return <EditIcon className="h-4 w-4" />;
    if (actionType === 'scroll') return <ArrowUpDownIcon className="h-4 w-4" />;
    if (actionType === 'page_read') return <BookOpenIcon className="h-4 w-4" />;
    return <ShieldBanIcon className="h-4 w-4" />;
  };

  const getActionLabel = (actionType: string) => {
    if (actionType === 'click') return 'Click';
    if (actionType === 'dblclick') return 'Double Click';
    if (actionType === 'rightclick') return 'Right Click';
    if (actionType === 'input') return 'Text Input';
    if (actionType === 'change') return 'Value Changed';
    if (actionType === 'scroll') return 'Scroll';
    if (actionType === 'page_read') return 'Page Read';
    return actionType;
  };

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

  // Group actions by actionType + URL + Title + specifics
  // Two-pass algorithm: First group base actions, then attach results
  const groupedActions: GroupedAction[] = [];
  const actionMap = new Map<string, GroupedAction>();
  const screenshotToGroup = new Map<number, string>(); // Maps screenshot.id -> groupKey

  // PASS 1: Group base actions (skip results)
  screenshots.forEach((screenshot) => {
    const actionType = screenshot.eventDetails?.actionType || screenshot.reason;

    // Skip result actions, scroll, and page_read
    if (actionType.endsWith('_result') || actionType === 'scroll' || actionType === 'page_read') {
      return;
    }

    const element = screenshot.eventDetails?.element;
    const coordinates = screenshot.eventDetails?.coordinates;
    const inputValue = screenshot.eventDetails?.inputValue;

    // Create unique key based on action type and specifics
    let keyParts = [
      actionType,
      screenshot.url,
      screenshot.title,
    ];

    // Add element details for clicks
    if (element && (actionType === 'click' || actionType === 'dblclick' || actionType === 'rightclick')) {
      keyParts.push(element.tag || '');
      keyParts.push(element.id || '');
      keyParts.push(element.className || '');
      keyParts.push(element.text || '');
    }

    // Add element details for inputs (CRITICAL: includes type and name)
    if (element && (actionType === 'input' || actionType === 'change')) {
      keyParts.push(element.tag || '');
      keyParts.push(element.id || '');
      keyParts.push(element.type || '');  // CRITICAL: type field
      keyParts.push(element.name || '');  // CRITICAL: name field
      keyParts.push(inputValue || '');
    }

    // Add coordinates for precise click matching
    if (coordinates) {
      keyParts.push(`${coordinates.x},${coordinates.y}`);
    }

    const key = keyParts.join('|||');

    if (!actionMap.has(key)) {
      actionMap.set(key, {
        actionType,
        url: screenshot.url,
        title: screenshot.title,
        elementTag: element?.tag,
        elementId: element?.id,
        elementClass: element?.className,
        elementText: element?.text,
        elementType: element?.type,      // CRITICAL: type field
        elementName: element?.name,      // CRITICAL: name field
        inputValue: inputValue,
        coordinates: coordinates ? `(${coordinates.x}, ${coordinates.y})` : null,
        count: 0,
        sessionIds: new Set(),
        screenshots: [],
      });
    }

    const group = actionMap.get(key)!;
    group.count++;
    if (screenshot.sessionId) {
      group.sessionIds.add(screenshot.sessionId);
    }
    group.screenshots.push(screenshot);

    // Track which group this action screenshot belongs to
    screenshotToGroup.set(screenshot.id, key);
  });

  // PASS 2: Attach result screenshots to their parent actions
  screenshots.forEach((screenshot) => {
    const actionType = screenshot.eventDetails?.actionType || screenshot.reason;

    // Only process result actions
    if (!actionType.endsWith('_result')) {
      return;
    }

    const actionId = screenshot.eventDetails?.actionId;
    if (!actionId) {
      return; // No linking, skip
    }

    // Find which group the original action belongs to
    const groupKey = screenshotToGroup.get(actionId);
    if (!groupKey) {
      return; // Action not found, skip
    }

    // Add result screenshot to the SAME group as the action
    const group = actionMap.get(groupKey);
    if (group) {
      group.screenshots.push(screenshot);
      // Don't increment count - result is part of same action, not separate
    }
  });

  // Convert map to array and sort by count (most frequent first)
  const sortedActions = Array.from(actionMap.values()).sort((a, b) => b.count - a.count);

  // Filter actions based on blocked status
  const filteredActions = sortedActions.filter((action) => {
    if (filter === 'all') return true;
    if (filter === 'blocked') return isActionBlocked(action);
    if (filter === 'unblocked') return !isActionBlocked(action);
    return true;
  });

  // Auto-expand first action on load
  useEffect(() => {
    if (filteredActions.length > 0 && expandedActions.size === 0) {
      const firstActionKey = getActionKey(filteredActions[0]);
      setExpandedActions(new Set([firstActionKey]));
    }
  }, [filteredActions.length]);

  const toggleAction = (key: string) => {
    const newExpanded = new Set(expandedActions);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedActions(newExpanded);
  };

  const getActionKey = (action: GroupedAction) => {
    return `${action.actionType}|||${action.url}|||${action.title}|||${action.elementTag || ''}|||${action.elementId || ''}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Action Block</h1>
          <p className="text-muted-foreground">
            Review and block specific agent actions across sessions
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
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({sortedActions.length})
        </Button>
        <Button
          variant={filter === 'blocked' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('blocked')}
        >
          Blocked ({sortedActions.filter(a => isActionBlocked(a)).length})
        </Button>
        <Button
          variant={filter === 'unblocked' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unblocked')}
        >
          Unblocked ({sortedActions.filter(a => !isActionBlocked(a)).length})
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex items-center justify-center">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading actions...</span>
            </div>
          </CardContent>
        </Card>
      ) : sortedActions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <ShieldBanIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No actions recorded yet</h3>
              <p className="text-sm text-muted-foreground">
                Agent actions will appear here once captured
              </p>
            </div>
          </CardContent>
        </Card>
      ) : filteredActions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center">
              <ShieldBanIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No {filter} actions</h3>
              <p className="text-sm text-muted-foreground">
                Try changing the filter to see more actions
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="w-[15%]">Action Type</TableHead>
                <TableHead className="w-[25%]">Page</TableHead>
                <TableHead className="w-[35%]">Action Details</TableHead>
                <TableHead className="w-[8%] text-center">Count</TableHead>
                <TableHead className="w-[8%] text-center">Sessions</TableHead>
                <TableHead className="w-[9%] text-center">Block</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActions.map((action) => {
                const actionKey = getActionKey(action);
                const isExpanded = expandedActions.has(actionKey);

                // Find result screenshot to display result page info - search globally
                const firstActionShot = action.screenshots.find(s => {
                  const actionType = s.eventDetails?.actionType || s.reason;
                  return !actionType.endsWith('_result');
                });

                const resultScreenshot = firstActionShot
                  ? screenshots.find(s => s.eventDetails?.actionId === firstActionShot.id)
                  : action.screenshots.find(s => {
                      const actionType = s.eventDetails?.actionType || s.reason;
                      return actionType.endsWith('_result');
                    });

                return (
                  <Fragment key={actionKey}>
                    <TableRow
                      className={`border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${isActionBlocked(action) ? 'bg-red-500/5' : ''}`}
                      onClick={() => toggleAction(actionKey)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={isActionBlocked(action) ? 'text-red-500' : 'text-muted-foreground'}>
                            {getActionIcon(action.actionType)}
                          </span>
                          <span className="text-sm text-foreground">
                            {getActionLabel(action.actionType)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[250px]">
                          <div className="truncate text-sm font-medium text-foreground">
                            {action.title}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {action.url}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground space-y-1">
                          {action.elementTag && (
                            <div className="truncate">
                              <span className="text-muted-foreground">Element: </span>
                              {action.elementTag}
                              {action.elementId && ` #${action.elementId}`}
                              {action.elementClass && ` .${action.elementClass.split(' ')[0]}`}
                              {action.elementText && ` "${action.elementText.substring(0, 30)}..."`}
                            </div>
                          )}
                          {action.inputValue && (
                            <div className="truncate">
                              <span className="text-muted-foreground">Input: </span>
                              "{action.inputValue}"
                            </div>
                          )}
                          {action.coordinates && (
                            <div className="text-xs text-muted-foreground">
                              Position: {action.coordinates}
                            </div>
                          )}
                          {resultScreenshot && (resultScreenshot.url !== action.url || resultScreenshot.title !== action.title) && (
                            <div className="mt-2 pt-2 border-t border-border">
                              <div className="text-xs text-muted-foreground mb-1">Result Page:</div>
                              <div className="truncate text-xs font-medium text-foreground">
                                {resultScreenshot.title}
                              </div>
                              <div className="truncate text-xs text-muted-foreground">
                                {resultScreenshot.url}
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-muted text-foreground border-border">
                          {action.count}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="bg-muted text-foreground border-border">
                          {action.sessionIds.size}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Switch
                            checked={isActionBlocked(action)}
                            onCheckedChange={(checked) => toggleBlockAction(action, checked)}
                          />
                          <Badge
                            variant={isActionBlocked(action) ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {isActionBlocked(action) ? "BLOCKED" : "ACTIVE"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>

                    {/* Expanded row showing screenshots */}
                    {isExpanded && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={6}>
                          <div className="p-4">
                            <h4 className="text-sm font-medium mb-3">Screenshots ({action.screenshots.length})</h4>
                            <div className="space-y-4">
                              {(() => {
                                // Pair action screenshots with their results
                                const pairs: Array<{ action: Screenshot; result?: Screenshot }> = [];
                                const processedIds = new Set<number>();

                                action.screenshots.forEach((screenshot) => {
                                  if (processedIds.has(screenshot.id)) return;

                                  const actionType = screenshot.eventDetails?.actionType || screenshot.reason;

                                  // If this is a result, skip (will be paired with action)
                                  if (actionType.endsWith('_result')) {
                                    return;
                                  }

                                  // Find corresponding result - search GLOBALLY in all screenshots
                                  let result = screenshots.find(s => s.eventDetails?.actionId === screenshot.id);

                                  // Fallback: Find by timestamp (result comes right after action) if actionId linking failed
                                  if (!result) {
                                    const globalIndex = screenshots.findIndex(s => s.id === screenshot.id);
                                    if (globalIndex >= 0 && globalIndex < screenshots.length - 1) {
                                      const nextShot = screenshots[globalIndex + 1];
                                      const nextActionType = nextShot.eventDetails?.actionType || nextShot.reason;
                                      // Check if next screenshot is a result for this action type
                                      if (nextActionType === `${actionType}_result`) {
                                        result = nextShot;
                                      }
                                    }
                                  }

                                  pairs.push({ action: screenshot, result });
                                  processedIds.add(screenshot.id);
                                  if (result) processedIds.add(result.id);
                                });

                                return pairs.map(({ action: actionShot, result }, pairIndex) => {
                                  const actionType = actionShot.eventDetails?.actionType || actionShot.reason;

                                  // Get display screenshot for action (use previous if null)
                                  const getActionDisplayScreenshot = () => {
                                    if (actionType === 'click' && !actionShot.dataUrl) {
                                      // Look backwards in GLOBAL screenshots array for previous one with dataUrl
                                      const globalIndex = screenshots.findIndex(s => s.id === actionShot.id);
                                      if (globalIndex > 0) {
                                        for (let i = globalIndex - 1; i >= 0; i--) {
                                          if (screenshots[i].dataUrl) {
                                            return screenshots[i].dataUrl;
                                          }
                                        }
                                      }
                                    }
                                    return actionShot.dataUrl;
                                  };

                                  const actionDisplayUrl = getActionDisplayScreenshot();

                                  const coordinates = actionShot.eventDetails?.coordinates;

                                  return (
                                    <div key={actionShot.id} className="flex items-center gap-4">
                                      {/* Action Card */}
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <div className="w-[400px] bg-card rounded-lg border border-border overflow-hidden flex flex-col cursor-pointer hover:border-muted-foreground transition-colors">
                                            <div className="relative w-full h-[180px] bg-muted">
                                              {actionDisplayUrl && (
                                                <img
                                                  src={actionDisplayUrl}
                                                  alt={`Action ${actionShot.id}`}
                                                  className="w-full h-full object-cover"
                                                  onLoad={(e) => handleImageLoad(actionShot.id, e)}
                                                />
                                              )}
                                              {/* Red box overlay for click coordinates - only show for action, not result */}
                                              {coordinates && imageDimensions[actionShot.id] && !actionType.includes('_result') && (
                                                <div
                                                  className="absolute border-2 border-red-500 bg-red-500/20"
                                                  style={{
                                                    left: `${(coordinates.x / imageDimensions[actionShot.id].width) * 100}%`,
                                                    top: `${(coordinates.y / imageDimensions[actionShot.id].height) * 100}%`,
                                                    width: '20px',
                                                    height: '20px',
                                                    transform: 'translate(-50%, -50%)'
                                                  }}
                                                />
                                              )}
                                              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                Action
                                              </div>
                                            </div>
                                            <div className="p-2 flex-1 flex flex-col">
                                              <div className="text-xs text-muted-foreground">
                                                {new Date(actionShot.timestamp).toLocaleString()}
                                              </div>
                                              <div className="text-xs text-foreground mb-2">
                                                Session: {actionShot.sessionId || 'N/A'}
                                              </div>
                                              {actionShot.sessionId && (
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  className="mt-auto h-7 text-xs"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.location.href = `/dashboard/visibility?session=${actionShot.sessionId}`;
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
                                            <img
                                              src={actionDisplayUrl}
                                              alt={`Action ${actionShot.id}`}
                                              className="w-full h-full object-contain"
                                              onLoad={(e) => handleImageLoad(actionShot.id, e)}
                                            />
                                            {/* Red box overlay for full-size view */}
                                            {coordinates && imageDimensions[actionShot.id] && !actionType.includes('_result') && (
                                              <div
                                                className="absolute border-4 border-red-500 bg-red-500/30"
                                                style={{
                                                  left: `${(coordinates.x / imageDimensions[actionShot.id].width) * 100}%`,
                                                  top: `${(coordinates.y / imageDimensions[actionShot.id].height) * 100}%`,
                                                  width: '40px',
                                                  height: '40px',
                                                  transform: 'translate(-50%, -50%)'
                                                }}
                                              />
                                            )}
                                          </div>
                                        </DialogContent>
                                      </Dialog>

                                      {/* Arrow */}
                                      {result && (
                                        <div className="text-2xl text-muted-foreground">→</div>
                                      )}

                                      {/* Result Card */}
                                      {result && (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <div className="w-[400px] bg-card rounded-lg border border-border overflow-hidden flex flex-col cursor-pointer hover:border-muted-foreground transition-colors">
                                              <div className="relative w-full h-[180px] bg-muted">
                                                {result.dataUrl && (
                                                  <img
                                                    src={result.dataUrl}
                                                    alt={`Result ${result.id}`}
                                                    className="w-full h-full object-cover"
                                                    onLoad={(e) => handleImageLoad(result.id, e)}
                                                  />
                                                )}
                                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                  Result
                                                </div>
                                              </div>
                                              <div className="p-2 flex-1 flex flex-col">
                                                <div className="text-xs text-muted-foreground">
                                                  {new Date(result.timestamp).toLocaleString()}
                                                </div>
                                                <div className="text-xs text-foreground mb-2">
                                                  Session: {result.sessionId || 'N/A'}
                                                </div>
                                                {result.sessionId && (
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-auto h-7 text-xs"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      window.location.href = `/dashboard/visibility?session=${result.sessionId}`;
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
                                              {result.dataUrl && (
                                                <img
                                                  src={result.dataUrl}
                                                  alt={`Result ${result.id}`}
                                                  className="w-full h-full object-contain"
                                                  onLoad={(e) => handleImageLoad(result.id, e)}
                                                />
                                              )}
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      )}
                                    </div>
                                  );
                                });
                              })()}
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
