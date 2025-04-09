
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GeneralSettings } from './settings/GeneralSettings';
import { ContactSettings } from './settings/ContactSettings';
import { VideoSettings } from './settings/VideoSettings';
import { SEOSettings } from './settings/SEOSettings';
import { PagesSettings } from './settings/PagesSettings';
import { configApi } from '@/services/api';
import { SiteConfigType } from './settings/settingsUtils';
import { Loader2 } from 'lucide-react';

const defaultConfig: SiteConfigType = {
  homeHeroText: '',
  contactInfo: {
    email: '',
    phone: '',
    address: '',
    workingHours: '',
  },
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
  },
  videoUrl: '',
  seo: {
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
  },
  customPages: {},
};

const SiteSettings = () => {
  const [config, setConfig] = useState<SiteConfigType>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching site configuration...');
        const data = await configApi.getConfig();
        
        if (data.error) {
          console.error('Error data received:', data);
          throw new Error(data.message || 'Erreur lors de la récupération de la configuration');
        }
        
        console.log('Received site configuration:', data);
        
        // Ensure all required properties exist
        const completeConfig = {
          ...defaultConfig,
          ...data,
          contactInfo: {
            ...defaultConfig.contactInfo,
            ...(data.contactInfo || {}),
          },
          socialMedia: {
            ...defaultConfig.socialMedia,
            ...(data.socialMedia || {}),
          },
          seo: {
            ...defaultConfig.seo,
            ...(data.seo || {}),
          },
          customPages: {
            ...(data.customPages || {}),
          },
        };
        
        setConfig(completeConfig);
      } catch (error) {
        console.error('Error fetching site config:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer la configuration du site",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [toast]);

  const handleConfigUpdate = (newConfig: Partial<SiteConfigType>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
    console.log('Updated config:', {...config, ...newConfig});
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Configuration du site</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="video">Vidéo</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <GeneralSettings 
            config={config} 
            onConfigUpdate={handleConfigUpdate} 
          />
        </TabsContent>
        
        <TabsContent value="contact" className="mt-4">
          <ContactSettings 
            config={config} 
            onConfigUpdate={handleConfigUpdate} 
          />
        </TabsContent>
        
        <TabsContent value="video" className="mt-4">
          <VideoSettings 
            config={config} 
            onConfigUpdate={handleConfigUpdate} 
          />
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <SEOSettings 
            config={config} 
            onConfigUpdate={handleConfigUpdate} 
          />
        </TabsContent>

        <TabsContent value="pages" className="mt-4">
          <PagesSettings 
            config={config} 
            onConfigUpdate={handleConfigUpdate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettings;
