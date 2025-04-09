
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SiteConfigType, saveSiteConfig, handleInputChange } from './settingsUtils';

interface SEOSettingsProps {
  config: SiteConfigType;
  onConfigUpdate: (newConfig: Partial<SiteConfigType>) => void;
}

export const SEOSettings: React.FC<SEOSettingsProps> = ({ config, onConfigUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section = 'seo', field?: string) => {
    const update = handleInputChange(e, config, section, field);
    onConfigUpdate(update);
  };

  const handleSave = async () => {
    await saveSiteConfig(config);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="seoTitle">Titre du site</Label>
            <Input
              id="seoTitle"
              value={config.seo?.title || ''}
              onChange={(e) => handleChange(e, 'seo', 'title')}
              placeholder="Titre du site (SEO)"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="seoDescription">Description</Label>
            <Textarea
              id="seoDescription"
              value={config.seo?.description || ''}
              onChange={(e) => handleChange(e, 'seo', 'description')}
              rows={3}
              placeholder="Description du site pour les moteurs de recherche"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="seoKeywords">Mots-clés</Label>
            <Input
              id="seoKeywords"
              value={config.seo?.keywords || ''}
              onChange={(e) => handleChange(e, 'seo', 'keywords')}
              placeholder="Mots-clés séparés par des virgules"
            />
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
