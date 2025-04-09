
import { useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  easing?: string;
}

const ScrollReveal = ({ 
  children, 
  delay = 0, 
  direction = "up", 
  distance = 50,
  duration = 1000,
  once = true,
  threshold = 0.1,
  easing = "cubic-bezier(0.5, 0, 0, 1)"
}: ScrollRevealProps) => {
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("active");
            }, delay);
            
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            // If not set to once, remove active class when out of view
            entry.target.classList.remove("active");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold,
      }
    );

    if (revealRef.current) {
      // Apply the direction-specific class
      revealRef.current.classList.add(`reveal-${direction}`);
      revealRef.current.style.setProperty("--reveal-distance", `${distance}px`);
      revealRef.current.style.setProperty("--reveal-duration", `${duration}ms`);
      revealRef.current.style.setProperty("--reveal-easing", easing);
      observer.observe(revealRef.current);
    }

    return () => {
      if (revealRef.current) {
        observer.unobserve(revealRef.current);
      }
    };
  }, [delay, direction, distance, duration, once, threshold, easing]);

  return (
    <div ref={revealRef} className="reveal">
      {children}
    </div>
  );
};

export default ScrollReveal;
