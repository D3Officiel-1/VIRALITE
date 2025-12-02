'use client';

import { useState, useEffect, useCallback } from 'react';
import { getVideoStyleRecommendations } from '@/ai/flows/video-style-recommendations';
import type { VideoStyleRecommendationsOutput } from '@/ai/flows/video-style-recommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Film, Music, Sparkles, Paintbrush } from 'lucide-react';

type StyleRecommendationsProps = {
  topic: string;
  targetAudience: string;
};

export function StyleRecommendations({ topic, targetAudience }: StyleRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<VideoStyleRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = useCallback(async (currentTopic: string, audience: string) => {
    if (!currentTopic || !audience) return;
    setIsLoading(true);
    setRecommendations(null);
    try {
      const response = await getVideoStyleRecommendations({ topic: currentTopic, targetAudience: audience });
      setRecommendations(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations(topic, targetAudience);
  }, [topic, targetAudience, fetchRecommendations]);

  const renderList = (items: string[]) => (
    <ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
      {items.map((item, index) => <li key={index}>{item}</li>)}
    </ul>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    if (!recommendations) {
      return <p className="text-sm text-muted-foreground">Aucune recommandation de style disponible.</p>;
    }
    
    return (
      <div className="space-y-4">
         {recommendations.overallStyle && (
            <blockquote className="mt-2 border-l-2 pl-6 italic" style={{borderColor: 'hsl(var(--accent))'}}>"{recommendations.overallStyle}"</blockquote>
        )}
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base font-medium">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-primary" /> Techniques de Montage
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {renderList(recommendations.editingTechniques)}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base font-medium">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" /> Choix Musicaux
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {renderList(recommendations.musicChoices)}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Effets Visuels
                </div>
            </AccordionTrigger>
            <AccordionContent>
              {renderList(recommendations.visualEffects)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-xl">
          <Paintbrush className="h-5 w-5" />
          Conseils de Style Vidéo
        </CardTitle>
        <CardDescription>Augmentez l'engagement des spectateurs.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
