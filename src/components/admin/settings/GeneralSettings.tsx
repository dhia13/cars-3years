
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Facebook, Instagram, Twitter } from 'lucide-react';
import { SiteConfigType, handleInputChange, saveSiteConfig } from './settingsUtils';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface GeneralSettingsProps {
  config: SiteConfigType;
  onConfigUpdate: (newConfig: Partial<SiteConfigType>) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ config, onConfigUpdate }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section?: string, field?: string) => {
    const updatedConfig = handleInputChange(e, config, section, field);
    onConfigUpdate(updatedConfig);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      console.log("Saving config:", config);
      const success = await saveSiteConfig(config);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Configuration générale mise à jour",
        });
      } else {
        throw new Error("Erreur lors de la sauvegarde");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications",
        variant: "destructive",
      });
      console.error("Error saving config:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres généraux</CardTitle>
        <CardDescription>
          Modifiez le texte principal et les informations sur la page d'accueil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="homeHeroText">Texte d'accueil</Label>
          <Textarea
            id="homeHeroText"
            name="homeHeroText"
            value={config.homeHeroText || ''}
            onChange={handleChange}
            rows={4}
            placeholder="Texte principal sur la page d'accueil"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Réseaux sociaux</Label>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="facebook" className="flex items-center">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  name="socialMedia.facebook"
                  value={config.socialMedia?.facebook || ''}
                  onChange={(e) => handleChange(e, 'socialMedia', 'facebook')}
                  placeholder="URL Facebook"
                />
              </div>
              <div>
                <Label htmlFor="instagram" className="flex items-center">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  name="socialMedia.instagram"
                  value={config.socialMedia?.instagram || ''}
                  onChange={(e) => handleChange(e, 'socialMedia', 'instagram')}
                  placeholder="URL Instagram"
                />
              </div>
              <div>
                <Label htmlFor="twitter" className="flex items-center">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Label>
                <Input
                  id="twitter"
                  name="socialMedia.twitter"
                  value={config.socialMedia?.twitter || ''}
                  onChange={(e) => handleChange(e, 'socialMedia', 'twitter')}
                  placeholder="URL Twitter"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Sauvegarde en cours..." : "Sauvegarder les modifications"}
        </Button>
      </CardFooter>
    </Card>
  );
};
