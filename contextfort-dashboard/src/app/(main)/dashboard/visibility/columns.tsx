'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  MousePointerIcon,
  MousePointerClickIcon,
  MenuIcon,
  KeyboardIcon,
  EditIcon,
  ArrowUpDownIcon,
  BookOpenIcon,
  SparklesIcon
} from 'lucide-react';

export interface Screenshot {
  id: number;
  tabId: number;
  url: string;
  title: string;
  reason: string;
  timestamp: string;
  dataUrl: string;
  eventType?: string;
  eventDetails?: {
    element: any | null;
    coordinates: { x: number; y: number } | null;
    inputValue: string | null;
    actionType: string;
  } | null;
  clickedElement?: {
    tag: string;
    id: string;
    className: string;
    text: string;
    type: string | null;
  } | null;
  clickCoordinates?: { x: number; y: number } | null;
  inputFields?: string[];
  inputValues?: Record<string, string>;
  postRequest?: {
    url: string;
    hostname: string;
    method: string;
    matched_fields: string[];
    matched_values: Record<string, string>;
    status: string;
    is_bot: boolean;
    agent_mode_detected: boolean;
    timestamp: string;
  } | null;
  sessionId?: number | null;
}

export interface Session {
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

export interface SessionRow {
  session: Session;
  screenshots: Screenshot[];
  currentScreenshot: Screenshot | null;
  isExpanded: boolean;
}

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

const getReasonIcon = (actionType: string) => {
  if (actionType === 'click') {
    return <MousePointerIcon className="h-4 w-4" />;
  } else if (actionType === 'dblclick') {
    return <MousePointerClickIcon className="h-4 w-4" />;
  } else if (actionType === 'rightclick') {
    return <MenuIcon className="h-4 w-4" />;
  } else if (actionType === 'input') {
    return <KeyboardIcon className="h-4 w-4" />;
  } else if (actionType === 'change') {
    return <EditIcon className="h-4 w-4" />;
  } else if (actionType === 'scroll') {
    return <ArrowUpDownIcon className="h-4 w-4" />;
  } else if (actionType === 'page_read') {
    return <BookOpenIcon className="h-4 w-4" />;
  } else if (actionType === 'agent_event') {
    return <SparklesIcon className="h-4 w-4" />;
  } else if (actionType === 'suspicious_click') {
    return <MousePointerClickIcon className="h-4 w-4" />;
  } else if (actionType.includes('dom_change')) {
    return <SparklesIcon className="h-4 w-4" />;
  }
  return <EyeIcon className="h-4 w-4" />;
};

const getReasonLabel = (screenshot: Screenshot) => {
  // Use actionType if available for more specific labeling
  const actionType = screenshot.eventDetails?.actionType || screenshot.reason;

  if (actionType === 'click') {
    return 'Click';
  } else if (actionType === 'dblclick') {
    return 'Double Click';
  } else if (actionType === 'rightclick') {
    return 'Right Click';
  } else if (actionType === 'input') {
    return 'Text Input';
  } else if (actionType === 'change') {
    return 'Value Changed';
  } else if (actionType === 'scroll') {
    return 'Scroll';
  } else if (actionType === 'page_read') {
    return 'Page Read';
  } else if (actionType === 'agent_event') {
    return 'Agent Action';
  } else if (actionType === 'suspicious_click') {
    return 'Suspicious Click';
  } else if (actionType.includes('dom_change')) {
    return 'DOM Change';
  }
  return actionType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const columns: ColumnDef<SessionRow>[] = [
  {
    id: 'preview',
    accessorKey: 'currentScreenshot',
    header: 'Preview',
    cell: ({ row }) => {
      const currentScreenshot = row.original.currentScreenshot;

      if (!currentScreenshot || !currentScreenshot.dataUrl) {
        return (
          <div className="relative w-[180px] h-[100px] bg-muted rounded overflow-hidden border border-border flex items-center justify-center">
            <span className="text-xs text-muted-foreground">No preview</span>
          </div>
        );
      }

      return (
        <div className="relative w-[180px] h-[100px] bg-muted rounded overflow-hidden border border-border">
          <img
            src={currentScreenshot.dataUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      );
    },
  },
  {
    id: 'event',
    accessorKey: 'currentScreenshot.reason',
    header: 'Event',
    cell: ({ row }) => {
      const currentScreenshot = row.original.currentScreenshot;

      if (!currentScreenshot) return null;

      const actionType = currentScreenshot.eventDetails?.actionType || currentScreenshot.reason;

      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            {getReasonIcon(actionType)}
          </span>
          <span className="text-sm text-foreground">
            {getReasonLabel(currentScreenshot)}
          </span>
        </div>
      );
    },
  },
  {
    id: 'url',
    accessorKey: 'session.tabUrl',
    header: 'URL',
    cell: ({ row }) => {
      const title = row.original.session.tabTitle;
      const url = row.original.session.tabUrl;

      return (
        <div className="max-w-[300px]">
          <div className="truncate text-sm text-foreground font-medium">
            {title}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {url}
          </div>
        </div>
      );
    },
  },
  {
    id: 'time',
    accessorKey: 'session.startTime',
    header: 'Time',
    cell: ({ row }) => {
      const startTime = row.original.session.startTime;

      return (
        <div className="flex flex-col text-sm">
          <span className="text-foreground">{formatDate(startTime)}</span>
          <span className="text-muted-foreground text-xs">{formatTime(startTime)}</span>
        </div>
      );
    },
  },
  {
    id: 'captures',
    accessorKey: 'screenshots.length',
    header: () => <div className="text-right">Captures</div>,
    cell: ({ row }) => {
      const count = row.original.screenshots.length;

      return (
        <div className="text-right">
          <Badge variant="outline" className="bg-muted text-foreground border-border">
            {count}
          </Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const isExpanded = row.original.isExpanded;

      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          {isExpanded ? (
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      );
    },
  },
];
