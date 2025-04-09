
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const HomeAbout = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 md:pr-16">
            <ScrollReveal direction="left" duration={800} distance={40}>
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-mercedes-black">
                Pourquoi choisir -3ans DZ?
              </h2>
              <div className="w-24 h-1 bg-mercedes-blue mb-8"></div>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Avec plus de 5 ans d'expérience dans l'exportation automobile, -3ans DZ s'est imposé comme un acteur de référence sur le marché. Notre expertise nous permet de vous offrir un service complet, de la sélection du véhicule jusqu'à sa livraison en Algérie.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start">
                  <div className="mr-3 text-mercedes-blue bg-mercedes-blue/10 p-1 rounded-full">
                    <ChevronRight size={18} />
                  </div>
                  <span className="text-gray-700">Sélection rigoureuse des véhicules</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 text-mercedes-blue bg-mercedes-blue/10 p-1 rounded-full">
                    <ChevronRight size={18} />
                  </div>
                  <span className="text-gray-700">Gestion complète des formalités administratives et douanières</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 text-mercedes-blue bg-mercedes-blue/10 p-1 rounded-full">
                    <ChevronRight size={18} />
                  </div>
                  <span className="text-gray-700">Transport sécurisé par des transporteurs agréés</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-3 text-mercedes-blue bg-mercedes-blue/10 p-1 rounded-full">
                    <ChevronRight size={18} />
                  </div>
                  <span className="text-gray-700">Suivi en temps réel de votre commande</span>
                </li>
              </ul>
              <Link to="/services" className="inline-block bg-mercedes-blue text-white px-8 py-4 font-medium transition-all duration-300 hover:bg-mercedes-darkblue shadow-lg hover:shadow-xl">
                Découvrir nos services
              </Link>
            </ScrollReveal>
          </div>
          
          <div className="md:w-1/2">
            <ScrollReveal direction="right" delay={200} duration={800} distance={40}>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-mercedes-blue z-0"></div>
                <img 
                  src="/lovable-uploads/29df00a1-3840-4b5a-b171-484af6b189aa.png" 
                  alt="Mercedes-Benz Showroom" 
                  className="w-full h-auto rounded-sm shadow-2xl relative z-10 brightness-105 contrast-105"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-mercedes-blue z-0"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
