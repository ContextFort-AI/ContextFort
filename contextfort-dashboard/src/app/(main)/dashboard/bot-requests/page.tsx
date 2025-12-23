'use client';

import { useBotRequests, useClassificationStats } from '@/hooks/use-classification';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { BotIcon, AlertTriangleIcon, ShieldAlertIcon, RefreshCwIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useState } from 'react';

export default function BotRequestsPage() {
  const { requests, isLoading, refetch } = useBotRequests();
  const { stats } = useClassificationStats();

  const [currentPage, setCurrentPage] = useState(1);
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

  const calculateDetectionRate = (s: typeof stats) => {
    if (!s || s.total_requests === 0) return 0;
    return ((s.bot_requests / s.total_requests) * 100).toFixed(1);
  };

  const countUniqueHostnames = (reqs: typeof requests) => {
    const hostnames = new Set(reqs.map(r => r.target_hostname));
    return hostnames.size;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🤖 Bot Requests</h1>
          <p className="text-muted-foreground">
            Requests initiated by suspicious/automated clicks
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefetch}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Bot Requests"
          value={stats?.bot_requests || 0}
          icon={<BotIcon className="h-4 w-4" />}
          variant="error"
          description="Suspicious activity"
        />
        <StatCard
          title="Detection Rate"
          value={`${calculateDetectionRate(stats)}%`}
          icon={<ShieldAlertIcon className="h-4 w-4" />}
          description="Bot detection accuracy"
        />
        <StatCard
          title="Unique Targets"
          value={countUniqueHostnames(requests)}
          icon={<AlertTriangleIcon className="h-4 w-4" />}
          description="Targeted domains"
        />
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bot-Initiated Requests</CardTitle>
          <CardDescription>
            Requests with suspicious click correlation
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
              <BotIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No bot requests detected</h3>
              <p className="text-sm text-muted-foreground">
                Bot-initiated requests will appear here
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Time</TableHead>
                    <TableHead className="w-[80px]">Method</TableHead>
                    <TableHead>Target URL</TableHead>
                    <TableHead className="w-[180px]">Hostname</TableHead>
                    <TableHead className="w-[150px]">Click Correlation</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((req) => (
                    <TableRow key={req.id} className="bg-red-500/5">
                      <TableCell className="font-medium text-muted-foreground">
                        {formatTime(req.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{req.request_method}</Badge>
                      </TableCell>
                      <TableCell>
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-mono">
                          {req.target_url.length > 50
                            ? `${req.target_url.substring(0, 50)}...`
                            : req.target_url}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">{req.target_hostname}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div>ID: #{req.click_correlation_id}</div>
                        <div>Δt: {req.click_time_diff_ms}ms</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangleIcon className="h-3 w-3" />
                          Bot
                        </Badge>
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
