
import { useEffect } from "react";
import { Truck, ClipboardCheck, FileText, ShieldCheck, Briefcase, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import ScrollReveal from "@/components/ScrollReveal";

const services = [
  {
    icon: <Truck size={24} />,
    title: "Exportation de Véhicules",
    description: "Nous prenons en charge l'ensemble du processus d'exportation de votre véhicule vers l'Algérie.",
    details: [
      "Transport sécurisé par des transporteurs agréés",
      "Traçabilité complète du véhicule pendant le transport",
      "Assurance transport incluse",
      "Livraison à l'adresse de votre choix en Algérie"
    ]
  },
  {
    icon: <ClipboardCheck size={24} />,
    title: "Sélection de Véhicules",
    description: "Nous recherchons et sélectionnons pour vous des véhicules répondant à vos critères.",
    details: [
      "Audit complet de l'historique du véhicule",
      "Inspection mécanique approfondie",
      "Vérification de la conformité aux normes algériennes",
      "Photos et vidéos détaillées du véhicule"
    ]
  },
  {
    icon: <FileText size={24} />,
    title: "Gestion Administrative",
    description: "Nous nous occupons de toutes les formalités administratives et douanières.",
    details: [
      "Préparation des documents d'exportation",
      "Déclaration en douane",
      "Obtention des certificats nécessaires",
      "Assistance pour l'immatriculation en Algérie"
    ]
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Garantie et Suivi",
    description: "Nous vous offrons une garantie sur les véhicules exportés et un service après-vente.",
    details: [
      "Garantie de 3 mois sur les pièces mécaniques",
      "Assistance technique à distance",
      "Service de pièces détachées",
      "Contrôles post-livraison"
    ]
  },
  {
    icon: <Briefcase size={24} />,
    title: "Conseils Personnalisés",
    description: "Nos experts vous accompagnent dans votre projet d'acquisition de véhicule.",
    details: [
      "Analyse des besoins et du budget",
      "Comparaison des différentes options",
      "Conseil sur les modèles adaptés au marché algérien",
      "Estimation des coûts totaux (achat, taxes, transport)"
    ]
  },
  {
    icon: <Globe size={24} />,
    title: "Services Internationaux",
    description: "Notre réseau européen nous permet de sourcer les meilleurs véhicules pour vous.",
    details: [
      "Accès aux marchés automobiles de toute l'Europe",
      "Partenariats avec des concessionnaires officiels",
      "Réseau de transporteurs internationaux",
      "Expertise dans les réglementations internationales"
    ]
  }
];

const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      
      <main>
        <section className="pt-24 pb-16 bg-gradient-to-b from-mercedes-black to-mercedes-darkgray text-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-center">
                Nos Services
              </h1>
              <p className="text-white/80 max-w-3xl mx-auto text-center text-lg">
                Découvrez notre gamme complète de services d'exportation de véhicules de l'Europe vers l'Algérie.
              </p>
            </ScrollReveal>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ScrollReveal key={service.title} delay={index * 100}>
                  <ServiceCard
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    details={service.details}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <ScrollReveal>
                  <h2 className="text-3xl font-serif font-bold mb-6">
                    Notre Processus d'Exportation
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Notre approche structurée garantit une expérience fluide et transparente pour nos clients.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-8 h-8 rounded-full bg-mercedes-blue flex items-center justify-center text-white">1</div>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Consultation Initiale</h3>
                        <p className="text-gray-600">Nous discutons de vos besoins, préférences et budget pour déterminer le véhicule idéal.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-8 h-8 rounded-full bg-mercedes-blue flex items-center justify-center text-white">2</div>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Recherche et Sélection</h3>
                        <p className="text-gray-600">Nous recherchons dans notre réseau européen pour trouver des véhicules correspondant à vos critères.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-8 h-8 rounded-full bg-mercedes-blue flex items-center justify-center text-white">3</div>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Inspection et Validation</h3>
                        <p className="text-gray-600">Chaque véhicule subit une inspection rigoureuse avant d'être proposé à nos clients.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-8 h-8 rounded-full bg-mercedes-blue flex items-center justify-center text-white">4</div>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Formalités Administratives</h3>
                        <p className="text-gray-600">Nous gérons tous les aspects administratifs et douaniers pour l'exportation.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-8 h-8 rounded-full bg-mercedes-blue flex items-center justify-center text-white">5</div>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Transport et Livraison</h3>
                        <p className="text-gray-600">Le véhicule est transporté en toute sécurité jusqu'à destination en Algérie.</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="mr-4">
                        <div className="w-8 h-8 rounded-full bg-mercedes-blue flex items-center justify-center text-white">6</div>
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Service Après-Vente</h3>
                        <p className="text-gray-600">Nous continuons à vous accompagner après la livraison avec notre service de suivi.</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
              
              <div className="md:w-1/2">
                <ScrollReveal delay={200}>
                  <img 
                    src="/lovable-uploads/d6338b3f-2a4f-4279-90e4-8775cb7acd40.png" 
                    alt="Processus d'exportation" 
                    className="w-full h-auto rounded-sm shadow-xl"
                  />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-mercedes-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-serif font-bold mb-6">
                Prêt à exporter votre véhicule?
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8">
                Contactez-nous dès aujourd'hui pour discuter de votre projet et obtenir un devis personnalisé.
              </p>
              <a href="/contact" className="inline-block bg-white text-mercedes-blue hover:bg-mercedes-black hover:text-white font-medium px-8 py-3 rounded-none transition-all duration-300">
                Demander un devis
              </a>
            </ScrollReveal>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default ServicesPage;
