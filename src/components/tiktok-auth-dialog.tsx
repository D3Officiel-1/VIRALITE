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
    // Dans une vraie application, vous redirigeriez vers l'URL d'autorisation de TikTok.
    // Exemple: window.location.href = `https://www.tiktok.com/v2/auth/authorize?...`;
    // Pour cette démo, nous simulons la redirection et le retour réussi.
    setTimeout(() => {
        // Simule la redirection vers la page de connexion de TikTok
        console.log("Redirecting to TikTok for authentication...");
        // Simule le retour de TikTok après une authentification réussie
        setTimeout(() => {
            console.log("Authentication successful, redirecting to /home");
            router.push('/home');
            onOpenChange(false);
            setIsConnecting(false);
        }, 1000);
    }, 1500);
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
