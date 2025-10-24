import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { isValidUrl, normalizeUrl, copyToClipboard, formatUrlForDisplay, extractDomain } from '@/utils/urlShortener';
import { urlApi, ShortenUrlResponse } from '@/services/api/urlApi';

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<ShortenUrlResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [urlHistory, setUrlHistory] = useState<ShortenUrlResponse[]>([]);

  const handleShorten = async () => {
    setError('');
    setShortenedUrl(null);

    // Validate URL
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);

    try {
      const normalizedUrl = normalizeUrl(url);
      const result = await urlApi.shortenUrl({ originalUrl: normalizedUrl });
      setShortenedUrl(result);
      
      // Add to history
      setUrlHistory(prev => [result, ...prev]);
      
      // Clear input
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleShorten();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">URL Shortener</CardTitle>
          <CardDescription className="text-sm">
            Create shortened versions of long URLs for easy sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url-input">Enter URL to shorten</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com/very/long/url/path"
                className="flex-1"
                disabled={loading}
                aria-invalid={!!error}
                aria-describedby={error ? 'url-error' : undefined}
              />
              <Button
                onClick={handleShorten}
                disabled={loading || !url.trim()}
                className="shrink-0 w-full sm:w-auto touch-manipulation min-h-[44px]"
                aria-label={loading ? 'Shortening URL' : 'Shorten URL'}
              >
                {loading ? '⏳ Shortening...' : '🔗 Shorten'}
              </Button>
            </div>
            {error && (
              <p id="url-error" className="text-sm text-red-500" role="alert">{error}</p>
            )}
          </div>

          {/* Shortened URL Result */}
          {shortenedUrl && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Original URL</Label>
                  <p className="text-sm break-all">{formatUrlForDisplay(shortenedUrl.originalUrl, 80)}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Shortened URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={shortenedUrl.shortUrl}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      onClick={() => handleCopy(shortenedUrl.shortUrl)}
                      variant="outline"
                      className="shrink-0"
                    >
                      {copied ? '✓ Copied' : '📋 Copy'}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Short code: <span className="font-mono font-semibold">{shortenedUrl.shortCode}</span></span>
                  <span>Clicks: {shortenedUrl.clicks}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* URL History */}
          {urlHistory.length > 0 && (
            <div className="space-y-3">
              <Label>Recent URLs</Label>
              <div className="space-y-2">
                {urlHistory.slice(0, 5).map((item) => (
                  <Card key={item.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm font-medium truncate">
                            {extractDomain(item.originalUrl)}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.originalUrl}
                          </p>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {item.shortCode}
                            </code>
                            <span className="text-xs text-muted-foreground">
                              {item.clicks} clicks
                            </span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(item.shortUrl)}
                        >
                          📋
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Info Section */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="font-medium">ℹ️ How it works:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Enter any long URL to create a short, shareable link</li>
                  <li>Each shortened URL gets a unique 6-character code</li>
                  <li>Track click statistics for your shortened URLs</li>

                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
