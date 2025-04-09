
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleCard from "@/components/VehicleCard";
import ScrollReveal from "@/components/ScrollReveal";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Filter, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { vehiclesApi } from "@/services/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  specifications: {
    engine: string;
    transmission: string;
    mileage: number;
    fuelType: string;
    bodyType: string;
    color: string;
  };
}

type FuelType = string;

const VehiculesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vehiclesApi.getAll();
      console.log('Fetched vehicles from API:', data);
      setVehicles(data);
    } catch (error: any) {
      console.error('Error fetching vehicles:', error);
      setError(error.message || 'Erreur lors du chargement des véhicules');
    } finally {
      setIsLoading(false);
    }
  };

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<FuelType[]>([]);
  const [yearRange, setYearRange] = useState([2021, 2025]);
  
  // Get unique fuel types from vehicles
  const availableFuelTypes = Array.from(
    new Set(vehicles.map(v => v.specifications?.fuelType).filter(Boolean))
  );
  
  // Filter vehicles based on selected criteria
  const filteredVehicles = vehicles.filter(vehicle => {
    // Filter by fuel type if any is selected
    const fuelTypeMatch = selectedFuelTypes.length === 0 || 
      (vehicle.specifications?.fuelType && 
       selectedFuelTypes.includes(vehicle.specifications.fuelType));
    
    // Filter by year range
    const vehicleYear = vehicle.year;
    const yearMatch = vehicleYear >= yearRange[0] && vehicleYear <= yearRange[1];
    
    return fuelTypeMatch && yearMatch;
  });

  // Count available vehicles after filtering
  const availableCount = filteredVehicles.filter(v => v.status === 'available').length;

  const toggleFuelType = (fuelType: FuelType) => {
    setSelectedFuelTypes(prev => 
      prev.includes(fuelType) 
        ? prev.filter(type => type !== fuelType)
        : [...prev, fuelType]
    );
  };

  // Calculate min and max years from available vehicles
  const yearsArray = vehicles.map(v => v.year).filter(Boolean);
  const minYear = yearsArray.length ? Math.min(...yearsArray) : 2021;
  const maxYear = yearsArray.length ? Math.max(...yearsArray) : 2025;

  // Set year range when vehicles load
  useEffect(() => {
    if (vehicles.length && yearsArray.length) {
      setYearRange([minYear, maxYear]);
    }
  }, [vehicles]);

  // Map status to display text
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

  // Helper to get API URL for images
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${imagePath}`;
  };

  return (
    <>
      <Navbar />
      
      <main>
        <section className="pt-28 pb-20 bg-gradient-to-b from-mercedes-black via-mercedes-darkgray to-black text-white shadow-lg">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-center drop-shadow-md">
                Nos Véhicules
              </h1>
              <p className="text-white/90 max-w-3xl mx-auto text-center text-lg md:text-xl">
                Découvrez notre sélection de véhicules disponibles pour l'exportation vers l'Algérie. 
                <span className="font-bold text-mercedes-blue ml-2">{availableCount} véhicules actuellement en stock.</span>
              </p>
            </ScrollReveal>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <h2 className="text-2xl font-serif font-bold mb-4 lg:mb-0">Véhicules disponibles</h2>
              
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center text-sm bg-green-100 px-3 py-1 rounded-full">
                  <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                  En stock
                </span>
                <span className="inline-flex items-center text-sm bg-yellow-100 px-3 py-1 rounded-full">
                  <span className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></span>
                  Sur commande
                </span>
                <span className="inline-flex items-center text-sm bg-red-100 px-3 py-1 rounded-full">
                  <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                  Vendu
                </span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4"></div>
                <p>Chargement des véhicules...</p>
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mb-8">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <Collapsible 
                  open={filtersOpen} 
                  onOpenChange={setFiltersOpen}
                  className="mb-8 border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-5 w-5 text-mercedes-darkblue" />
                      <h3 className="text-lg font-medium">Filtres</h3>
                    </div>
                    <CollapsibleTrigger className="rounded-full hover:bg-gray-100 p-2 transition-colors">
                      {filtersOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="mt-4 space-y-6">
                    {availableFuelTypes.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3">Type de carburant</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {availableFuelTypes.map((fuel) => (
                            <div key={fuel} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`fuel-${fuel}`} 
                                checked={selectedFuelTypes.includes(fuel)}
                                onCheckedChange={() => toggleFuelType(fuel)}
                                className="data-[state=checked]:bg-mercedes-darkblue"
                              />
                              <label 
                                htmlFor={`fuel-${fuel}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {fuel}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-3">Année du véhicule</h4>
                      <div className="px-2">
                        <Slider 
                          value={yearRange}
                          min={minYear} 
                          max={maxYear} 
                          step={1} 
                          onValueChange={(value) => setYearRange(value as [number, number])}
                          className="mb-6"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{yearRange[0]}</span>
                          <span>{yearRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                
                <Separator className="mb-8" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle, index) => (
                      <ScrollReveal key={vehicle._id} delay={index * 100}>
                        <VehicleCard
                          id={vehicle._id}
                          image={getImageUrl(vehicle.images[0])}
                          title={`${vehicle.make} ${vehicle.model}`}
                          description={vehicle.description}
                          price={vehicle.price.toString()}
                          year={vehicle.year.toString()}
                          specs={{
                            engine: vehicle.specifications?.engine || '',
                            power: '',
                            acceleration: '',
                            consumption: ''
                          }}
                          availability={getAvailabilityText(vehicle.status) as any}
                        />
                      </ScrollReveal>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-lg text-gray-500">
                        {vehicles.length > 0 
                          ? 'Aucun véhicule ne correspond à vos critères de recherche.'
                          : 'Aucun véhicule disponible pour le moment.'}
                      </p>
                      {vehicles.length > 0 && (
                        <button 
                          onClick={() => {
                            setSelectedFuelTypes([]);
                            setYearRange([minYear, maxYear]);
                          }}
                          className="mt-4 text-mercedes-blue hover:text-mercedes-darkblue underline"
                        >
                          Réinitialiser les filtres
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-gray-50 to-white p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-serif font-bold mb-6 text-mercedes-darkblue">
                  Vous ne trouvez pas ce que vous cherchez?
                </h2>
                <p className="text-gray-700 mb-8 text-lg">
                  Nous pouvons vous aider à trouver le véhicule parfait qui correspond à vos besoins spécifiques. 
                  Contactez-nous pour une recherche personnalisée.
                </p>
                <a 
                  href="/contact" 
                  className="mercedes-button bg-mercedes-darkblue hover:bg-mercedes-black inline-flex items-center group"
                >
                  Demande spéciale
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default VehiculesPage;
