import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { mediaApi } from '@/services/api';
import { Trash2, Upload, RefreshCw, AlertTriangle } from 'lucide-react';

interface MediaFile {
  filename: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  cloudinary_id: string;
}

const MediaManager = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<MediaFile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    testCloudinaryConnection();
    fetchMediaFiles();
  }, []);

  const testCloudinaryConnection = async () => {
    setConnectionStatus('checking');
    try {
      const result = await mediaApi.testCloudinaryConnection();
      if (result.error) {
        console.error('Cloudinary connection error:', result);
        setConnectionStatus('error');
        toast({
          title: "Erreur de connexion à Cloudinary",
          description: result.message || "Impossible de se connecter à Cloudinary. Vérifiez les clés d'API dans le fichier .env du serveur.",
          variant: "destructive",
        });
      } else {
        setConnectionStatus('connected');
        toast({
          title: "Connecté à Cloudinary",
          description: "La connexion avec Cloudinary est établie",
        });
      }
    } catch (error) {
      console.error('Error testing Cloudinary connection:', error);
      setConnectionStatus('error');
      toast({
        title: "Erreur de connexion",
        description: "Impossible de tester la connexion à Cloudinary. Vérifiez que le serveur est en cours d'exécution.",
        variant: "destructive",
      });
    }
  };

  const fetchMediaFiles = async () => {
    setIsLoading(true);
    try {
      const data = await mediaApi.getAll();
      if (data.error) {
        console.error('Error fetching media files:', data);
        toast({
          title: "Erreur",
          description: data.message || "Impossible de récupérer les médias. Vérifiez la connexion à Cloudinary.",
          variant: "destructive",
        });
      } else {
        setMediaFiles(data || []);
      }
    } catch (error) {
      console.error('Error in fetchMediaFiles:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les médias. Vérifiez que le serveur est en cours d'exécution.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const result = await mediaApi.upload(selectedFile);
      clearInterval(progressInterval);
      
      if (result.error) {
        setUploadProgress(0);
        toast({
          title: "Échec de l'upload",
          description: result.message || "Impossible d'uploader le fichier",
          variant: "destructive",
        });
      } else {
        setUploadProgress(100);
        toast({
          title: "Succès",
          description: "Fichier uploadé avec succès",
        });
        
        setTimeout(() => {
          setSelectedFile(null);
          setUploadProgress(0);
          fetchMediaFiles();
        }, 1000);
      }
    } catch (error) {
      setUploadProgress(0);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant l'upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDelete = (file: MediaFile) => {
    setFileToDelete(file);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    
    setShowDeleteDialog(false);
    
    try {
      const result = await mediaApi.delete(fileToDelete.filename);
      
      if (result.error) {
        toast({
          title: "Échec de la suppression",
          description: result.message || "Impossible de supprimer le fichier",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Succès",
          description: "Fichier supprimé avec succès",
        });
        
        setMediaFiles(mediaFiles.filter(file => file.filename !== fileToDelete.filename));
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue pendant la suppression",
        variant: "destructive",
      });
    }
    
    setFileToDelete(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestionnaire de médias</h2>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={testCloudinaryConnection}
            disabled={connectionStatus === 'checking'}
          >
            {connectionStatus === 'checking' ? (
              <div className="animate-spin mr-2"><RefreshCw size={16} /></div>
            ) : connectionStatus === 'connected' ? (
              <div className="text-green-500 mr-2">✓</div>
            ) : (
              <AlertTriangle size={16} className="text-red-500 mr-2" />
            )}
            Tester Cloudinary
          </Button>
          
          <Button 
            variant="outline"
            onClick={fetchMediaFiles}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Chargement...' : 'Actualiser'}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={isUploading || connectionStatus === 'error'}
                className="flex-1 p-2 border border-gray-300 rounded"
              />
              <Button 
                onClick={handleUpload} 
                disabled={!selectedFile || isUploading || connectionStatus === 'error'}
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? `Upload ${uploadProgress}%` : 'Upload'}
              </Button>
            </div>
            
            {isUploading && (
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            
            {connectionStatus === 'error' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreur de connexion à Cloudinary</AlertTitle>
                <AlertDescription>
                  Impossible de se connecter à Cloudinary. Veuillez vérifier les clés d'API dans le fichier .env du serveur.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin">
            <RefreshCw size={24} />
          </div>
          <span className="ml-2">Chargement des médias...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mediaFiles.length > 0 ? (
            mediaFiles.map((file) => (
              <Card key={file.cloudinary_id || file.filename} className="overflow-hidden">
                <div className="aspect-square relative overflow-hidden bg-gray-100 group">
                  {file.type.startsWith('image') ? (
                    <img 
                      src={file.url} 
                      alt={file.filename}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <p className="text-gray-500">{file.type}</p>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => confirmDelete(file)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate" title={file.filename}>
                    {file.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : connectionStatus === 'error' ? (
            <div className="col-span-full text-center p-8 border border-dashed rounded-md">
              <AlertTriangle className="mx-auto h-10 w-10 text-amber-500 mb-2" />
              <h3 className="text-lg font-semibold">Impossible de se connecter à Cloudinary</h3>
              <p className="text-sm text-gray-500 mt-1">
                Vérifiez votre configuration Cloudinary dans le fichier .env du serveur:
              </p>
              <ul className="list-disc pl-8 mt-2 text-sm text-gray-500 text-left max-w-md mx-auto">
                <li>CLOUDINARY_CLOUD_NAME doit être défini avec votre nom de cloud</li>
                <li>CLOUDINARY_API_KEY doit être défini avec votre clé API</li>
                <li>CLOUDINARY_API_SECRET doit être défini avec votre secret API</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                Après avoir mis à jour ces valeurs, redémarrez le serveur et rafraîchissez cette page.
              </p>
            </div>
          ) : (
            <div className="col-span-full text-center p-8 border border-dashed rounded-md">
              <p className="text-gray-500">Aucun média disponible</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <p>
            Êtes-vous sûr de vouloir supprimer le fichier "{fileToDelete?.filename}" ?
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaManager;
