
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Pencil, Trash, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  specifications?: {
    mileage?: number;
    engine?: string;
    transmission?: string;
    color?: string;
  };
  status: 'available' | 'sold' | 'reserved';
}

interface VehicleItemProps {
  vehicle: Vehicle;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'available':
      return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'sold':
      return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'reserved':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available':
      return 'Disponible';
    case 'sold':
      return 'Vendu';
    case 'reserved':
      return 'Réservé';
    default:
      return status;
  }
};

const VehicleItem: React.FC<VehicleItemProps> = ({ vehicle, onDelete }) => {
  const navigate = useNavigate();
  const { _id, make, model, year, price, images, specifications, status } = vehicle;
  
  const handleEdit = () => navigate(`/admin/vehicles/edit/${_id}`);
  const handleView = () => window.open(`/vehicules/${_id}`, '_blank');
  
  // Format price to French format
  const formattedPrice = price?.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }) || 'N/A';
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {images && images.length > 0 ? (
          <img 
            src={images[0].startsWith('http') ? images[0] : `${import.meta.env.VITE_API_URL}${images[0]}`}
            alt={`${make} ${model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-car.png';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <Car size={64} className="text-gray-400" />
          </div>
        )}
        <Badge className={`absolute top-2 right-2 ${getStatusColor(status)}`}>
          {getStatusLabel(status)}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{make} {model}</h3>
            <p className="text-gray-600">{year}</p>
          </div>
          <div className="text-lg font-bold">{formattedPrice}</div>
        </div>
        
        <div className="text-sm text-gray-500 mb-3">
          {specifications?.mileage && (
            <span className="mr-3">{specifications.mileage.toLocaleString('fr-FR')} km</span>
          )}
          {specifications?.transmission && (
            <span className="mr-3">{specifications.transmission}</span>
          )}
          {specifications?.engine && (
            <span>{specifications.engine}</span>
          )}
        </div>
        
        <div className="flex space-x-2 mt-2">
          <Button size="sm" variant="outline" onClick={handleView}>
            <Eye className="h-4 w-4 mr-1" /> Voir
          </Button>
          <Button size="sm" variant="outline" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-1" /> Éditer
          </Button>
          <Button size="sm" variant="outline" className="text-red-500" onClick={() => onDelete(_id)}>
            <Trash className="h-4 w-4 mr-1" /> Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleItem;
