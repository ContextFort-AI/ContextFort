'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Fragment, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
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
import { SessionRow, Screenshot } from './columns';

interface DataTableProps {
  columns: ColumnDef<SessionRow>[];
  data: SessionRow[];
  onRowClick: (sessionId: number) => void;
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

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const finalSeconds = seconds % 60;
  return `${hours}h ${remainingMinutes}m ${finalSeconds}s`;
};

const getSessionDuration = (session: SessionRow['session']) => {
  if (session.duration) {
    return formatDuration(session.duration);
  }
  if (session.status === 'active') {
    const start = new Date(session.startTime);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    return formatDuration(seconds);
  }
  return 'Unknown';
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

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    defaultColumn: {
      minSize: 50,
      maxSize: 500,
    },
  });

  // Store image dimensions by screenshot ID
  const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({});

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

  return (
    <div className="rounded-md border border-border">
      <Table style={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  style={{ width: `${header.getSize()}%`, minWidth: `${header.getSize()}%`, maxWidth: `${header.getSize()}%` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const sessionRow = row.original;
              const isExpanded = sessionRow.isExpanded;

              return (
                <Fragment key={row.id}>
                  {/* Main Row */}
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    data-session-id={sessionRow.session.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors border-b border-border"
                    onClick={() => onRowClick(sessionRow.session.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: `${cell.column.getSize()}%`, minWidth: `${cell.column.getSize()}%`, maxWidth: `${cell.column.getSize()}%` }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableCell colSpan={columns.length} className="p-0">
                        <div className="p-6 space-y-4">
                          {/* Session Info */}
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Session ID: </span>
                              <span className="text-foreground">{sessionRow.session.id}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Duration: </span>
                              <span className="text-foreground">{getSessionDuration(sessionRow.session)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status: </span>
                              <Badge variant="outline" className="ml-2 bg-background border-border">
                                {sessionRow.session.status}
                              </Badge>
                            </div>
                          </div>

                          {/* Screenshots Grid */}
                          <div className="grid grid-cols-4 gap-4">
                            {sessionRow.screenshots.map((screenshot, index) => {
                              const actionType = screenshot.eventDetails?.actionType || screenshot.reason;
                              const coordinates = screenshot.eventDetails?.coordinates;
                              const element = screenshot.eventDetails?.element;
                              const inputValue = screenshot.eventDetails?.inputValue;
                              const inputValues = screenshot.eventDetails?.inputValues;

                              // All actions now have screenshots, no need for fallback logic
                              const displayDataUrl = screenshot.dataUrl;
                              const displayScreenshotId = screenshot.id;

                              // Generate action description
                              const getActionDescription = () => {
                                if (inputValues && inputValues.length > 0) {
                                  return `Inputs (${inputValues.length}): ${inputValues.map(v => `"${v}"`).join(', ')}`;
                                }
                                if (inputValue) {
                                  return `Input: "${inputValue}"`;
                                }
                                if (element) {
                                  const parts = [];
                                  if (element.tag) parts.push(element.tag);
                                  if (element.id) parts.push(`#${element.id}`);
                                  else if (element.className) parts.push(`.${element.className.split(' ')[0]}`);
                                  if (element.text) parts.push(`"${element.text}"`);
                                  return parts.length > 0 ? `Clicked: ${parts.join(' ')}` : null;
                                }
                                return null;
                              };

                              const actionDescription = getActionDescription();

                              return (
                                <Dialog key={screenshot.id}>
                                  <DialogTrigger asChild>
                                    <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-muted-foreground transition-colors cursor-pointer flex flex-col h-full">
                                      <div className="relative w-full h-[120px] bg-muted flex-shrink-0">
                                        {!displayDataUrl && actionType === 'page_read' ? (
                                          <div className="w-full h-full flex flex-col items-center justify-center p-2 gap-1">
                                            <BookOpenIcon className="h-6 w-6 text-muted-foreground/50" />
                                            <div className="text-center w-full px-2">
                                              <div className="text-[10px] font-medium text-foreground truncate" title={screenshot.title}>
                                                {screenshot.title}
                                              </div>
                                              <div className="text-[10px] text-muted-foreground truncate mt-0.5" title={screenshot.url}>
                                                {screenshot.url}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <img
                                              src={displayDataUrl}
                                              alt={`Screenshot ${screenshot.id}`}
                                              className="w-full h-full object-cover"
                                              onLoad={(e) => handleImageLoad(displayScreenshotId, e)}
                                            />
                                            {/* Red box overlay for click coordinates - only show for action, not result */}
                                            {coordinates && imageDimensions[displayScreenshotId] && !actionType.includes('_result') && (
                                              <div
                                                className="absolute border-2 border-red-500 bg-red-500/20"
                                                style={{
                                                  left: `${(coordinates.x / imageDimensions[displayScreenshotId].width) * 100}%`,
                                                  top: `${(coordinates.y / imageDimensions[displayScreenshotId].height) * 100}%`,
                                                  width: '20px',
                                                  height: '20px',
                                                  transform: 'translate(-50%, -50%)'
                                                }}
                                              />
                                            )}
                                          </>
                                        )}
                                      </div>
                                      <div className="p-3 space-y-2 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="text-xs text-muted-foreground">
                                            {formatDate(screenshot.timestamp)} {formatTime(screenshot.timestamp)}
                                          </div>
                                          <div className="flex items-center gap-1 flex-shrink-0">
                                            {getReasonIcon(actionType)}
                                            <span className="text-xs text-muted-foreground">
                                              {getReasonLabel(screenshot)}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-xs font-medium text-foreground truncate">
                                            {screenshot.title}
                                          </div>
                                          <div className="text-xs text-muted-foreground truncate">
                                            {screenshot.url}
                                          </div>
                                        </div>
                                        {/* Action description - fixed height slot */}
                                        <div className="h-[28px] flex items-center">
                                          {actionDescription && (
                                            <div className="text-xs text-foreground bg-muted/50 px-2 py-1 rounded border border-border truncate w-full">
                                              {actionDescription}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-[90vw] max-h-[90vh] p-4">
                                    <div className="relative">
                                      {!displayDataUrl && actionType === 'page_read' ? (
                                        <div className="flex flex-col items-center justify-center p-12 gap-4 bg-muted rounded">
                                          <BookOpenIcon className="h-16 w-16 text-muted-foreground/50" />
                                          <div className="text-center">
                                            <div className="text-lg font-medium text-foreground mb-2">
                                              {screenshot.title}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                              {screenshot.url}
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <img
                                            src={displayDataUrl}
                                            alt={`Screenshot ${screenshot.id}`}
                                            className="w-full h-full object-contain"
                                            onLoad={(e) => handleImageLoad(displayScreenshotId, e)}
                                          />
                                          {/* Red box overlay for full-size view - only show for action, not result */}
                                          {coordinates && imageDimensions[displayScreenshotId] && !actionType.includes('_result') && (
                                            <div
                                              className="absolute border-4 border-red-500 bg-red-500/30"
                                              style={{
                                                left: `${(coordinates.x / imageDimensions[displayScreenshotId].width) * 100}%`,
                                                top: `${(coordinates.y / imageDimensions[displayScreenshotId].height) * 100}%`,
                                                width: '40px',
                                                height: '40px',
                                                transform: 'translate(-50%, -50%)'
                                              }}
                                            />
                                          )}
                                        </>
                                      )}
                                    </div>
                                    {/* Action description in dialog */}
                                    {actionDescription && (
                                      <div className="text-sm text-foreground bg-muted p-3 rounded border border-border mt-2">
                                        {actionDescription}
                                      </div>
                                    )}
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
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
