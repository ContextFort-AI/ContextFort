'use client';

import { useHumanRequests, useHumanBackgroundRequests, useClassificationStats } from '@/hooks/use-classification';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/stat-card';
import { UserIcon, CheckCircle2Icon, ActivityIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-react';

export default function HumanRequestsPage() {
  const { requests: userInputRequests, isLoading: loadingUserInput, refetch: refetchUserInput } = useHumanRequests();
  const { requests: backgroundRequests, isLoading: loadingBackground, refetch: refetchBackground } = useHumanBackgroundRequests();
  const { stats } = useClassificationStats();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const calculateAvgTimeDiff = (reqs: typeof userInputRequests) => {
    if (reqs.length === 0) return 0;
    const total = reqs.reduce((acc, r) => acc + (r.click_time_diff_ms || 0), 0);
    return Math.round(total / reqs.length);
  };

  const handleRefreshAll = () => {
    refetchUserInput();
    refetchBackground();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">👤 Human Requests</h1>
          <p className="text-muted-foreground">
            Requests initiated by legitimate human activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefreshAll}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Human Requests"
          value={stats?.human_requests || 0}
          icon={<UserIcon className="h-4 w-4" />}
          variant="success"
          description="Legitimate activity"
        />
        <StatCard
          title="User Input Requests"
          value={userInputRequests.length}
          icon={<CheckCircle2Icon className="h-4 w-4" />}
          description="With button click data"
        />
        <StatCard
          title="Background Requests"
          value={backgroundRequests.length}
          icon={<ActivityIcon className="h-4 w-4" />}
          description="Without click correlation"
        />
      </div>

      {/* Section 1: Human POST Requests with User Input Data (on button click) */}
      <Card>
        <CardHeader>
          <CardTitle>1. Human POST Requests with User Input Data</CardTitle>
          <CardDescription>
            Legitimate requests triggered by button clicks with user input data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingUserInput ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading requests...</span>
            </div>
          ) : userInputRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UserIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No user input requests detected</h3>
              <p className="text-sm text-muted-foreground">
                Human-initiated requests with user input will appear here
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
                    <TableHead>Matched Fields</TableHead>
                    <TableHead>Matched Input Values</TableHead>
                    <TableHead className="w-[150px]">Click Correlation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userInputRequests.map((req) => (
                    <TableRow key={req.id} className="bg-green-500/5">
                      <TableCell className="font-medium text-muted-foreground">
                        {formatTime(req.timestamp)}
                      </TableCell>
                      <TableCell>
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-mono">
                          {req.target_url.length > 50
                            ? `${req.target_url.substring(0, 50)}...`
                            : req.target_url}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge>{req.target_hostname}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {req.matched_fields.slice(0, 3).map((field, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                          {req.matched_fields.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{req.matched_fields.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 max-w-xs">
                          {Object.entries(req.matched_values).slice(0, 2).map(([key, value], index) => (
                            <div key={index} className="text-xs">
                              <span className="font-medium text-muted-foreground">{key}:</span>{' '}
                              <span className="text-foreground">
                                {value.length > 30 ? `${value.substring(0, 30)}...` : value}
                              </span>
                            </div>
                          ))}
                          {Object.keys(req.matched_values).length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{Object.keys(req.matched_values).length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col gap-1">
                          <Badge variant="default" className="gap-1 w-fit">
                            <CheckCircle2Icon className="h-3 w-3" />
                            Correlated
                          </Badge>
                          <div className="text-muted-foreground">Δt: {req.click_time_diff_ms}ms</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Background Requests (Human) */}
      <Card>
        <CardHeader>
          <CardTitle>2. Background Requests (Human)</CardTitle>
          <CardDescription>
            Human requests without click correlation - background activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingBackground ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading requests...</span>
            </div>
          ) : backgroundRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircleIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No background requests detected</h3>
              <p className="text-sm text-muted-foreground">
                Human background requests will appear here
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
                    <TableHead>Matched Fields</TableHead>
                    <TableHead>Matched Input Values</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backgroundRequests.map((req) => (
                    <TableRow key={req.id} className="bg-yellow-500/5">
                      <TableCell className="font-medium text-muted-foreground">
                        {formatTime(req.timestamp)}
                      </TableCell>
                      <TableCell>
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-mono">
                          {req.target_url.length > 50
                            ? `${req.target_url.substring(0, 50)}...`
                            : req.target_url}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge>{req.target_hostname}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {req.matched_fields && req.matched_fields.length > 0 ? (
                            <>
                              {req.matched_fields.slice(0, 3).map((field, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {field}
                                </Badge>
                              ))}
                              {req.matched_fields.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{req.matched_fields.length - 3}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No matched fields</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 max-w-xs">
                          {req.matched_values && Object.keys(req.matched_values).length > 0 ? (
                            <>
                              {Object.entries(req.matched_values).slice(0, 2).map(([key, value], index) => (
                                <div key={index} className="text-xs">
                                  <span className="font-medium text-muted-foreground">{key}:</span>{' '}
                                  <span className="text-foreground">
                                    {value.length > 30 ? `${value.substring(0, 30)}...` : value}
                                  </span>
                                </div>
                              ))}
                              {Object.keys(req.matched_values).length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{Object.keys(req.matched_values).length - 2} more
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">No input data</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <ActivityIcon className="h-3 w-3" />
                          Background
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
