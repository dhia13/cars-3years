
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, AlertTriangle } from 'lucide-react';
import { SiteConfigType, saveCustomPage } from './settingsUtils';

interface PagesSettingsProps {
  config: SiteConfigType;
  onConfigUpdate: (newConfig: Partial<SiteConfigType>) => void;
}

export const PagesSettings: React.FC<PagesSettingsProps> = ({ config, onConfigUpdate }) => {
  const [selectedPage, setSelectedPage] = useState<string>('about');
  const [pageTitle, setPageTitle] = useState<string>('');
  const [pageContent, setPageContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Pages disponibles à éditer
  const availablePages = [
    { id: 'about', name: 'À propos' },
    { id: 'services', name: 'Services' },
    { id: 'privacy', name: 'Politique de confidentialité' },
    { id: 'terms', name: 'Conditions d\'utilisation' }
  ];

  const handlePageChange = (pageId: string) => {
    setSelectedPage(pageId);
    loadPageContent(pageId);
  };

  const loadPageContent = (pageId: string) => {
    setError(null);
    // Charger le contenu de la page sélectionnée
    const customPages = config.customPages || {};
    const page = customPages[pageId];
    
    if (page) {
      console.log(`Loading page content for ${pageId}:`, page);
      setPageTitle(page.title);
      setPageContent(page.content);
    } else {
      // Valeurs par défaut si la page n'existe pas encore
      const defaultTitle = availablePages.find(p => p.id === pageId)?.name || '';
      console.log(`No existing page found for ${pageId}, using default title:`, defaultTitle);
      setPageTitle(defaultTitle);
      setPageContent('');
    }
  };

  const handleSave = async () => {
    if (!pageTitle.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de la page ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    setError(null);
    
    try {
      console.log(`Saving page ${selectedPage}:`, { title: pageTitle, content: pageContent });
      // Sauvegarder la page
      const success = await saveCustomPage(selectedPage, {
        title: pageTitle,
        content: pageContent
      });
      
      if (success) {
        // Mettre à jour l'état local
        const updatedPages = {
          ...(config.customPages || {}),
          [selectedPage]: {
            title: pageTitle,
            content: pageContent,
            lastUpdated: new Date().toISOString()
          }
        };
        
        console.log('Updated pages:', updatedPages);
        onConfigUpdate({ customPages: updatedPages });

        toast({
          title: "Succès",
          description: "Page sauvegardée avec succès",
        });
      } else {
        throw new Error("Erreur lors de la sauvegarde de la page");
      }
    } catch (error) {
      console.error('Error saving page:', error);
      setError('Impossible de sauvegarder la page. Veuillez réessayer.');
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la page: " + (error instanceof Error ? error.message : "erreur inconnue"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Initialiser le contenu au chargement initial
  useEffect(() => {
    loadPageContent(selectedPage);
  }, [config.customPages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des pages personnalisées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="pageName">Sélectionner une page</Label>
          <Select value={selectedPage} onValueChange={handlePageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une page" />
            </SelectTrigger>
            <SelectContent>
              {availablePages.map(page => (
                <SelectItem key={page.id} value={page.id}>
                  {page.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="pageTitle">Titre de la page</Label>
          <Input
            id="pageTitle"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            placeholder="Titre de la page"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="pageContent">Contenu</Label>
          <Textarea
            id="pageContent"
            value={pageContent}
            onChange={(e) => setPageContent(e.target.value)}
            rows={10}
            placeholder="Contenu de la page (HTML supporté)"
            className="font-mono text-sm"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
