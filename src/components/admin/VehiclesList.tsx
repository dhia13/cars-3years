
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { vehiclesApi } from '@/services/api';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import VehicleItem from './VehicleItem';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  specifications?: {
    mileage: number;
  };
  status: 'available' | 'sold' | 'reserved';
  images: string[];
}

const VehiclesList = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vehiclesApi.getAll();
      
      if (data.error) {
        throw new Error(data.message || 'Erreur lors de la récupération des véhicules');
      }
      
      console.log('Fetched vehicles:', data);
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError('Impossible de récupérer les véhicules. Veuillez réessayer plus tard.');
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les véhicules",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const confirmDeleteVehicle = (id: string) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    
    try {
      const result = await vehiclesApi.delete(vehicleToDelete);
      
      if (result.error) {
        throw new Error(result.message || 'Erreur lors de la suppression');
      }
      
      setVehicles(vehicles.filter(vehicle => vehicle._id !== vehicleToDelete));
      toast({
        title: "Suppression réussie",
        description: "Le véhicule a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le véhicule",
        variant: "destructive",
      });
    } finally {
      setVehicleToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleAddVehicle = () => {
    navigate('/admin/vehicles/add');
  };

  const handleRefresh = () => {
    fetchVehicles();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Véhicules</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Chargement...' : 'Actualiser'}
          </Button>
          <Button onClick={handleAddVehicle}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un véhicule
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            Tous ({vehicles.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Disponibles ({vehicles.filter(v => v.status === 'available').length})
          </TabsTrigger>
          <TabsTrigger value="sold">
            Vendus ({vehicles.filter(v => v.status === 'sold').length})
          </TabsTrigger>
          <TabsTrigger value="reserved">
            Réservés ({vehicles.filter(v => v.status === 'reserved').length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <VehicleGrid 
            vehicles={vehicles} 
            isLoading={isLoading} 
            error={error}
            onDelete={confirmDeleteVehicle}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        
        <TabsContent value="available">
          <VehicleGrid 
            vehicles={vehicles.filter(v => v.status === 'available')} 
            isLoading={isLoading} 
            error={error}
            onDelete={confirmDeleteVehicle}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        
        <TabsContent value="sold">
          <VehicleGrid 
            vehicles={vehicles.filter(v => v.status === 'sold')} 
            isLoading={isLoading} 
            error={error}
            onDelete={confirmDeleteVehicle}
            onRefresh={handleRefresh}
          />
        </TabsContent>
        
        <TabsContent value="reserved">
          <VehicleGrid 
            vehicles={vehicles.filter(v => v.status === 'reserved')} 
            isLoading={isLoading} 
            error={error}
            onDelete={confirmDeleteVehicle}
            onRefresh={handleRefresh}
          />
        </TabsContent>
      </Tabs>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVehicle} className="bg-red-500 text-white">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface VehicleGridProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

const VehicleGrid: React.FC<VehicleGridProps> = ({ 
  vehicles, 
  isLoading, 
  error,
  onDelete,
  onRefresh
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12 border rounded-md mt-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
        <p>Chargement des véhicules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 border rounded-md mt-4">
        <p className="mb-4">{error}</p>
        <Button onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 border rounded-md mt-4">
        <p className="text-lg font-medium">Aucun véhicule trouvé</p>
        <p className="text-sm mb-4">Ajoutez des véhicules pour qu'ils apparaissent ici.</p>
        <Button onClick={onRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {vehicles.map((vehicle) => (
        <VehicleItem 
          key={vehicle._id} 
          vehicle={vehicle} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default VehiclesList;
