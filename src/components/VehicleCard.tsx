
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Car, Euro, Info, Clock, Fuel, Gauge } from "lucide-react";

interface VehicleCardProps {
  id: string;
  image: string;
  title: string;
  description: string;
  price?: string;
  year?: string;
  specs: {
    engine?: string;
    power?: string;
    acceleration?: string;
    consumption?: string;
  };
  availability?: "En stock" | "Sur commande" | "Vendu";
}

const VehicleCard = ({ 
  id, 
  image, 
  title, 
  description, 
  price, 
  year,
  specs, 
  availability = "En stock" 
}: VehicleCardProps) => {
  const getAvailabilityColor = () => {
    switch (availability) {
      case "En stock":
        return "bg-green-500 hover:bg-green-600";
      case "Sur commande":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Vendu":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-green-500 hover:bg-green-600";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {price && (
          <div className="absolute top-0 right-0 m-3">
            <Badge className="bg-mercedes-darkgray text-white px-3 py-1 text-sm font-semibold">
              <Euro className="w-4 h-4 mr-1" />
              {price}
            </Badge>
          </div>
        )}
        {availability !== "En stock" && (
          <div className="absolute top-0 left-0 m-3">
            <Badge className={`text-white px-3 py-1 text-sm font-semibold ${getAvailabilityColor()}`}>
              {availability}
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold font-serif">{title}</CardTitle>
          {year && (
            <Badge variant="outline" className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {year}
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 text-sm">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <Separator className="my-3" />
        <div className="grid grid-cols-2 gap-3">
          {specs.engine && (
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4 text-mercedes-darkblue" />
              <div>
                <p className="text-xs text-gray-500">Moteur</p>
                <p className="text-sm font-medium">{specs.engine}</p>
              </div>
            </div>
          )}
          
          {specs.power && (
            <div className="flex items-center space-x-2">
              <Gauge className="h-4 w-4 text-mercedes-darkblue" />
              <div>
                <p className="text-xs text-gray-500">Puissance</p>
                <p className="text-sm font-medium">{specs.power}</p>
              </div>
            </div>
          )}
          
          {specs.acceleration && (
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-mercedes-darkblue" />
              <div>
                <p className="text-xs text-gray-500">0-100 km/h</p>
                <p className="text-sm font-medium">{specs.acceleration}</p>
              </div>
            </div>
          )}
          
          {specs.consumption && (
            <div className="flex items-center space-x-2">
              <Fuel className="h-4 w-4 text-mercedes-darkblue" />
              <div>
                <p className="text-xs text-gray-500">Consommation</p>
                <p className="text-sm font-medium">{specs.consumption}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/vehicules/${id}`} className="w-full">
          <Button variant="default" className="w-full bg-mercedes-darkgray hover:bg-mercedes-black">
            Voir les détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default VehicleCard;
