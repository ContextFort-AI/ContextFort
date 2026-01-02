'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ListIcon, TrashIcon, PlusIcon, GlobeIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Whitelist {
  urls: string[];
  hostnames: string[];
}

export default function WhitelistPage() {
  const [whitelist, setWhitelist] = useState<Whitelist>({ urls: [], hostnames: [] });
  const [urlInput, setUrlInput] = useState('');
  const [hostnameInput, setHostnameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load whitelist from Chrome storage
  useEffect(() => {
    const loadWhitelist = () => {
      try {
        // @ts-ignore - Chrome extension API
        if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
          console.log('[Whitelist] Loading from chrome.storage...');
          // @ts-ignore - Chrome extension API
          chrome.storage.local.get(['whitelist'], (result: any) => {
            console.log('[Whitelist] Loaded:', result);
            if (result.whitelist) {
              setWhitelist(result.whitelist);
            }
          });
        } else {
          console.log('[Whitelist] Chrome storage not available, using empty whitelist');
        }
      } catch (error) {
        console.error('[Whitelist] Error loading:', error);
      }
    };

    loadWhitelist();
  }, []);

  const addUrl = () => {
    const value = urlInput.trim();
    if (!value) {
      alert('Please enter a URL');
      return;
    }

    if (whitelist.urls.includes(value)) {
      alert('URL already whitelisted');
      return;
    }

    try {
      const newWhitelist = {
        ...whitelist,
        urls: [...whitelist.urls, value]
      };

      // @ts-ignore - Chrome extension API
      chrome.storage.local.set({ whitelist: newWhitelist }, () => {
        console.log('[Whitelist] Added URL:', value);
        setWhitelist(newWhitelist);
        setUrlInput('');
      });
    } catch (error) {
      console.error('Error adding URL:', error);
      alert('Error adding URL');
    }
  };

  const addHostname = () => {
    const value = hostnameInput.trim();
    if (!value) {
      alert('Please enter a hostname');
      return;
    }

    if (whitelist.hostnames.includes(value)) {
      alert('Hostname already whitelisted');
      return;
    }

    try {
      const newWhitelist = {
        ...whitelist,
        hostnames: [...whitelist.hostnames, value]
      };

      // @ts-ignore - Chrome extension API
      chrome.storage.local.set({ whitelist: newWhitelist }, () => {
        console.log('[Whitelist] Added hostname:', value);
        setWhitelist(newWhitelist);
        setHostnameInput('');
      });
    } catch (error) {
      console.error('Error adding hostname:', error);
      alert('Error adding hostname');
    }
  };

  const removeUrl = (index: number) => {
    try {
      const newUrls = [...whitelist.urls];
      newUrls.splice(index, 1);
      const newWhitelist = { ...whitelist, urls: newUrls };

      // @ts-ignore - Chrome extension API
      chrome.storage.local.set({ whitelist: newWhitelist }, () => {
        console.log('[Whitelist] Removed URL at index:', index);
        setWhitelist(newWhitelist);
      });
    } catch (error) {
      console.error('Error removing URL:', error);
      alert('Error removing URL');
    }
  };

  const removeHostname = (index: number) => {
    try {
      const newHostnames = [...whitelist.hostnames];
      newHostnames.splice(index, 1);
      const newWhitelist = { ...whitelist, hostnames: newHostnames };

      // @ts-ignore - Chrome extension API
      chrome.storage.local.set({ whitelist: newWhitelist }, () => {
        console.log('[Whitelist] Removed hostname at index:', index);
        setWhitelist(newWhitelist);
      });
    } catch (error) {
      console.error('Error removing hostname:', error);
      alert('Error removing hostname');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Whitelist Management</h1>
        <p className="text-muted-foreground">
          Add URLs or hostnames to whitelist. Whitelisted requests will not be blocked even if detected as bot activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Whitelisted URLs"
          value={whitelist.urls.length}
          icon={<GlobeIcon className="h-4 w-4" />}
          description="Full URL matches"
        />
        <StatCard
          title="Whitelisted Hostnames"
          value={whitelist.hostnames.length}
          icon={<ListIcon className="h-4 w-4" />}
          description="Domain-wide matches"
        />
      </div>

      {/* Whitelisted URLs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Whitelisted URLs</CardTitle>
          <CardDescription>
            Add complete URLs to whitelist (e.g., https://example.com/api/endpoint)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter URL (e.g., https://example.com/api)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addUrl()}
            />
            <Button onClick={addUrl}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add URL
            </Button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : whitelist.urls.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No URLs whitelisted yet</p>
            ) : (
              whitelist.urls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <code className="text-sm text-green-600 dark:text-green-400">{url}</code>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeUrl(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Whitelisted Hostnames Section */}
      <Card>
        <CardHeader>
          <CardTitle>Whitelisted Hostnames</CardTitle>
          <CardDescription>
            Add hostnames to whitelist all URLs from that domain (e.g., api.example.com)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter hostname (e.g., api.example.com)"
              value={hostnameInput}
              onChange={(e) => setHostnameInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHostname()}
            />
            <Button onClick={addHostname}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Hostname
            </Button>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : whitelist.hostnames.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No hostnames whitelisted yet</p>
            ) : (
              whitelist.hostnames.map((hostname, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <code className="text-sm text-green-600 dark:text-green-400">{hostname}</code>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeHostname(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
