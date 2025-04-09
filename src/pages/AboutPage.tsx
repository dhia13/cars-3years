
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const AboutPage = () => {
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
                À Propos de -3ans DZ
              </h1>
              <p className="text-white/80 max-w-3xl mx-auto text-center text-lg">
                Votre partenaire de confiance pour l'exportation de véhicules de l'Europe vers l'Algérie.
              </p>
            </ScrollReveal>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <ScrollReveal>
                  <h2 className="text-3xl font-serif font-bold mb-6">
                    Notre Histoire
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Fondée en 2019, -3ans DZ est née de la volonté de simplifier et sécuriser l'exportation de véhicules premium de l'Europe vers l'Algérie. Nos fondateurs, après avoir constaté les difficultés et les risques liés à ce processus, ont décidé de mettre leur expertise au service des particuliers et des professionnels.
                  </p>
                  <p className="text-gray-600 mb-4">
                    Au fil des années, nous avons développé un réseau solide de partenaires en Europe et en Algérie, permettant d'offrir un service complet et fiable à nos clients. Notre connaissance approfondie des marchés européens et des réglementations algériennes nous positionne comme un acteur incontournable dans ce secteur spécialisé.
                  </p>
                  <p className="text-gray-600">
                    Aujourd'hui, -3ans DZ est fière d'avoir accompagné plus de 500 clients dans leur projet d'acquisition de véhicules premium, avec un taux de satisfaction exceptionnel qui témoigne de notre engagement envers l'excellence.
                  </p>
                </ScrollReveal>
              </div>
              
              <div className="md:w-1/2">
                <ScrollReveal delay={200}>
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-mercedes-blue z-0"></div>
                    <img 
                      src="/lovable-uploads/3bf54152-1a0e-47d2-a44f-fae8843a5058.png" 
                      alt="Histoire de -3ans DZ" 
                      className="w-full h-auto rounded-sm shadow-xl relative z-10"
                    />
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-mercedes-blue z-0"></div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-serif font-bold mb-4">
                  Notre Mission et Nos Valeurs
                </h2>
                <p className="text-gray-600">
                  Chez -3ans DZ, nous nous engageons à offrir un service d'excellence à chaque étape du processus d'exportation.
                </p>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal delay={100}>
                <div className="glass-card p-8">
                  <h3 className="text-xl font-serif font-bold mb-4">Notre Mission</h3>
                  <p className="text-gray-600">
                    Faciliter l'accès des Algériens à des véhicules européens de qualité, en offrant un service d'exportation sécurisé, transparent et personnalisé. Nous nous efforçons de simplifier chaque étape du processus, de la sélection du véhicule à sa livraison en Algérie.
                  </p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <div className="glass-card p-8">
                  <h3 className="text-xl font-serif font-bold mb-4">Notre Vision</h3>
                  <p className="text-gray-600">
                    Devenir la référence en matière d'exportation de véhicules premium vers l'Algérie, reconnue pour son excellence opérationnelle, son intégrité et sa capacité à créer une expérience client exceptionnelle. Nous aspirons à contribuer au développement du parc automobile algérien avec des véhicules de qualité.
                  </p>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={300}>
                <div className="glass-card p-8">
                  <h3 className="text-xl font-serif font-bold mb-4">Nos Valeurs</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li><span className="font-medium">Excellence :</span> Nous visons constamment la perfection dans chaque service que nous offrons.</li>
                    <li><span className="font-medium">Intégrité :</span> Nous agissons avec honnêteté et transparence dans toutes nos interactions.</li>
                    <li><span className="font-medium">Engagement :</span> Nous nous engageons pleinement dans chaque projet pour garantir sa réussite.</li>
                    <li><span className="font-medium">Innovation :</span> Nous recherchons continuellement des moyens d'améliorer nos services.</li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-serif font-bold mb-4">
                  Notre Équipe
                </h2>
                <p className="text-gray-600">
                  Une équipe d'experts passionnés, dédiés à l'excellence et à votre satisfaction.
                </p>
              </div>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ScrollReveal delay={100}>
                <div className="glass-card overflow-hidden group">
                  <div className="aspect-square overflow-hidden">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl font-serif text-gray-400">A</span>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold mb-1">Ahmed Benali</h3>
                    <p className="text-mercedes-blue text-sm mb-3">Fondateur & Directeur</p>
                    <p className="text-gray-600 text-sm">
                      Plus de 15 ans d'expérience dans l'industrie automobile et l'import-export.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <div className="glass-card overflow-hidden group">
                  <div className="aspect-square overflow-hidden">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl font-serif text-gray-400">S</span>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold mb-1">Sofia Hadj</h3>
                    <p className="text-mercedes-blue text-sm mb-3">Responsable Relations Clients</p>
                    <p className="text-gray-600 text-sm">
                      Experte en service client avec une connaissance approfondie des procédures d'exportation.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={300}>
                <div className="glass-card overflow-hidden group">
                  <div className="aspect-square overflow-hidden">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl font-serif text-gray-400">K</span>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold mb-1">Karim Meziane</h3>
                    <p className="text-mercedes-blue text-sm mb-3">Conseiller Technique</p>
                    <p className="text-gray-600 text-sm">
                      Mécanicien certifié avec une expertise particulière sur les véhicules Mercedes-Benz.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={400}>
                <div className="glass-card overflow-hidden group">
                  <div className="aspect-square overflow-hidden">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl font-serif text-gray-400">L</span>
                    </div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-bold mb-1">Leila Boumediene</h3>
                    <p className="text-mercedes-blue text-sm mb-3">Responsable Logistique</p>
                    <p className="text-gray-600 text-sm">
                      Spécialiste en logistique internationale et gestion des formalités douanières.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-mercedes-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-serif font-bold mb-6">
                Vous souhaitez en savoir plus?
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8">
                Contactez-nous dès aujourd'hui pour discuter de votre projet d'acquisition de véhicule premium.
              </p>
              <a href="/contact" className="inline-block bg-white text-mercedes-blue hover:bg-mercedes-black hover:text-white font-medium px-8 py-3 rounded-none transition-all duration-300">
                Nous contacter
              </a>
            </ScrollReveal>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default AboutPage;
