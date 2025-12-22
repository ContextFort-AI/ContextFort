'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useClickStats } from '@/hooks/use-click-stats';
import { usePostStats } from '@/hooks/use-post-stats';
import { ActivityIcon, AlertTriangleIcon, CheckCircle2Icon, RefreshCwIcon, ShieldIcon } from 'lucide-react';

export default function OverviewPage() {
  const { stats: postStats, isLoading: postLoading, isOnline: postOnline, refetch: refetchPost } = usePostStats();
  const { stats: clickStats, isLoading: clickLoading, isOnline: clickOnline, refetch: refetchClick } = useClickStats();

  const handleRefresh = () => {
    refetchPost();
    refetchClick();
  };

  if (postLoading || clickLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <RefreshCwIcon className="mx-auto mb-4 h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const totalIncidents = (postStats?.total_requests || 0) + (clickStats?.total_clicks || 0);
  const todayTotal = (postStats?.today_requests || 0);
  const suspiciousCount = clickStats?.suspicious_clicks || 0;
  const legitimateCount = clickStats?.legitimate_clicks || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Overview</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of security incidents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={postOnline ? 'default' : 'destructive'} className="gap-1">
            <div className={`h-2 w-2 rounded-full ${postOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            POST Monitor
          </Badge>
          <Badge variant={clickOnline ? 'default' : 'destructive'} className="gap-1">
            <div className={`h-2 w-2 rounded-full ${clickOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            Click Detection
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Incidents"
          value={totalIncidents}
          icon={<ActivityIcon className="h-4 w-4" />}
          description="All time"
        />
        <StatCard
          title="POST Requests"
          value={postStats?.total_requests || 0}
          icon={<ShieldIcon className="h-4 w-4" />}
          description={`${todayTotal} today`}
        />
        <StatCard
          title="Suspicious Clicks"
          value={suspiciousCount}
          variant="error"
          icon={<AlertTriangleIcon className="h-4 w-4" />}
          description={`${legitimateCount} legitimate`}
        />
        <StatCard
          title="Unique Domains"
          value={postStats?.blocked_domains?.length || 0}
          variant="success"
          icon={<CheckCircle2Icon className="h-4 w-4" />}
          description="Blocked"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Blocked Domains */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Blocked Domains</CardTitle>
            <CardDescription>Most frequently detected domains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {postStats?.blocked_domains?.slice(0, 5).map((domain, index) => (
                <div key={domain.hostname} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="truncate text-sm font-medium">{domain.hostname}</div>
                  </div>
                  <Badge variant="secondary">{domain.count}</Badge>
                </div>
              )) || (
                <p className="text-center text-sm text-muted-foreground">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Click Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Click Distribution</CardTitle>
            <CardDescription>Legitimate vs Suspicious</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Legitimate</span>
                  <span className="font-medium">{legitimateCount}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${((legitimateCount / (legitimateCount + suspiciousCount)) * 100) || 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Suspicious</span>
                  <span className="font-medium">{suspiciousCount}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${((suspiciousCount / (legitimateCount + suspiciousCount)) * 100) || 0}%`,
                    }}
                  />
                </div>
              </div>
              <div className="pt-2 text-center text-xs text-muted-foreground">
                Total: {legitimateCount + suspiciousCount} clicks
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {postStats?.recent_activity?.slice(0, 5).map((activity) => (
                <div key={activity.date} className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                  <Badge variant="outline">{activity.count} requests</Badge>
                </div>
              )) || (
                <p className="text-center text-sm text-muted-foreground">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Navigate to detailed views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4" asChild>
              <a href="/dashboard/post-requests">
                <ShieldIcon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">POST Request Monitor</div>
                  <div className="text-sm text-muted-foreground">
                    View all detected POST requests
                  </div>
                </div>
              </a>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-start gap-2 p-4" asChild>
              <a href="/dashboard/click-detection">
                <ActivityIcon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Click Detection</div>
                  <div className="text-sm text-muted-foreground">
                    Monitor click activity in real-time
                  </div>
                </div>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
