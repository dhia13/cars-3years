
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Upload, X, Plus, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react';
import { vehiclesApi } from '@/services/api';
import { API_BASE_URL } from '@/services/api/apiUtils';

interface VehicleFormProps {
  mode?: 'create' | 'edit';
}

interface Vehicle {
  _id?: string;
  title: string;
  price: number;
  year: number;
  make: string;
  model: string;
  description: string;
  features: string[];
  specifications: {
    engine: string;
    transmission: string;
    mileage: number;
    fuelType: string;
    bodyType: string;
    color: string;
  };
  images: string[];
  featured: boolean;
  status: 'available' | 'sold' | 'reserved';
}

const emptyVehicle: Vehicle = {
  title: '',
  price: 0,
  year: new Date().getFullYear(),
  make: '',
  model: '',
  description: '',
  features: [],
  specifications: {
    engine: '',
    transmission: '',
    mileage: 0,
    fuelType: '',
    bodyType: '',
    color: '',
  },
  images: [],
  featured: false,
  status: 'available',
};

const fuelTypes = [
  'Essence',
  'Diesel',
  'Hybride',
  'Électrique',
  'GPL',
];

const bodyTypes = [
  'Berline',
  'SUV',
  'Break',
  'Coupé',
  'Cabriolet',
  'Monospace',
  'Citadine',
  'Utilitaire',
];

const VehicleForm: React.FC<VehicleFormProps> = ({ mode = 'create' }) => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle>(emptyVehicle);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (mode === 'edit' && id) {
      const fetchVehicle = async () => {
        try {
          setError(null);
          console.log(`Fetching vehicle with ID: ${id}`);
          const data = await vehiclesApi.getById(id);
          
          if (data.error) {
            throw new Error(data.message || 'Erreur lors de la récupération du véhicule');
          }
          
          console.log('Vehicle data received:', data);
          setVehicle(data);
        } catch (error) {
          console.error('Error fetching vehicle:', error);
          setError('Impossible de récupérer les détails du véhicule');
          toast({
            title: "Erreur",
            description: "Impossible de récupérer les détails du véhicule",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchVehicle();
    }
  }, [id, mode, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicle(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      }
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setVehicle(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      }
    }));
  };

  const handleStatusChange = (value: string) => {
    setVehicle(prev => ({
      ...prev,
      status: value as 'available' | 'sold' | 'reserved'
    }));
  };

  const handleFeaturedChange = (checked: boolean) => {
    setVehicle(prev => ({ ...prev, featured: checked }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setVehicle(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setVehicle(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    console.log(`Selected ${selectedFiles.length} files for upload:`, selectedFiles.map(f => f.name));
    
    setUploadLoading(true);
    setError(null);
    
    try {
      const result = await vehiclesApi.uploadImages(id || null, selectedFiles);
      
      if (result.error) {
        throw new Error(result.message || 'Erreur lors du téléchargement des images');
      }
      
      console.log('Image upload result:', result);
      
      if (result.images) {
        setVehicle(prev => ({
          ...prev,
          images: Array.isArray(result.images) ? result.images : prev.images
        }));
      } else if (Array.isArray(result)) {
        setVehicle(prev => ({
          ...prev,
          images: [...prev.images, ...result]
        }));
      } else if (result.url) {
        setVehicle(prev => ({
          ...prev,
          images: [...prev.images, result.url]
        }));
      }
      
      toast({
        title: "Succès",
        description: "Images téléchargées avec succès",
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Impossible de télécharger les images');
      toast({
        title: "Erreur",
        description: "Impossible de télécharger les images: " + (error instanceof Error ? error.message : "erreur inconnue"),
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setVehicle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    
    try {
      console.log('Submitting vehicle data:', vehicle);
      
      let result;
      if (mode === 'edit' && id) {
        result = await vehiclesApi.update(id, vehicle);
      } else {
        result = await vehiclesApi.create(vehicle);
      }
      
      if (result.error) {
        throw new Error(result.message || `Erreur lors de l'${mode === 'edit' ? 'édition' : 'ajout'} du véhicule`);
      }
      
      console.log('Save vehicle result:', result);
      
      toast({
        title: "Succès",
        description: `Véhicule ${mode === 'edit' ? 'modifié' : 'ajouté'} avec succès`,
      });
      
      navigate('/admin/vehicles');
    } catch (error) {
      console.error('Error saving vehicle:', error);
      setError(`Impossible de ${mode === 'edit' ? 'modifier' : 'ajouter'} le véhicule`);
      toast({
        title: "Erreur",
        description: `Impossible de ${mode === 'edit' ? 'modifier' : 'ajouter'} le véhicule: ` + 
          (error instanceof Error ? error.message : "erreur inconnue"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-primary mr-2" />
        <span>Chargement des données du véhicule...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/vehicles')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">
          {mode === 'edit' ? 'Modifier le véhicule' : 'Ajouter un véhicule'}
        </h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="specifications">Spécifications</TabsTrigger>
            <TabsTrigger value="features">Caractéristiques</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 p-4 border rounded-lg mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce</Label>
                <Input
                  id="title"
                  name="title"
                  value={vehicle.title}
                  onChange={handleInputChange}
                  placeholder="ex: BMW Série 3 320d Sport 2019"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={vehicle.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="make">Marque</Label>
                <Input
                  id="make"
                  name="make"
                  value={vehicle.make}
                  onChange={handleInputChange}
                  placeholder="ex: BMW"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Modèle</Label>
                <Input
                  id="model"
                  name="model"
                  value={vehicle.model}
                  onChange={handleInputChange}
                  placeholder="ex: Série 3"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Année</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={vehicle.year}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={vehicle.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible</SelectItem>
                    <SelectItem value="reserved">Réservé</SelectItem>
                    <SelectItem value="sold">Vendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={vehicle.description}
                  onChange={handleInputChange}
                  placeholder="Description détaillée du véhicule..."
                  rows={6}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={vehicle.featured} 
                  onCheckedChange={handleFeaturedChange} 
                />
                <Label htmlFor="featured">Véhicule à la une (affiché sur la page d'accueil)</Label>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="space-y-4 p-4 border rounded-lg mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="engine">Moteur</Label>
                <Input
                  id="engine"
                  name="engine"
                  value={vehicle.specifications.engine}
                  onChange={handleSpecChange}
                  placeholder="ex: 2.0L TDI"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Input
                  id="transmission"
                  name="transmission"
                  value={vehicle.specifications.transmission}
                  onChange={handleSpecChange}
                  placeholder="ex: Automatique"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mileage">Kilométrage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  value={vehicle.specifications.mileage}
                  onChange={handleSpecChange}
                  placeholder="ex: 45000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Type de carburant</Label>
                <Select 
                  value={vehicle.specifications.fuelType} 
                  onValueChange={(value) => handleSelectChange('fuelType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de carburant" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bodyType">Type de carrosserie</Label>
                <Select 
                  value={vehicle.specifications.bodyType} 
                  onValueChange={(value) => handleSelectChange('bodyType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de carrosserie" />
                  </SelectTrigger>
                  <SelectContent>
                    {bodyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Couleur</Label>
                <Input
                  id="color"
                  name="color"
                  value={vehicle.specifications.color}
                  onChange={handleSpecChange}
                  placeholder="ex: Noir"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4 p-4 border rounded-lg mt-4">
            <div className="flex items-end gap-2 mb-4">
              <div className="flex-1">
                <Label htmlFor="newFeature">Ajouter une caractéristique</Label>
                <Input
                  id="newFeature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="ex: Climatisation automatique"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
              </div>
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
            
            {vehicle.features.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Aucune caractéristique ajoutée
              </div>
            ) : (
              <div className="space-y-2">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>{feature}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="images" className="space-y-4 p-4 border rounded-lg mt-4">
            <div className="mb-4">
              <Input
                type="file"
                id="images-upload"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
              />
              <Button asChild disabled={uploadLoading}>
                <label htmlFor="images-upload">
                  {uploadLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Téléchargement en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Télécharger des images
                    </>
                  )}
                </label>
              </Button>
              <p className="text-sm text-muted-foreground mt-1">
                Vous pouvez sélectionner plusieurs images à la fois. Types de fichiers acceptés: JPG, PNG, WebP.
              </p>
            </div>
            
            {vehicle.images.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune image</h3>
                <p className="mt-1 text-sm text-gray-500">Commencez par télécharger des images pour ce véhicule.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {vehicle.images.map((image, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-square relative group">
                      <img
                        src={image.startsWith('http') ? image : `${API_BASE_URL}${image}`}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Vehicle image failed to load:', image);
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                          target.className = 'w-full h-full object-contain p-4 opacity-50';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/vehicles')}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving 
              ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : mode === 'edit' 
                ? 'Mettre à jour le véhicule' 
                : 'Ajouter le véhicule'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
