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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePostRequests, usePostStats } from '@/hooks/use-post-stats';
import { AlertCircleIcon, RefreshCwIcon, ShieldIcon, Trash2Icon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { useState } from 'react';

export default function POSTRequestsPage() {
  const { stats, isOnline } = usePostStats();
  const { requests, isLoading, refetch, deleteRequest, clearAll } = usePostRequests();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const itemsPerPage = 20;

  // Calculate pagination
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = requests.slice(startIndex, endIndex);

  // Reset to page 1 when requests change
  const handleRefetch = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    setDeletingId(id);
    try {
      await deleteRequest(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all requests? This action cannot be undone.')) return;

    await clearAll();
  };

  const handleCopyUrl = async (id: number, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      // Show time only for today: "10:30 AM"
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      // Show date and time for older requests: "Dec 21, 10:30 AM"
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blocked Requests Monitor</h1>
          <p className="text-muted-foreground">
            Blocked requests with user input data from button clicks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isOnline ? 'default' : 'destructive'} className="gap-1">
            <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            {isOnline ? 'Connected' : 'Offline'}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefetch}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {requests.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleClearAll}>
              <Trash2Icon className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Requests"
          value={stats?.total_requests || 0}
          icon={<ShieldIcon className="h-4 w-4" />}
          description="All time"
        />
        <StatCard
          title="Today's Requests"
          value={stats?.today_requests || 0}
          icon={<AlertCircleIcon className="h-4 w-4" />}
          description="Last 24 hours"
        />
        <StatCard
          title="Unique Domains"
          value={stats?.blocked_domains?.length || 0}
          icon={<ShieldIcon className="h-4 w-4" />}
          description="Blocked"
        />
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Blocked Requests</CardTitle>
          <CardDescription>
            Blocked requests with user input data triggered by button clicks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading requests...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <ShieldIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No requests detected</h3>
              <p className="text-sm text-muted-foreground">
                Your browsing is secure! Requests will appear here when detected.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Time</TableHead>
                    <TableHead>Target URL</TableHead>
                    <TableHead className="w-[180px]">Hostname</TableHead>
                    <TableHead className="w-[300px]">Source</TableHead>
                    <TableHead>Matched Fields</TableHead>
                    <TableHead>Matched Input Values</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((request) => (
                    <TableRow key={request.id} className="group">
                      <TableCell className="font-medium text-muted-foreground">
                        {formatTime(request.timestamp)}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 group/target">
                                <code className="flex-1 relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-mono hover:bg-muted/80 transition-colors cursor-default break-all">
                                  {request.target_url.length > 60
                                    ? `${request.target_url.substring(0, 60)}...`
                                    : request.target_url}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover/target:opacity-100 transition-opacity"
                                  onClick={() => handleCopyUrl(request.id + 1000, request.target_url)}
                                >
                                  {copiedId === request.id + 1000 ? (
                                    <CheckIcon className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <CopyIcon className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-md break-all">
                              <p className="text-xs font-mono">{request.target_url}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.target_hostname}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 group/url">
                                <code className="flex-1 text-muted-foreground hover:text-foreground transition-colors cursor-default break-all">
                                  {request.source_url.length > 60
                                    ? `${request.source_url.substring(0, 60)}...`
                                    : request.source_url}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover/url:opacity-100 transition-opacity"
                                  onClick={() => handleCopyUrl(request.id, request.source_url)}
                                >
                                  {copiedId === request.id ? (
                                    <CheckIcon className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <CopyIcon className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-md break-all">
                              <p className="text-xs font-mono">{request.source_url}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {request.matched_fields.slice(0, 3).map((field, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                          {request.matched_fields.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{request.matched_fields.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 max-w-xs">
                          {Object.entries(request.matched_values).slice(0, 2).map(([key, value], index) => (
                            <div key={index} className="text-xs">
                              <span className="font-medium text-muted-foreground">{key}:</span>{' '}
                              <span className="text-foreground">
                                {value.length > 30 ? `${value.substring(0, 30)}...` : value}
                              </span>
                            </div>
                          ))}
                          {Object.keys(request.matched_values).length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{Object.keys(request.matched_values).length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(request.id)}
                          disabled={deletingId === request.id}
                          className="opacity-0 group-hover:opacity-100"
                        >
                          {deletingId === request.id ? (
                            <RefreshCwIcon className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2Icon className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!isLoading && requests.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, requests.length)} of {requests.length} requests
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
