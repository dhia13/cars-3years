
import { ShieldCheck, Truck, UserCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useEffect, useState } from "react";

const features = [
  {
    icon: <ShieldCheck size={28} />,
    title: "Qualité Garantie",
    description: "Tous nos véhicules sont minutieusement inspectés pour assurer une qualité irréprochable."
  },
  {
    icon: <Truck size={28} />,
    title: "Livraison Fiable",
    description: "Transport sécurisé et livraison dans les délais convenus."
  },
  {
    icon: <UserCheck size={28} />,
    title: "Service Personnalisé",
    description: "Un conseiller dédié vous accompagne tout au long du processus d'achat et d'exportation."
  }
];

const HomeFeatures = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-mercedes-darkblue/5 to-white">
      <div className="container mx-auto px-4">
        <ScrollReveal duration={800}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-mercedes-black">
              Exportation de Véhicules Premium
            </h2>
            <div className="w-24 h-1 bg-mercedes-blue mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">
              -3ans DZ vous accompagne dans l'acquisition et l'exportation de véhicules haut de gamme de l'Europe vers l'Algérie.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <ScrollReveal 
              key={feature.title} 
              delay={index * 150} 
              direction="up"
              distance={40}
              duration={800}
            >
              <div 
                className={`bg-white p-8 shadow-2xl hover:shadow-2xl transition-all duration-500 text-center rounded-sm border-t-4 ${index === activeIndex ? 'border-mercedes-darkblue scale-105' : 'border-mercedes-blue'} hover:scale-105 hover:border-mercedes-darkblue`}
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-mercedes-blue to-mercedes-darkblue rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg transform transition-all duration-500 hover:rotate-12">
                    {feature.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border-2 border-mercedes-blue opacity-0 animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 text-mercedes-black">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                
                <div className="mt-6 h-1 w-0 bg-mercedes-blue mx-auto transition-all duration-700 group-hover:w-full"></div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeatures;
