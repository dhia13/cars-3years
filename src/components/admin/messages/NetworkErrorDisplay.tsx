
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { WifiOff, RefreshCw } from 'lucide-react';

interface NetworkErrorDisplayProps {
  onRetry: () => void;
}

const NetworkErrorDisplay = ({ onRetry }: NetworkErrorDisplayProps) => {
  return (
    <div className="text-center py-12">
      <Alert variant="destructive" className="mb-4">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Problème de connexion</AlertTitle>
        <AlertDescription>
          Impossible de se connecter au serveur. Veuillez vérifier que:
          <ul className="list-disc pl-4 mt-2">
            <li>Le serveur backend est en cours d'exécution</li>
            <li>L'URL du backend est correcte dans vos variables d'environnement</li>
            <li>Il n'y a pas de problèmes réseau</li>
            <li>Les clés d'API pour Cloudinary sont correctes dans le fichier .env du serveur</li>
          </ul>
        </AlertDescription>
      </Alert>
      <Button onClick={onRetry} className="mt-4">
        <RefreshCw className="mr-2 h-4 w-4" />
        Réessayer
      </Button>
    </div>
  );
};

export default NetworkErrorDisplay;
