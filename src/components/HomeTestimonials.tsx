
import { Star } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const testimonials = [
  {
    id: 1,
    name: "Ahmed B.",
    role: "Entrepreneur",
    content: "J'ai fait appel à -3ans DZ pour l'achat et l'exportation d'une Mercedes Classe E. Le service était impeccable, transparent et professionnel. Je recommande vivement!",
    rating: 5
  },
  {
    id: 2,
    name: "Sara M.",
    role: "Médecin",
    content: "Une équipe sérieuse qui a su répondre à mes attentes. La voiture est arrivée en parfait état et dans les délais annoncés. Merci pour votre professionnalisme.",
    rating: 5
  },
  {
    id: 3,
    name: "Karim L.",
    role: "Directeur Commercial",
    content: "Excellente expérience avec -3ans DZ. Des conseillers compétents, des délais respectés et un véhicule conforme à la description. Je n'hésiterai pas à faire appel à leurs services à nouveau.",
    rating: 4
  }
];

const HomeTestimonials = () => {
  return (
    <section className="py-24 bg-mercedes-black text-white">
      <div className="container mx-auto px-4">
        <ScrollReveal duration={800}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
              Ce que nos clients disent
            </h2>
            <div className="w-24 h-1 bg-mercedes-blue mx-auto mb-6"></div>
            <p className="text-white/80 text-lg">
              La satisfaction de nos clients est notre priorité absolue.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <ScrollReveal 
              key={testimonial.id} 
              delay={index * 150} 
              direction="up"
              distance={40}
              duration={800}
            >
              <div className="bg-mercedes-darkgray p-8 hover:shadow-lg hover:shadow-mercedes-blue/20 transition-all duration-300 border-l-2 border-mercedes-blue">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < testimonial.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-white/90 mb-8 italic leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="font-bold text-mercedes-blue">{testimonial.name}</p>
                  <p className="text-white/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeTestimonials;
