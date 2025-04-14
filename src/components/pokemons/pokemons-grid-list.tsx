"use client";

import { useSearchParams } from "next/navigation";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";

import { PokemonCard } from "@/components/pokemons/pokemon-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Spinner } from "@/components/shared/spinner";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { ErrorState } from "@/components/shared/error-state";

import { getPokemons } from "@/lib/api/queries";

export const PokemonsGridList = () => {
  const searchParams = useSearchParams();

  const filters = {
    type: searchParams.get("type") || "all",
    generation: searchParams.get("generation") || "all",
    search: searchParams.get("search") || "",
  };

  const { data, isFetchingNextPage, hasNextPage, fetchNextPage, error } =
    useSuspenseInfiniteQuery({
      queryKey: ["pokemons", filters],
      queryFn: ({ pageParam }) => getPokemons({ pageParam, filters }),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  if (error) {
    return (
      <ErrorState message="There was an error loading the data. Please refresh the page." />
    );
  }

  const hasData = data?.pages.some((page) => page.data.length > 0) ?? false;

  if (!hasData) {
    return (
      <EmptyState
        message={`No Pokémon found with the selected filters. Try changing your filters.`}
      />
    );
  }

  return (
    <AnimatePresence key={JSON.stringify(filters)}>
      <motion.div
        key="grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <InfiniteScroll
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
          threshold={100}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.pages.flatMap((page) =>
              page.data.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))
            )}
          </div>
          {isFetchingNextPage && (
            <div className="flex items-center justify-center p-4 mt-4">
              <Spinner />
            </div>
          )}
        </InfiniteScroll>
      </motion.div>
    </AnimatePresence>
  );
};
