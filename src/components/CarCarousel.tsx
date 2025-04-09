
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from 'react-router-dom';

interface CarouselItem {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface CarCarouselProps {
  items: CarouselItem[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

const CarCarousel = ({
  items,
  autoSlide = true,
  autoSlideInterval = 5000,
}: CarCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((currentIndex) => (currentIndex === 0 ? items.length - 1 : currentIndex - 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((currentIndex) => (currentIndex === items.length - 1 ? 0 : currentIndex + 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  useEffect(() => {
    if (autoSlide) {
      const startTimer = () => {
        timerRef.current = setInterval(() => {
          next();
        }, autoSlideInterval);
      };

      startTimer();

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [autoSlide, autoSlideInterval, currentIndex]);

  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    if (autoSlide && !timerRef.current) {
      timerRef.current = setInterval(() => {
        next();
      }, autoSlideInterval);
    }
  };

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <div className="relative">
      {/* Main carousel area */}
      <div 
        ref={carouselRef}
        className="relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Slides container */}
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className="min-w-full relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Image section */}
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content section */}
                <div className="p-6">
                  <Card className="border-none shadow-none bg-transparent">
                    <CardHeader className="px-0">
                      <CardTitle className="text-2xl md:text-3xl font-serif mb-2">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pt-4">
                      <Link 
                        to={`/vehicules/${item.id === 1 ? 'classe-c' : item.id === 2 ? 'classe-e' : 'gle'}`} 
                        className="mercedes-button"
                      >
                        En savoir plus
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex items-center justify-between px-4">
        <button 
          onClick={prev}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-mercedes-blue/80 transition-colors z-10"
          aria-label="Précédent"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={next}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-mercedes-blue/80 transition-colors z-10"
          aria-label="Suivant"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-mercedes-blue w-6' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Aller au slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CarCarousel;
