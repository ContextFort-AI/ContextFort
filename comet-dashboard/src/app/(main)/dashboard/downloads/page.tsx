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
import { DownloadIcon, FileIcon, AlertTriangleIcon, ChevronLeftIcon, ChevronRightIcon, RefreshCwIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DownloadRequest {
  id: number;
  filename: string;
  url: string;
  referrer: string;
  mime_type: string;
  file_extension: string;
  file_category: string;
  file_size: number;
  file_size_str: string;
  start_time: string;
  timestamp: number;
  danger: string;
  state: string;
}

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Load downloads from Chrome storage
  const loadDownloads = async () => {
    setIsLoading(true);
    try {
      // @ts-ignore - Chrome extension API
      if (typeof chrome !== 'undefined' && chrome?.storage) {
        // @ts-ignore - Chrome extension API
        const result = await chrome.storage.local.get(['downloadRequests']);
        setDownloads(result.downloadRequests || []);
      }
    } catch (error) {
      console.error('Error loading downloads:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadDownloads();
    // Refresh every 5 seconds
    const interval = setInterval(loadDownloads, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const totalDownloads = downloads.length;
  const dangerousDownloads = downloads.filter(d => d.danger !== 'safe').length;
  const completedDownloads = downloads.filter(d => d.state === 'complete').length;

  // Calculate pagination
  const totalPages = Math.ceil(downloads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDownloads = downloads.slice(startIndex, endIndex);

  const handleRefetch = () => {
    setCurrentPage(1);
    loadDownloads();
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

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'document': '📄',
      'spreadsheet': '📊',
      'presentation': '📽️',
      'image': '🖼️',
      'video': '🎬',
      'audio': '🎵',
      'archive': '📦',
      'executable': '⚙️',
      'code': '💻',
      'data': '📊',
      'other': '📁'
    };
    return icons[category] || '📁';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'document': 'bg-blue-500/10 text-blue-500',
      'spreadsheet': 'bg-green-500/10 text-green-500',
      'presentation': 'bg-purple-500/10 text-purple-500',
      'image': 'bg-pink-500/10 text-pink-500',
      'video': 'bg-red-500/10 text-red-500',
      'audio': 'bg-indigo-500/10 text-indigo-500',
      'archive': 'bg-yellow-500/10 text-yellow-500',
      'executable': 'bg-orange-500/10 text-orange-500',
      'code': 'bg-cyan-500/10 text-cyan-500',
      'data': 'bg-teal-500/10 text-teal-500',
      'other': 'bg-gray-500/10 text-gray-500'
    };
    return colors[category] || 'bg-gray-500/10 text-gray-500';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Downloads</h1>
          <p className="text-muted-foreground">
            Track all file downloads across your browser
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefetch}>
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Downloads"
          value={totalDownloads}
          icon={<DownloadIcon className="h-4 w-4" />}
          description="All time"
        />
        <StatCard
          title="Completed"
          value={completedDownloads}
          variant="success"
          icon={<FileIcon className="h-4 w-4" />}
          description="Successfully downloaded"
        />
        <StatCard
          title="Dangerous"
          value={dangerousDownloads}
          variant="error"
          icon={<AlertTriangleIcon className="h-4 w-4" />}
          description="Potentially harmful"
        />
      </div>

      {/* Downloads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Download History</CardTitle>
          <CardDescription>
            Complete record of all file downloads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCwIcon className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading downloads...</span>
            </div>
          ) : downloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <DownloadIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No downloads yet</h3>
              <p className="text-sm text-muted-foreground">
                Download activity will appear here
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
                    <TableHead>Filename</TableHead>
                    <TableHead className="w-[120px]">Size</TableHead>
                    <TableHead className="w-[140px]">Category</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDownloads.map((download, index) => (
                    <TableRow
                      key={`${download.id}-${index}`}
                      className={download.danger !== 'safe' ? 'bg-red-500/5' : ''}
                    >
                      <TableCell className="text-center text-xl">
                        {getCategoryIcon(download.file_category)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatTime(download.timestamp || download.start_time)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(download.timestamp || download.start_time)}
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate font-medium" title={download.filename}>
                          {download.filename}
                        </div>
                        <div className="truncate text-xs text-muted-foreground" title={download.url}>
                          {new URL(download.url).hostname}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {download.file_size_str}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs uppercase ${getCategoryColor(download.file_category)}`}>
                          {download.file_category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {download.danger !== 'safe' ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangleIcon className="h-3 w-3" />
                            Danger
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1 text-green-600">
                            Safe
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!isLoading && downloads.length > 0 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, downloads.length)} of {downloads.length} downloads
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
