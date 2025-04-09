"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { getPokemons } from "@/api/queries";
import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { EmptyState } from "@/components/pokemon/empty-state";

export const GridList = () => {
  const { ref, inView } = useInView({
    // Increase the threshold to load more data earlier
    threshold: 0.1,
  });
  const searchParams = useSearchParams();

  // Extract filters from URL search params
  const filters = {
    type: searchParams.get("type") || "all",
    generation: searchParams.get("generation") || "all",
    search: searchParams.get("search") || "",
  };

  // Use infinite query with filters in the query key
  // This ensures the query is refetched when filters change
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ["pokemons", filters],
    queryFn: ({ pageParam }) => getPokemons({ pageParam, filters }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  // Load more data when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-destructive">
        Error loading pokemons
      </div>
    );
  }

  // Check if we have any data across all pages
  const hasData = data?.pages.some((page) => page.data.length > 0) ?? false;

  if (!hasData) {
    return (
      <EmptyState
        message={`No Pokémon found with the selected filters. Try changing your filters.`}
      />
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.pages.flatMap((page) =>
          page.data.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))
        )}
      </div>

      {/* Loading indicator at the bottom for infinite scrolling */}
      <div ref={ref} className="flex items-center justify-center p-4 mt-4">
        {isFetchingNextPage && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        )}
      </div>
    </section>
  );
};
