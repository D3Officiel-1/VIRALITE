'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

type TrendingTopicsProps = {
  topics: string[];
  isLoading: boolean;
  selectedTopic: string | null;
  onSelectTopic: (topic: string) => void;
  onRefresh: () => void;
};

export function TrendingTopics({
  topics,
  isLoading,
  selectedTopic,
  onSelectTopic,
  onRefresh,
}: TrendingTopicsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Cliquez sur un sujet pour commencer.</p>
        <Button variant="ghost" size="icon" onClick={onRefresh} aria-label="Rafraîchir les sujets">
          <RefreshCw className="h-4 w-4 animate-spin-slow" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))
        ) : (
          topics.map((topic) => (
            <Badge
              key={topic}
              onClick={() => onSelectTopic(topic)}
              className={cn(
                'cursor-pointer transition-all text-sm px-4 py-2 rounded-full border-2',
                selectedTopic === topic
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-transparent hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {topic}
            </Badge>
          ))
        )}
      </div>
    </div>
  );
}
