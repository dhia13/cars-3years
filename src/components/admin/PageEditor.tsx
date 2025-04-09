
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { adminApi } from '@/services/api';
import { Loader2, Save, Eye, AlertTriangle } from 'lucide-react';
import { SiteConfigType } from './settings/settingsUtils';

interface PageData {
  key: string;
  title: string;
  content: string;
  lastUpdated?: string;
}

const PageEditor = () => {
  const [config, setConfig] = useState<SiteConfigType | null>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [selectedPage, setSelectedPage] = useState<string>('about');
  const [pageTitle, setPageTitle] = useState<string>('');
  const [pageContent, setPageContent] = useState<string>('');
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Définition des pages disponibles
  const availablePages = [
    { key: 'about', name: 'À propos' },
    { key: 'services', name: 'Services' },
    { key: 'privacy', name: 'Politique de confidentialité' },
    { key: 'terms', name: 'Conditions d\'utilisation' }
  ];

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching site config for PageEditor');
        const data = await adminApi.getSiteConfig();
        
        if (data.error) {
          throw new Error(data.message || 'Erreur lors de la récupération de la configuration');
        }
        
        console.log('Received site config for PageEditor:', data);
        setConfig(data);
        
        // Initialiser la liste des pages
        const customPages = data.customPages || {};
        const pagesData: PageData[] = [];
        
        availablePages.forEach(page => {
          const existingPage = customPages[page.key];
          pagesData.push({
            key: page.key,
            title: existingPage?.title || page.name,
            content: existingPage?.content || '',
            lastUpdated: existingPage?.lastUpdated
          });
        });
        
        console.log('Initialized pages data:', pagesData);
        setPages(pagesData);
        
        // Initialiser avec la première page
        const firstPage = pagesData.find(p => p.key === 'about') || pagesData[0];
        if (firstPage) {
          setSelectedPage(firstPage.key);
          setPageTitle(firstPage.title);
          setPageContent(firstPage.content);
          setPreview(firstPage.content);
          console.log('Selected initial page:', firstPage);
        }
      } catch (error) {
        console.error('Error fetching site config:', error);
        setError('Impossible de récupérer les données des pages. Veuillez rafraîchir la page et réessayer.');
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données des pages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [toast]);

  const handlePageSelect = (pageKey: string) => {
    const page = pages.find(p => p.key === pageKey);
    if (page) {
      console.log('Selected page:', page);
      setSelectedPage(page.key);
      setPageTitle(page.title);
      setPageContent(page.content);
      setPreview(page.content);
    }
  };

  const handlePreview = () => {
    setPreview(pageContent);
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
      console.log('Saving page data:', { key: selectedPage, title: pageTitle, content: pageContent });
      const result = await adminApi.saveCustomPage(selectedPage, {
        title: pageTitle,
        content: pageContent
      });
      
      if (result.error) {
        throw new Error(result.message || 'Erreur lors de la sauvegarde de la page');
      }
      
      console.log('Save custom page response:', result);
      
      // Mettre à jour l'état local
      const updatedPages = pages.map(page => 
        page.key === selectedPage 
          ? { ...page, title: pageTitle, content: pageContent, lastUpdated: new Date().toISOString() }
          : page
      );
      
      setPages(updatedPages);
      setPreview(pageContent);
      
      // Mettre à jour également la configuration localement
      if (config) {
        const updatedConfig = {
          ...config,
          customPages: {
            ...(config.customPages || {}),
            [selectedPage]: {
              title: pageTitle,
              content: pageContent,
              lastUpdated: new Date().toISOString()
            }
          }
        };
        setConfig(updatedConfig);
      }
      
      toast({
        title: "Succès",
        description: "La page a été enregistrée avec succès",
      });
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Éditeur de pages</h1>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const currentPage = pages.find(p => p.key === selectedPage);
  const formattedDate = currentPage?.lastUpdated 
    ? new Date(currentPage.lastUpdated).toLocaleDateString('fr-FR', { 
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      }) 
    : null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Éditeur de pages</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sélectionner une page</CardTitle>
            <CardDescription>
              Choisissez la page que vous souhaitez modifier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pages.map(page => (
                <Button 
                  key={page.key}
                  variant={page.key === selectedPage ? "default" : "outline"}
                  onClick={() => handlePageSelect(page.key)}
                >
                  {page.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="edit">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="edit" className="flex-1">Éditer</TabsTrigger>
            <TabsTrigger value="preview" className="flex-1" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Aperçu
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Éditer {currentPage?.title}</CardTitle>
                {formattedDate && (
                  <CardDescription>
                    Dernière modification: {formattedDate}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                      rows={15}
                      placeholder="Contenu de la page (HTML supporté)"
                      className="font-mono text-sm"
                    />
                  </div>
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
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu: {pageTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 min-h-[300px] bg-white">
                  {preview ? (
                    <div dangerouslySetInnerHTML={{ __html: preview }} />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      Aucun contenu à afficher. Commencez à éditer la page.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PageEditor;
