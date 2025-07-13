import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroCarouselProps {
  images: string[];
  autoplay?: boolean;
  autoplayDelay?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  height?: number;
}

export function HeroCarousel({
  images,
  autoplay = true,
  autoplayDelay = 5000,
  showNavigation = true,
  showDots = true,
  height = 500,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  }, [images.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoplay || isHovered || images.length <= 1) return;

    const interval = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, nextSlide, images.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        prevSlide();
      } else if (event.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-center text-muted-foreground">
          <div className="text-6xl mb-4">🌸</div>
          <p className="text-lg">No carousel images configured</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="hero-carousel relative w-full overflow-hidden bg-gray-100"
      style={{ height: `${height}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="hero-carousel-slide w-full h-full flex-shrink-0"
            style={{
              backgroundImage: `url(${image})`,
            }}
            role="img"
            aria-label={`Slide ${index + 1} of ${images.length}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {showNavigation && images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="hero-carousel-nav absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 border-white/20 shadow-lg z-10"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hero-carousel-nav absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 border-white/20 shadow-lg z-10"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Dots navigation */}
      {showDots && images.length > 1 && (
        <div className="hero-carousel-dots absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`hero-carousel-dot w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white shadow-lg scale-110"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide indicator for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {images.length}
      </div>
    </div>
  );
}
