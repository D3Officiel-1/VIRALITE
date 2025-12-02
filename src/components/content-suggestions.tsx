'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateContentSuggestions } from '@/ai/flows/generate-content-suggestions';
import type { GenerateContentSuggestionsOutput } from '@/ai/flows/generate-content-suggestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Wand2 } from 'lucide-react';

type ContentSuggestionsProps = {
  topic: string;
};

export function ContentSuggestions({ topic }: ContentSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<GenerateContentSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down' | null>>({});

  const fetchSuggestions = useCallback(async (currentTopic: string) => {
    setIsLoading(true);
    setSuggestions(null);
    setFeedback({});
    try {
      const response = await generateContentSuggestions({ trendingTopic: currentTopic });
      setSuggestions(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (topic) {
      fetchSuggestions(topic);
    }
  }, [topic, fetchSuggestions]);

  const handleFeedback = (id: string, vote: 'up' | 'down') => {
    setFeedback(prev => ({
      ...prev,
      [id]: prev[id] === vote ? null : vote,
    }));
  };

  const renderSuggestionList = (items: string[], type: 'idea' | 'script') => (
    <ul className="space-y-6">
      {items.map((item, index) => {
        const id = `${type}-${index}`;
        return (
          <li key={id} className="group flex items-start gap-4">
            <div className="mt-1 flex-shrink-0" style={{color: 'hsl(var(--accent))'}}>
              <Wand2 className="h-5 w-5" />
            </div>
            <div className="flex-grow">
              <p className="text-card-foreground">{item}</p>
              <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-7 w-7 rounded-full ${feedback[id] === 'up' ? 'text-primary bg-primary/10' : ''}`}
                  onClick={() => handleFeedback(id, 'up')}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-7 w-7 rounded-full ${feedback[id] === 'down' ? 'text-destructive bg-destructive/10' : ''}`}
                  onClick={() => handleFeedback(id, 'down')}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Card className="h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Suggestions de Contenu</CardTitle>
        <CardDescription>Idées et scripts pour votre prochaine vidéo virale.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ) : suggestions && suggestions.contentIdeas.length > 0 ? (
          <div className="space-y-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Idées de Contenu</h4>
              {renderSuggestionList(suggestions.contentIdeas, 'idea')}
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Suggestions de Script</h4>
              {renderSuggestionList(suggestions.videoScriptSuggestions, 'script')}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">Aucune suggestion disponible pour ce sujet.</p>
        )}
      </CardContent>
    </Card>
  );
}
