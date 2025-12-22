'use client';

import { useBotRequests, useClassificationStats } from '@/hooks/use-classification';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { BotIcon, AlertTriangleIcon, ShieldAlertIcon, RefreshCwIcon } from 'lucide-react';

export default function BotRequestsPage() {
  const { requests, isLoading, refetch } = useBotRequests();
  const { stats } = useClassificationStats();

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
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
          <Button variant="outline" size="sm" onClick={refetch}>
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
                  {requests.map((req) => (
                    <TableRow key={req.id} className="bg-red-500/5">
                      <TableCell className="font-medium text-muted-foreground">
                        {formatRelativeTime(req.timestamp)}
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
        </CardContent>
      </Card>
    </div>
  );
}
