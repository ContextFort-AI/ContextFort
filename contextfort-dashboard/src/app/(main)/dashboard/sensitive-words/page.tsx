'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlertIcon, TrashIcon, PlusIcon, RotateCcwIcon, InfoIcon } from 'lucide-react';
import { useState, useEffect } from 'react';

const DEFAULT_WORDS = ['password', 'secret', 'token', 'api_key', 'credential', 'private'];

export default function SensitiveWordsPage() {
  const [words, setWords] = useState<string[]>(DEFAULT_WORDS);
  const [wordInput, setWordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load sensitive words from Chrome storage
  useEffect(() => {
    const loadWords = async () => {
      try {
        // @ts-ignore - Chrome extension API
        if (typeof chrome !== 'undefined' && chrome?.storage?.local) {
          console.log('[Sensitive Words] Loading from chrome.storage...');
          // @ts-ignore - Chrome extension API
          chrome.storage.local.get(['sensitiveWords'], (result: any) => {
            console.log('[Sensitive Words] Loaded:', result);
            if (result.sensitiveWords) {
              setWords(result.sensitiveWords);
            }
          });
        } else {
          console.log('[Sensitive Words] Chrome storage not available, using defaults');
        }
      } catch (error) {
        console.error('[Sensitive Words] Error loading:', error);
      }
    };

    loadWords();
  }, []);

  const addWord = () => {
    const value = wordInput.trim();
    if (!value) {
      alert('Please enter a word');
      return;
    }

    // Check if already exists (case insensitive)
    if (words.some(w => w.toLowerCase() === value.toLowerCase())) {
      alert('This word is already in the list');
      return;
    }

    try {
      const newWords = [...words, value];

      // @ts-ignore - Chrome extension API
      chrome.storage.local.set({ sensitiveWords: newWords }, () => {
        console.log('[Sensitive Words] Added word:', value);
        setWords(newWords);
        setWordInput('');
      });
    } catch (error) {
      console.error('Error adding word:', error);
      alert('Error adding word');
    }
  };

  const removeWord = (index: number) => {
    try {
      const newWords = [...words];
      newWords.splice(index, 1);

      // @ts-ignore - Chrome extension API
      chrome.storage.local.set({ sensitiveWords: newWords }, () => {
        console.log('[Sensitive Words] Removed word at index:', index);
        setWords(newWords);
      });
    } catch (error) {
      console.error('Error removing word:', error);
      alert('Error removing word');
    }
  };

  const resetToDefaults = () => {
    if (!confirm('Reset to default sensitive words? This will remove all custom words.')) {
      return;
    }

    try {
      // @ts-ignore - Chrome extension API
      chrome.storage.local.set({ sensitiveWords: DEFAULT_WORDS }, () => {
        console.log('[Sensitive Words] Reset to defaults');
        setWords(DEFAULT_WORDS);
      });
    } catch (error) {
      console.error('Error resetting:', error);
      alert('Error resetting to defaults');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sensitive Words Management</h1>
        <p className="text-muted-foreground">
          Configure words that will be automatically redacted when agent mode (debugger) is detected.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          <strong>How Content Censoring Works:</strong> When an agent attaches the Chrome debugger to read a page,
          all text containing these sensitive words will be automatically replaced with <strong>[REDACTED]</strong>.
          The original text is restored when the agent stops reading.
        </AlertDescription>
      </Alert>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Active Words"
          value={words.length}
          icon={<ShieldAlertIcon className="h-4 w-4" />}
          description="Currently monitored"
        />
        <StatCard
          title="Default Words"
          value={DEFAULT_WORDS.length}
          variant="success"
          icon={<ShieldAlertIcon className="h-4 w-4" />}
          description="Built-in protection"
        />
      </div>

      {/* Sensitive Words Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sensitive Words</CardTitle>
          <CardDescription>
            Add words or phrases to protect (case insensitive)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              placeholder="Enter sensitive word or phrase (e.g., password, api_key)"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addWord()}
            />
            <Button onClick={addWord}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Word
            </Button>
          </div>

          <div className="space-y-2 mb-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : words.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No sensitive words configured. Using default words.</p>
            ) : (
              words.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <code className="text-sm text-green-600 dark:text-green-400">{word}</code>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeWord(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcwIcon className="mr-2 h-4 w-4" />
              Reset to Default Words
            </Button>
            <p className="text-xs text-muted-foreground">
              ⚠️ Case insensitive matching - "password" will match "Password", "PASSWORD", etc.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Default Words Info */}
      <Card>
        <CardHeader>
          <CardTitle>Default Sensitive Words</CardTitle>
          <CardDescription>
            These words are included by default
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_WORDS.map((word, index) => (
              <code key={index} className="px-2 py-1 bg-muted rounded text-sm">
                {word}
              </code>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
