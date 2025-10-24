import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function JsonBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Invalid JSON: ${e.message}`);
      } else {
        setError('Invalid JSON format');
      }
      setOutput('');
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Invalid JSON: ${e.message}`);
      } else {
        setError('Invalid JSON format');
      }
      setOutput('');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Limit to approximately 10MB (10 million characters)
    if (newValue.length <= 10000000) {
      setInput(newValue);
      setError('');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">JSON Beautifier</CardTitle>
          <CardDescription className="text-sm">
            Format, validate, and minify JSON data (supports up to 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleFormat} 
              disabled={!input}
              className="touch-manipulation min-h-[44px]"
              aria-label="Beautify JSON"
            >
              ✨ Beautify
            </Button>
            <Button 
              onClick={handleMinify} 
              variant="outline" 
              disabled={!input}
              className="touch-manipulation min-h-[44px]"
              aria-label="Minify JSON"
            >
              🗜️ Minify
            </Button>
            <Button 
              onClick={handleClear} 
              variant="outline" 
              disabled={!input && !output}
              className="touch-manipulation min-h-[44px]"
              aria-label="Clear all"
            >
              🗑️ Clear
            </Button>
            <Button 
              onClick={handleCopy} 
              variant="outline" 
              disabled={!output}
              className="sm:ml-auto touch-manipulation min-h-[44px]"
              aria-label={copied ? 'Output copied' : 'Copy output to clipboard'}
            >
              {copied ? '✓ Copied' : '📋 Copy Output'}
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div 
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md"
              role="alert"
              aria-live="polite"
            >
              <p className="text-sm text-red-600 dark:text-red-400 font-mono">{error}</p>
            </div>
          )}

          {/* Input/Output Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Input */}
            <div className="space-y-2">
              <Label htmlFor="json-input">Input JSON</Label>
              <Textarea
                id="json-input"
                value={input}
                onChange={handleInputChange}
                placeholder='{"name": "John", "age": 30}'
                className="min-h-[300px] sm:min-h-[400px] font-mono text-sm"
                aria-describedby="input-char-count"
              />
              <p id="input-char-count" className="text-xs text-muted-foreground">
                {input.length.toLocaleString()} characters
              </p>
            </div>

            {/* Output */}
            <div className="space-y-2">
              <Label htmlFor="json-output">Formatted Output</Label>
              <Textarea
                id="json-output"
                value={output}
                readOnly
                placeholder="Formatted JSON will appear here..."
                className="min-h-[300px] sm:min-h-[400px] font-mono text-sm bg-muted"
                aria-describedby="output-char-count"
              />
              <p id="output-char-count" className="text-xs text-muted-foreground">
                {output.length.toLocaleString()} characters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
