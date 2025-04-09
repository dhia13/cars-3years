
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const NotFound = () => {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-mercedes-black to-mercedes-darkgray py-20">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="glass-card max-w-lg mx-auto p-10 bg-white/10">
              <h1 className="text-7xl font-serif font-bold mb-6 text-white">404</h1>
              <h2 className="text-2xl font-serif mb-6 text-white">Page non trouvée</h2>
              <p className="text-white/80 mb-8">
                La page que vous recherchez n'existe pas ou a été déplacée.
              </p>
              <Link 
                to="/" 
                className="mercedes-button inline-flex items-center"
              >
                <Home size={18} className="mr-2" />
                Retour à l'accueil
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default NotFound;
