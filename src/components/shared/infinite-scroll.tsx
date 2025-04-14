"use client";

import { useEffect, useRef, ReactNode } from "react";

interface InfinteScrollProps {
  children: ReactNode;
  hasNextPage: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const InfiniteScroll = ({
  children,
  hasNextPage,
  onLoadMore,
  threshold = 100,
}: InfinteScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && hasNextPage) {
          onLoadMore();
        }
      },
      { rootMargin: `0px 0px ${threshold}px 0px` }
    );

    const currentContainer = containerRef.current;

    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, [hasNextPage, onLoadMore, threshold]);

  return (
    <div>
      {children}
      <div ref={containerRef} className="h-1" />
    </div>
  );
};
