
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Upload, Loader2, AlertTriangle } from 'lucide-react';
import { SiteConfigType, saveSiteConfig, uploadVideo } from './settingsUtils';

interface VideoSettingsProps {
  config: SiteConfigType;
  onConfigUpdate: (newConfig: Partial<SiteConfigType>) => void;
}

export const VideoSettings: React.FC<VideoSettingsProps> = ({ config, onConfigUpdate }) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log('Selected video file:', file.name, file.size);
      setVideoFile(file);
      setError(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Upload video if one is selected
      if (videoFile) {
        console.log('Uploading video file:', videoFile.name);
        const videoUrl = await uploadVideo(videoFile);
        
        if (videoUrl) {
          console.log('Video uploaded successfully, URL:', videoUrl);
          // Update config with new video URL
          const updatedConfig = {
            ...config,
            videoUrl
          };
          
          onConfigUpdate({ videoUrl });
          
          const success = await saveSiteConfig(updatedConfig);
          
          if (success) {
            setVideoFile(null);
            toast({
              title: "Succès",
              description: "Vidéo mise à jour avec succès",
            });
          } else {
            throw new Error("Erreur lors de la sauvegarde");
          }
        } else {
          throw new Error("Erreur lors de l'upload de la vidéo");
        }
      } else if (config.videoUrl) {
        // Save config without changing video
        console.log('No new video selected, saving existing config');
        const success = await saveSiteConfig(config);
        
        if (success) {
          toast({
            title: "Succès",
            description: "Configuration vidéo mise à jour",
          });
        } else {
          throw new Error("Erreur lors de la sauvegarde");
        }
      } else {
        console.log('No video file selected and no existing video URL');
        toast({
          title: "Information",
          description: "Veuillez sélectionner une vidéo à télécharger",
        });
      }
    } catch (error) {
      console.error('Error saving video:', error);
      setError("Impossible de sauvegarder les modifications: " + (error instanceof Error ? error.message : "erreur inconnue"));
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les modifications: " + (error instanceof Error ? error.message : "erreur inconnue"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vidéo du site</CardTitle>
        <CardDescription>
          Changez la vidéo de présentation sur la page d'accueil
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {config.videoUrl && (
          <div className="mb-4 p-2 border rounded">
            <video
              controls
              className="w-full aspect-video"
              src={config.videoUrl}
              onError={(e) => {
                console.error('Video failed to load:', config.videoUrl);
                setError("Impossible de charger la vidéo actuelle. L'URL pourrait être invalide.");
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
              }}
            />
            <p className="text-sm text-slate-500 mt-2">URL actuelle: {config.videoUrl}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="video">Télécharger une nouvelle vidéo</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            disabled={isSaving}
          />
          <p className="text-sm text-muted-foreground">
            Formats acceptés: MP4, WebM, MOV. Taille maximale: 100MB
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave}
          disabled={isSaving && !videoFile}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Téléchargement en cours...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Télécharger et sauvegarder
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
