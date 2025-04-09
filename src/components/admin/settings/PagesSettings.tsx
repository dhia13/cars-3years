
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

  // Pages disponibles à éditer
  const availablePages = [
    { id: 'about', name: 'À propos' },
    { id: 'services', name: 'Services' },
    { id: 'privacy', name: 'Politique de confidentialité' },
    { id: 'terms', name: 'Conditions d\'utilisation' }
  ];

  const handlePageChange = (pageId: string) => {
    setSelectedPage(pageId);
    
    // Charger le contenu de la page sélectionnée
    const customPages = config.customPages || {};
    const page = customPages[pageId];
    
    if (page) {
      setPageTitle(page.title);
      setPageContent(page.content);
    } else {
      // Valeurs par défaut si la page n'existe pas encore
      setPageTitle(availablePages.find(p => p.id === pageId)?.name || '');
      setPageContent('');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
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
        
        onConfigUpdate({ customPages: updatedPages });
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Initialiser le contenu au chargement initial
  React.useEffect(() => {
    handlePageChange(selectedPage);
  }, [config.customPages]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
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
          
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
