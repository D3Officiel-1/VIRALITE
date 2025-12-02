'use client';

import { useState, useEffect, useCallback } from 'react';
import { identifyTrendingTopics } from '@/ai/flows/trending-topic-identification';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { TrendingTopics } from '@/components/trending-topics';
import { ContentSuggestions } from '@/components/content-suggestions';
import { HashtagOptimizer } from '@/components/hashtag-optimizer';
import { StyleRecommendations } from '@/components/style-recommendations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb } from 'lucide-react';

export function Dashboard() {
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [targetAudience, setTargetAudience] = useState<string>('Gen Z');

  const fetchTopics = useCallback(async () => {
    setIsLoadingTopics(true);
    setError(null);
    try {
      const response = await identifyTrendingTopics({ numberOfTopics: 10 });
      const topics = response.topics || [];
      setTrendingTopics(topics);
      if (topics.length > 0 && !selectedTopic) {
        setSelectedTopic(topics[0]);
      }
    } catch (e) {
      setError('Failed to fetch trending topics. Please try again later.');
      console.error(e);
    } finally {
      setIsLoadingTopics(false);
    }
  }, [selectedTopic]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  return (
    <div className="grid gap-8">
      <Card className="bg-card/80 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Lightbulb className="h-6 w-6" style={{color: 'hsl(var(--accent))'}} />
            Bienvenue sur TikTok Viral Visionnaire !
          </CardTitle>
          <CardDescription className="text-base">
            Votre assistant IA pour percer sur TikTok. Commencez par sélectionner un sujet tendance ou entrez votre propre audience pour obtenir des suggestions personnalisées.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sujets Tendances</h3>
            <TrendingTopics
              topics={trendingTopics}
              isLoading={isLoadingTopics}
              selectedTopic={selectedTopic}
              onSelectTopic={setSelectedTopic}
              onRefresh={fetchTopics}
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="audience" className="text-lg font-semibold">
              Audience Cible
            </Label>
            <Input
              id="audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Ex: Gamers, fashionistas, foodies..."
              className="bg-background text-base"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedTopic && (
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="lg:col-span-2 xl:col-span-2">
            <ContentSuggestions topic={selectedTopic} />
          </div>
          <div className="space-y-8">
            <HashtagOptimizer topic={selectedTopic} />
            <StyleRecommendations topic={selectedTopic} targetAudience={targetAudience} />
          </div>
        </div>
      )}
    </div>
  );
}
