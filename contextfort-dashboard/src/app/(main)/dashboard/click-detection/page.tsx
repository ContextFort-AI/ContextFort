'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useClickEvents, useClickStats } from '@/hooks/use-click-stats';
import { ActivityIcon, AlertTriangleIcon, CheckCircle2Icon, MousePointerClickIcon, RefreshCwIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

export default function ClickDetectionPage() {
  const { stats, isOnline } = useClickStats();
  const { events, isLoading, refetch } = useClickEvents();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Calculate pagination
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = events.slice(startIndex, endIndex);

  // Reset to page 1 when events change
  const handleRefetch = () => {
    setCurrentPage(1);
    refetch();
  };

  const formatTime = (timestamp: string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (timestamp: string | number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getActionIcon = (actionType?: string) => {
    switch (actionType) {
      case 'navigation':
        return '🔗';
      case 'button':
        return '🔘';
      case 'input':
        return '⌨️';
      default:
        return '👆';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Click Detection</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of click events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? 'default' : 'destructive'} className="gap-1">
            <div className={`h-2 w-2 rounded-full ${isOnline ? 'animate-pulse bg-green-500' : 'bg-red-500'}`} />
            {isOnline ? 'LIVE' : 'Offline'}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefetch}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Clicks"
          value={stats?.total_clicks || 0}
          icon={<MousePointerClickIcon className="h-4 w-4" />}
          description="All time"
        />
        <StatCard
          title="Legitimate Clicks"
          value={stats?.legitimate_clicks || 0}
          variant="success"
          icon={<CheckCircle2Icon className="h-4 w-4" />}
          description="Verified human"
        />
        <StatCard
          title="Suspicious Clicks"
          value={stats?.suspicious_clicks || 0}
          variant="error"
          icon={<AlertTriangleIcon className="h-4 w-4" />}
          description="Potential bots"
        />
      </div>

      {/* Activity Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Activity Feed</CardTitle>
              <CardDescription>
                Real-time click event monitoring
              </CardDescription>
            </div>
            {isOnline && (
              <Badge variant="outline" className="gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Monitoring
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ActivityIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">Waiting for clicks...</h3>
              <p className="text-sm text-muted-foreground">
                Activity will appear here in real-time
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Type</TableHead>
                    <TableHead className="w-[100px]">Time</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="w-[120px]">Action</TableHead>
                    <TableHead>Page Title</TableHead>
                    <TableHead>Page URL</TableHead>
                    <TableHead className="w-[140px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEvents.map((event, index) => (
                    <TableRow
                      key={`${event.id}-${index}`}
                      className={event.is_suspicious ? 'bg-red-500/5' : 'bg-green-500/5'}
                    >
                      <TableCell className="text-center text-xl">
                        {getActionIcon(event.action_type)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatTime(event.created_at || event.timestamp)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(event.created_at || event.timestamp)}
                      </TableCell>
                      <TableCell>
                        {event.action_type && (
                          <Badge variant="outline" className="text-xs uppercase">
                            {event.action_type}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="truncate font-medium" title={event.page_title || ''}>
                          {event.page_title || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        {event.page_url ? (
                          <div className="max-w-[300px] overflow-hidden">
                            <code className="block truncate rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-mono" title={event.page_url}>
                              {event.page_url}
                            </code>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={event.is_suspicious ? 'destructive' : 'default'}
                          className="gap-1"
                        >
                          {event.is_suspicious ? (
                            <>
                              <AlertTriangleIcon className="h-3 w-3" />
                              Suspicious
                            </>
                          ) : (
                            <>
                              <CheckCircle2Icon className="h-3 w-3" />
                              Legitimate
                            </>
                          )}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!isLoading && events.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, events.length)} of {events.length} events
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
