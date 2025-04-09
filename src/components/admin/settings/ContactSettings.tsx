
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { SiteConfigType, handleInputChange, saveSiteConfig } from './settingsUtils';

interface ContactSettingsProps {
  config: SiteConfigType;
  onConfigUpdate: (newConfig: Partial<SiteConfigType>) => void;
}

export const ContactSettings: React.FC<ContactSettingsProps> = ({ config, onConfigUpdate }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section?: string, field?: string) => {
    const updatedConfig = handleInputChange(e, config, section, field);
    onConfigUpdate(updatedConfig);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const success = await saveSiteConfig(config);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Informations de contact mises à jour",
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
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de contact</CardTitle>
        <CardDescription>
          Modifiez les coordonnées affichées sur le site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={config.contactInfo.email}
              onChange={(e) => handleChange(e, 'contactInfo', 'email')}
              placeholder="contact@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={config.contactInfo.phone}
              onChange={(e) => handleChange(e, 'contactInfo', 'phone')}
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Textarea
            id="address"
            value={config.contactInfo.address}
            onChange={(e) => handleChange(e, 'contactInfo', 'address')}
            placeholder="123 rue exemple, 75000 Paris"
            rows={3}
          />
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
