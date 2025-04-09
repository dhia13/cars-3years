
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

const HomeCallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-mercedes-darkblue to-mercedes-blue text-white">
      <div className="container mx-auto px-4 text-center">
        <ScrollReveal duration={800} distance={40} direction="up" easing="ease-out">
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
            Prêt à démarrer?
          </h2>
          <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-white/90 max-w-2xl mx-auto mb-10 text-lg">
            Contactez-nous dès aujourd'hui pour discuter de votre projet d'acquisition de véhicule et bénéficier de notre expertise en exportation.
          </p>
          <Link to="/contact" className="inline-block bg-white text-mercedes-darkblue font-medium px-10 py-4 transition-all duration-300 hover:bg-mercedes-black hover:text-white shadow-lg hover:shadow-xl">
            Nous contacter
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HomeCallToAction;
