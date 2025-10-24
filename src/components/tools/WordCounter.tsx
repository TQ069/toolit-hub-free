import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  averageWordsPerSentence: number;
}

export default function WordCounter() {
  const [text, setText] = useState('');

  const stats = useMemo((): TextStats => {
    if (!text) {
      return {
        words: 0,
        characters: 0,
        charactersNoSpaces: 0,
        lines: 0,
        paragraphs: 0,
        sentences: 0,
        averageWordsPerSentence: 0,
      };
    }

    // Character count
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Word count - split by whitespace and filter empty strings
    const wordArray = text.trim().split(/\s+/).filter(word => word.length > 0);
    const words = wordArray.length;

    // Line count - split by newlines
    const lines = text.split('\n').length;

    // Paragraph count - split by double newlines or more
    const paragraphs = text
      .split(/\n\s*\n/)
      .filter(para => para.trim().length > 0).length;

    // Sentence count - split by sentence-ending punctuation
    const sentenceArray = text
      .split(/[.!?]+/)
      .filter(sentence => sentence.trim().length > 0);
    const sentences = sentenceArray.length;

    // Average words per sentence
    const averageWordsPerSentence = sentences > 0 
      ? Math.round((words / sentences) * 10) / 10 
      : 0;

    return {
      words,
      characters,
      charactersNoSpaces,
      lines,
      paragraphs,
      sentences,
      averageWordsPerSentence,
    };
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    // Limit to 100,000 characters
    if (newText.length <= 100000) {
      setText(newText);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Word Counter</CardTitle>
          <CardDescription className="text-sm">
            Analyze text statistics including words, characters, lines, and more
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Text Input */}
          <div className="space-y-2">
            <Label htmlFor="text-input">Enter or paste your text</Label>
            <Textarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              placeholder="Start typing or paste your text here..."
              className="min-h-[200px] sm:min-h-[300px] font-mono text-sm"
              maxLength={100000}
              aria-describedby="char-count"
            />
            <p id="char-count" className="text-xs text-muted-foreground text-right">
              {stats.characters.toLocaleString()} / 100,000 characters
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              label="Words"
              value={stats.words.toLocaleString()}
              icon="📝"
            />
            <StatCard
              label="Characters"
              value={stats.characters.toLocaleString()}
              icon="🔤"
            />
            <StatCard
              label="Characters (no spaces)"
              value={stats.charactersNoSpaces.toLocaleString()}
              icon="📊"
            />
            <StatCard
              label="Lines"
              value={stats.lines.toLocaleString()}
              icon="📄"
            />
            <StatCard
              label="Paragraphs"
              value={stats.paragraphs.toLocaleString()}
              icon="¶"
            />
            <StatCard
              label="Sentences"
              value={stats.sentences.toLocaleString()}
              icon="💬"
            />
          </div>

          {/* Additional Stats */}
          {stats.sentences > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Average Words per Sentence</span>
                  <span className="text-2xl font-bold">{stats.averageWordsPerSentence}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl sm:text-2xl" aria-hidden="true">{icon}</span>
          <span className="text-2xl sm:text-3xl font-bold">{value}</span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
