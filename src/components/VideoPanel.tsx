
import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { PlayCircle, PauseCircle } from "lucide-react";

const VideoPanel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    
    if (videoElement) {
      videoElement.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
    
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', () => {
          setIsPlaying(false);
        });
      }
    };
  }, []);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 to-black/70"></div>
      
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover brightness-110 contrast-110"
        playsInline
        muted
        preload="auto"
        loop
      >
        <source src="/videos/mercedes-experience.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4">
        <ScrollReveal>
          <h2 className="text-4xl md:text-7xl font-serif font-bold mb-6 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
            L'Excellence Automobile
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl text-center mb-12 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Découvrez notre sélection de véhicules d'exception
          </p>
        </ScrollReveal>
      </div>
      
      <button 
        onClick={togglePlay}
        className="absolute bottom-8 left-8 z-30 bg-transparent hover:bg-mercedes-blue/20 rounded-full transition-all duration-300"
        aria-label={isPlaying ? "Pause la vidéo" : "Jouer la vidéo"}
      >
        {isPlaying ? (
          <PauseCircle size={48} className="text-white/80 hover:text-white transition-colors" />
        ) : (
          <PlayCircle size={48} className="text-white/80 hover:text-white transition-colors" />
        )}
      </button>
    </section>
  );
};

export default VideoPanel;
