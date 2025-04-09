
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, Euro, Fuel, Gauge, Info, Share2, ShieldCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useToast } from "@/hooks/use-toast";
import { vehiclesApi } from "@/services/api";

interface VehicleSpecs {
  engine: string;
  transmission: string;
  mileage: number;
  fuelType: string;
  bodyType: string;
  color: string;
}

interface Vehicle {
  _id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  make: string;
  model: string;
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  specifications: VehicleSpecs;
  features: string[];
}

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!id) {
      setError("ID de véhicule manquant");
      setIsLoading(false);
      return;
    }
    
    const fetchVehicleDetails = async () => {
      try {
        setIsLoading(true);
        const data = await vehiclesApi.getById(id);
        console.log('Vehicle details:', data);
        
        if (!data || data.error) {
          throw new Error(data?.message || "Erreur lors du chargement du véhicule");
        }
        
        setVehicle(data);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
        setError("Véhicule non trouvé");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicleDetails();
  }, [id]);
  
  // Helper to get API URL for images
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${imagePath}`;
  };
  
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-32 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="ml-3">Chargement...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !vehicle) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-bold">Véhicule non trouvé</h1>
          <p className="mt-4">{error || "Le véhicule que vous recherchez n'existe pas."}</p>
          <Button 
            className="mt-8 bg-mercedes-blue"
            onClick={() => navigate('/vehicules')}
          >
            Retour aux véhicules
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  const getAvailabilityColor = () => {
    switch (vehicle.status) {
      case "available":
        return "bg-green-500 hover:bg-green-600";
      case "reserved":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "sold":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-green-500 hover:bg-green-600";
    }
  };
  
  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available':
        return 'En stock';
      case 'sold':
        return 'Vendu';
      case 'reserved':
        return 'Sur commande';
      default:
        return status;
    }
  };
  
  const handleReserve = () => {
    navigate(`/contact?vehicule=${vehicle._id}&titre=${encodeURIComponent(vehicle.title)}`);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Lien copié!",
          description: "Le lien de la fiche a été copié dans le presse-papier.",
          duration: 3000,
        });
      })
      .catch(() => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien. Veuillez réessayer.",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  return (
    <>
      <Navbar />
      
      <main className="pb-16">
        <section className="pt-24 pb-16 bg-gradient-to-b from-mercedes-black to-mercedes-darkgray text-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-center">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-white/80 max-w-3xl mx-auto text-center text-lg mb-6">
                {vehicle.description}
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge className="bg-mercedes-darkgray text-white px-3 py-1 text-sm font-semibold">
                  <Euro className="w-4 h-4 mr-1" />
                  {vehicle.price} €
                </Badge>
                <Badge variant="outline" className="text-white border-white px-3 py-1 text-sm font-semibold">
                  <Calendar className="w-4 h-4 mr-1" />
                  {vehicle.year}
                </Badge>
                <Badge className={`px-3 py-1 text-sm font-semibold text-white ${getAvailabilityColor()}`}>
                  {getAvailabilityText(vehicle.status)}
                </Badge>
              </div>
            </ScrollReveal>
          </div>
        </section>
        
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-3/5">
                <ScrollReveal>
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={getImageUrl(vehicle.images[0])} 
                        alt={`${vehicle.make} ${vehicle.model}`} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-12 flex items-center justify-center">
                      <Car className="w-24 h-24 text-gray-300" />
                    </div>
                  )}
                  
                  <div className="mt-8">
                    <h2 className="text-2xl font-serif font-bold mb-4">Description</h2>
                    <p className="text-gray-700 leading-relaxed">
                      {vehicle.description}
                    </p>
                  </div>
                  
                  {vehicle.features && vehicle.features.length > 0 && (
                    <div className="mt-8">
                      <h2 className="text-2xl font-serif font-bold mb-4">Caractéristiques principales</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {vehicle.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <ShieldCheck className="h-5 w-5 text-mercedes-blue mr-2" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ScrollReveal>
              </div>
              
              <div className="lg:w-2/5">
                <ScrollReveal delay={100}>
                  <Card className="shadow-lg">
                    <CardHeader className="bg-mercedes-darkgray text-white">
                      <CardTitle>Détails du véhicule</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Marque</span>
                            <span className="font-medium">{vehicle.make}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Modèle</span>
                            <span className="font-medium">{vehicle.model}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Année</span>
                            <span className="font-medium">{vehicle.year}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Moteur</span>
                            <span className="font-medium">{vehicle.specifications?.engine || 'Non spécifié'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Kilométrage</span>
                            <span className="font-medium">{vehicle.specifications?.mileage ? `${vehicle.specifications.mileage} km` : 'Non spécifié'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Transmission</span>
                            <span className="font-medium">{vehicle.specifications?.transmission || 'Non spécifié'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Carburant</span>
                            <span className="font-medium">{vehicle.specifications?.fuelType || 'Non spécifié'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Couleur</span>
                            <span className="font-medium">{vehicle.specifications?.color || 'Non spécifié'}</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Prix</span>
                          <span className="text-2xl font-bold text-mercedes-blue">{vehicle.price} €</span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          {vehicle.status !== 'sold' && (
                            <Button 
                              className="w-full bg-mercedes-blue hover:bg-mercedes-darkblue text-white"
                              onClick={handleReserve}
                            >
                              Demander plus d'informations
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleShare}
                          >
                            <Share2 className="mr-2 h-4 w-4" />
                            Partager ce véhicule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center text-sm text-gray-500 w-full justify-center">
                        <Info className="mr-2 h-4 w-4" />
                        <span>Contactez-nous pour plus de détails</span>
                      </div>
                    </CardFooter>
                  </Card>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default VehicleDetailsPage;
