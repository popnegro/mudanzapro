import { useState, useEffect, useRef, useCallback } from "react";

interface UseCarouselProps {
  itemCount: number;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export function useCarousel({
  itemCount,
  autoplay = true,
  autoplayInterval = 6000,
}: UseCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(autoplay);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
  }, [itemCount]);

  // Auto-play interval
  useEffect(() => {
    if (!isAutoPlay || itemCount === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlay, itemCount, autoplayInterval, handleNext]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev === 0 ? itemCount - 1 : prev - 1));
  };

  const handleManualNext = () => {
    setIsAutoPlay(false);
    handleNext();
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  // Touch handlers for mobile gesture swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoPlay(false);
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return {
    currentIndex,
    handlePrev,
    handleNext: handleManualNext,
    handleDotClick,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
