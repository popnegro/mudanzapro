import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  loading?: 'lazy' | 'eager';
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
}

/**
 * LazyImage Component
 * Implements a high-performance progressive lazy loading system with a beautiful blur-up effect.
 * Uses IntersectionObserver to prevent off-screen image decoding and rendering.
 * Automatically generates a tiny 30px blurred low-res thumbnail if the source is from Unsplash.
 */
export default function LazyImage({
  src,
  alt,
  className = '',
  rootMargin = '200px',
  threshold = 0.01,
  loading = 'lazy',
  referrerPolicy,
  ...rest
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate low-res placeholder URL if the image is hosted on Unsplash
  const placeholderUrl = React.useMemo(() => {
    if (src && src.includes('images.unsplash.com')) {
      // Create a 30px wide, low quality, blurred version of the same image
      let placeholder = src;
      if (placeholder.includes('w=')) {
        placeholder = placeholder.replace(/w=\d+/, 'w=30');
      } else {
        placeholder += '&w=30';
      }
      if (placeholder.includes('q=')) {
        placeholder = placeholder.replace(/q=\d+/, 'q=15');
      } else {
        placeholder += '&q=15';
      }
      if (!placeholder.includes('blur=')) {
        placeholder += '&blur=8';
      }
      return placeholder;
    }
    // Transparent 1x1 spacer as fallback
    return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"/>';
  }, [src]);

  useEffect(() => {
    // If loading is eager, bypass IntersectionObserver to load immediately
    if (loading === 'eager') {
      setIsInView(true);
      return;
    }

    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once in view, we can stop observing this image
          if (containerRef.current) {
            observer.unobserve(containerRef.current);
          }
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, loading, rootMargin, threshold]);

  // Handle high-resolution image loading
  const handleMainImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-100 ${className}`}
    >
      {/* 1. Shimmer/Skeleton loader displayed until either thumbnail or high-res is loaded */}
      {!isLoaded && !thumbnailLoaded && (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      )}

      {/* 2. Tiny Blurred Thumbnail (Blur-up Phase) */}
      {isInView && !isLoaded && (
        <img
          src={placeholderUrl}
          alt=""
          aria-hidden="true"
          onLoad={() => setThumbnailLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none filter blur-lg scale-105`}
        />
      )}

      {/* 3. High-Resolution Core Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleMainImageLoad}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isLoaded 
              ? 'opacity-100 blur-none scale-100' 
              : 'opacity-0 blur-md scale-[1.02]'
          }`}
          loading={loading}
          referrerPolicy={referrerPolicy}
          {...rest}
        />
      )}
    </div>
  );
}
