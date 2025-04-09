
import { useEffect } from "react";
import { Map, Phone, Mail, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import ScrollReveal from "@/components/ScrollReveal";

const ContactPage = () => {
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
                Contactez-Nous
              </h1>
              <p className="text-white/80 max-w-3xl mx-auto text-center text-lg">
                Nous sommes à votre disposition pour répondre à toutes vos questions concernant l'exportation de véhicules vers l'Algérie.
              </p>
            </ScrollReveal>
          </div>
        </section>
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="lg:w-2/5">
                <ScrollReveal>
                  <div className="glass-card p-8 shadow-lg h-full">
                    <h2 className="text-2xl font-serif font-bold mb-6">
                      Informations de Contact
                    </h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1 text-mercedes-blue">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Adresse</h3>
                          <address className="not-italic text-gray-600">
                            123 Rue des Exportateurs<br />
                            Alger, Algérie
                          </address>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-4 mt-1 text-mercedes-blue">
                          <Phone size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Téléphone</h3>
                          <p className="text-gray-600">+213 123 456 789</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-4 mt-1 text-mercedes-blue">
                          <Mail size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Email</h3>
                          <p className="text-gray-600">contact@3ansdz.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-4 mt-1 text-mercedes-blue">
                          <Clock size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold mb-1">Heures d'ouverture</h3>
                          <p className="text-gray-600">
                            Lundi - Vendredi: 9h00 - 18h00<br />
                            Samedi: 9h00 - 13h00<br />
                            Dimanche: Fermé
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <h3 className="font-bold mb-4">Suivez-nous</h3>
                      <div className="flex space-x-4">
                        <a href="#" className="bg-gray-200 hover:bg-mercedes-blue hover:text-white p-2 rounded-full transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="#" className="bg-gray-200 hover:bg-mercedes-blue hover:text-white p-2 rounded-full transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="#" className="bg-gray-200 hover:bg-mercedes-blue hover:text-white p-2 rounded-full transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
              
              <div className="lg:w-3/5">
                <ScrollReveal delay={200}>
                  <div className="glass-card p-8 shadow-lg">
                    <h2 className="text-2xl font-serif font-bold mb-6">
                      Envoyez-nous un message
                    </h2>
                    <ContactForm />
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
                  Foire aux questions
                </h2>
                <p className="text-gray-600">
                  Trouvez les réponses à vos questions les plus fréquentes.
                </p>
              </div>
            </ScrollReveal>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <ScrollReveal delay={100}>
                  <div className="glass-card p-6">
                    <h3 className="font-bold mb-2">Quels types de véhicules exportez-vous vers l'Algérie?</h3>
                    <p className="text-gray-600">
                      Nous nous spécialisons dans l'exportation de véhicules premium, principalement des Mercedes-Benz, mais aussi d'autres marques allemandes de prestige. Nous couvrons tous les types de véhicules: berlines, SUV, coupés, cabriolets, etc.
                    </p>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={200}>
                  <div className="glass-card p-6">
                    <h3 className="font-bold mb-2">Quels sont les délais moyens pour une exportation complète?</h3>
                    <p className="text-gray-600">
                      Les délais varient en fonction de plusieurs facteurs (disponibilité du véhicule, formalités administratives, transport), mais comptez généralement entre 4 et 8 semaines pour l'ensemble du processus, depuis la sélection du véhicule jusqu'à sa livraison en Algérie.
                    </p>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={300}>
                  <div className="glass-card p-6">
                    <h3 className="font-bold mb-2">Quels documents sont nécessaires pour l'exportation d'un véhicule?</h3>
                    <p className="text-gray-600">
                      Pour l'exportation, nous aurons besoin de votre pièce d'identité, d'un justificatif de domicile en Algérie, et éventuellement d'une procuration si vous ne pouvez pas être présent pour certaines démarches. Nous nous occupons de tous les autres documents nécessaires.
                    </p>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={400}>
                  <div className="glass-card p-6">
                    <h3 className="font-bold mb-2">Comment se déroule le paiement pour vos services?</h3>
                    <p className="text-gray-600">
                      Nous travaillons généralement avec un acompte de 30% à la commande, puis le solde avant l'expédition du véhicule. Nous acceptons les virements bancaires et proposons des solutions de financement adaptées pour certains clients.
                    </p>
                  </div>
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

export default ContactPage;
