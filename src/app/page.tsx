'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clapperboard } from 'lucide-react';
import { TikTokAuthDialog } from '@/components/tiktok-auth-dialog';

export default function WelcomePage() {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
          <Clapperboard className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight font-headline">
            TikTok Viral Visionnaire
          </h1>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-4 text-center">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
            Bienvenue sur <span style={{color: 'hsl(var(--primary))'}}>TikTok Viral Visionnaire</span>
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Votre assistant IA pour percer sur TikTok. Analysez les tendances, générez des idées de contenu et optimisez vos hashtags pour devenir viral.
          </p>
        </div>
        <Button size="lg" className="text-lg" onClick={() => setIsAuthDialogOpen(true)}>
          Commencer
        </Button>
      </main>
      <TikTokAuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </div>
  );
}
