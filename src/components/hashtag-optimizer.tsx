'use client';

import { useState, useEffect, useCallback } from 'react';
import { optimizeHashtags } from '@/ai/flows/optimize-hashtags';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Hash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

type HashtagOptimizerProps = {
  topic: string;
};

export function HashtagOptimizer({ topic }: HashtagOptimizerProps) {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHashtags = useCallback(async (currentTopic: string) => {
    setIsLoading(true);
    setHashtags([]);
    try {
      const response = await optimizeHashtags({ videoTopic: currentTopic });
      setHashtags(response.hashtags || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (topic) {
      fetchHashtags(topic);
    }
  }, [topic, fetchHashtags]);

  const copyToClipboard = () => {
    const hashtagString = hashtags.map(h => `#${h}`).join(' ');
    navigator.clipboard.writeText(hashtagString);
    toast({
      title: "Copié !",
      description: "Les hashtags ont été copiés dans le presse-papiers.",
    })
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-xl">
          <Hash className="h-5 w-5" />
          Optimiseur de Hashtags
        </CardTitle>
        <CardDescription>Maximisez votre portée avec ces hashtags.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-md" />
            ))}
          </div>
        ) : hashtags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm border-primary/50 text-primary">
                #{tag}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Aucun hashtag suggéré.</p>
        )}
      </CardContent>
      {hashtags.length > 0 && !isLoading && (
        <CardFooter>
          <Button onClick={copyToClipboard} className="w-full" variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Copier les Hashtags
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
