import { useState, useEffect, useRef, useCallback } from 'react';

export interface ViewportBounds {
  width: number;
  height: number;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  aspectRatio: number;
  containerRef: (node: HTMLElement | null) => void;
}

export function useViewportBounds(debounceMs: number = 100): ViewportBounds {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900
  });

  const nodeRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const updateDimensions = useCallback((w: number, h: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDimensions((prev) => {
        if (prev.width === w && prev.height === h) return prev;
        return { width: w, height: h };
      });
    }, debounceMs);
  }, [debounceMs]);

  const containerRef = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    nodeRef.current = node;

    if (node && typeof ResizeObserver !== 'undefined') {
      observerRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          updateDimensions(Math.round(width), Math.round(height));
        }
      });
      observerRef.current.observe(node);
    }
  }, [updateDimensions]);

  useEffect(() => {
    const handleWindowResize = () => {
      if (!nodeRef.current) {
        updateDimensions(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleWindowResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [updateDimensions]);

  const isDesktop = dimensions.width >= 1024;
  const isTablet = dimensions.width >= 768 && dimensions.width < 1024;
  const isMobile = dimensions.width < 768;
  const aspectRatio = dimensions.height > 0 ? Number((dimensions.width / dimensions.height).toFixed(2)) : 1.77;

  return {
    width: dimensions.width,
    height: dimensions.height,
    isDesktop,
    isTablet,
    isMobile,
    aspectRatio,
    containerRef
  };
}
