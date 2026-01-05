"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3Icon, EyeIcon, SlidersIcon, ActivityIcon } from "lucide-react";

interface Session {
  id: number;
  startUrl: string;
  startTime: string;
  endTime: string | null;
  tabId: number;
  screenshotCount?: number;
}

interface Screenshot {
  sessionId?: number | null;
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // @ts-ignore - Chrome extension API
        if (typeof chrome !== 'undefined' && chrome?.storage) {
          // @ts-ignore - Chrome extension API
          const result = await chrome.storage.local.get(["sessions", "screenshots"]);
          setSessions(result.sessions || []);
          setScreenshots(result.screenshots || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => !s.endTime).length;
  const totalScreenshots = screenshots.length;
  const sessionsWithScreenshots = sessions.filter(s =>
    screenshots.some(ss => ss.sessionId === s.id)
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">Overview of your session activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              All recorded sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              Currently ongoing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Screenshots</CardTitle>
            <EyeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScreenshots}</div>
            <p className="text-xs text-muted-foreground">
              Captured events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions with Activity</CardTitle>
            <SlidersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessionsWithScreenshots}</div>
            <p className="text-xs text-muted-foreground">
              Sessions with screenshots
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
