import { configApi, adminApi } from '@/services/api';

export interface SiteConfigType {
  homeHeroText: string;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    workingHours?: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  videoUrl: string;
  seo?: {
    title: string;
    description: string;
    keywords: string;
    ogImage?: string;
  };
  customPages?: Record<string, {
    title: string;
    content: string;
    lastUpdated: string;
  }>;
}

export const saveSiteConfig = async (config: SiteConfigType): Promise<boolean> => {
  try {
    console.log('Saving site config:', config);
    const result = await configApi.updateConfig(config);
    
    if (result.error) {
      console.error('Error response received:', result);
      throw new Error(result.message || 'Erreur lors de la sauvegarde de la configuration');
    }
    
    console.log('Site config saved successfully:', result);
    
    const { toast } = require('@/hooks/use-toast');
    toast({
      title: "Configuration sauvegardée",
      description: "Les modifications ont été enregistrées avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Error saving site config:', error);
    const { toast } = require('@/hooks/use-toast');
    toast({
      title: "Erreur",
      description: "Impossible de sauvegarder la configuration: " + (error instanceof Error ? error.message : "erreur inconnue"),
      variant: "destructive",
    });
    return false;
  }
};

export const uploadVideo = async (videoFile: File): Promise<string | null> => {
  try {
    console.log('Uploading video:', videoFile.name, 'Size:', videoFile.size);
    const result = await adminApi.uploadVideo(videoFile);
    
    if (result.error) {
      throw new Error(result.message || 'Erreur lors de l\'upload de la vidéo');
    }
    
    console.log('Video uploaded successfully:', result);
    const { toast } = require('@/hooks/use-toast');
    toast({
      title: "Vidéo uploadée",
      description: "La vidéo a été téléchargée avec succès.",
    });
    return result.videoUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    const { toast } = require('@/hooks/use-toast');
    toast({
      title: "Erreur",
      description: "Impossible de télécharger la vidéo: " + (error instanceof Error ? error.message : "erreur inconnue"),
      variant: "destructive",
    });
    return null;
  }
};

export const saveCustomPage = async (
  pageKey: string, 
  pageData: { title: string; content: string }
): Promise<boolean> => {
  try {
    console.log('Saving custom page:', pageKey, pageData);
    const result = await adminApi.saveCustomPage(pageKey, pageData);
    
    if (result.error) {
      throw new Error(result.message || 'Erreur lors de la sauvegarde de la page');
    }
    
    console.log('Custom page saved successfully:', result);
    
    const { toast } = require('@/hooks/use-toast');
    toast({
      title: "Page sauvegardée",
      description: "La page a été enregistrée avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Error saving custom page:', error);
    const { toast } = require('@/hooks/use-toast');
    toast({
      title: "Erreur",
      description: "Impossible de sauvegarder la page: " + (error instanceof Error ? error.message : "erreur inconnue"),
      variant: "destructive",
    });
    return false;
  }
};

export const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  config: SiteConfigType,
  section?: string,
  field?: string
): Partial<SiteConfigType> => {
  const { name, value } = e.target;
  console.log('Input change:', section, field, name, value);
  
  const newConfig = JSON.parse(JSON.stringify(config));
  
  if (section && field) {
    if (!newConfig[section]) {
      newConfig[section] = {};
    }
    
    newConfig[section][field] = value;
    console.log('Updated config section:', section, field, newConfig[section]);
  } else if (name) {
    newConfig[name] = value;
  }
  
  console.log('Returning updated config:', newConfig);
  return newConfig;
};
