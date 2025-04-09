
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { API_BASE_URL } from '@/services/api';
import { SiteConfigType, saveCustomPage } from './settings/settingsUtils';

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
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/admin/site-config`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la configuration');
        }
        
        const data = await response.json();
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
        
        setPages(pagesData);
        
        // Initialiser avec la première page
        const firstPage = pagesData.find(p => p.key === 'about') || pagesData[0];
        if (firstPage) {
          setSelectedPage(firstPage.key);
          setPageTitle(firstPage.title);
          setPageContent(firstPage.content);
          setPreview(firstPage.content);
        }
      } catch (error) {
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
    
    try {
      const success = await saveCustomPage(selectedPage, {
        title: pageTitle,
        content: pageContent
      });
      
      if (success) {
        // Mettre à jour l'état local
        const updatedPages = pages.map(page => 
          page.key === selectedPage 
            ? { ...page, title: pageTitle, content: pageContent, lastUpdated: new Date().toISOString() }
            : page
        );
        
        setPages(updatedPages);
        setPreview(pageContent);
        
        toast({
          title: "Succès",
          description: "La page a été enregistrée avec succès",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Éditeur de pages</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <TabsTrigger value="preview" className="flex-1" onClick={handlePreview}>Aperçu</TabsTrigger>
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
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                  </div>
                </div>
              </CardContent>
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
