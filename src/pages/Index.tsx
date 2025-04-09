
import CarCarousel from "@/components/CarCarousel";
import Footer from "@/components/Footer";
import HomeAbout from "@/components/HomeAbout";
import HomeCallToAction from "@/components/HomeCallToAction";
import HomeFeatures from "@/components/HomeFeatures";
import HomeTestimonials from "@/components/HomeTestimonials";
import Navbar from "@/components/Navbar";
import VideoPanel from "@/components/VideoPanel";
import { useEffect } from "react";

const carouselItems = [
  {
    id: 1,
    image: "/uploads/ea38bd58-5015-4016-a27f-9e96383424fb.png",
    title: "Votre Partenaire d'Exportation Automobile",
    description: "Spécialiste de l'exportation de véhicules premium de l'Europe vers l'Algérie."
  },
  {
    id: 2,
    image: "/uploads/3bf54152-1a0e-47d2-a44f-fae8843a5058.png",
    title: "Qualité et Fiabilité Garanties",
    description: "Des véhicules soigneusement sélectionnés pour répondre à vos exigences."
  },
  {
    id: 3,
    image: "/uploads/964d32ef-a58e-44f7-a136-d1b93fdab210.png",
    title: "Service d'Exportation Premium",
    description: "Un accompagnement personnalisé pour simplifier votre acquisition."
  }
];

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden">
        {/* Vidéo en plein écran */}
        <VideoPanel />

        {/* Carousel de présentation */}
        <section className="py-16 bg-white">
          <CarCarousel items={carouselItems} />
        </section>

        {/* Section fonctionnalités */}
        <HomeFeatures />

        {/* Section pourquoi nous choisir */}
        <HomeAbout />

        {/* Section témoignages */}
        <HomeTestimonials />

        {/* Section CTA */}
        <HomeCallToAction />
      </main>

      <Footer />
    </>
  );
};

export default HomePage;
