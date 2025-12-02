
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type TikTokAuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TikTokAuthDialog({ open, onOpenChange }: TikTokAuthDialogProps) {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Redirect to our server-side auth route
    window.location.href = '/api/tiktok/auth';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Connecter votre compte TikTok</DialogTitle>
          <DialogDescription>
            Pour continuer, veuillez lier votre compte TikTok. Cela nous permettra d'analyser vos données et de vous fournir des recommandations personnalisées.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-sm text-center text-muted-foreground">
                Vous serez redirigé vers TikTok pour autoriser l'accès.
            </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isConnecting}>
            Annuler
          </Button>
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              'Se connecter avec TikTok'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
