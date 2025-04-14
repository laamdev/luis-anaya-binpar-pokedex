import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { GenerationFilters } from "@/components/pokemons/generation-filters";
import { TypeFilters } from "@/components/pokemons/type-filters";
import { SearchBar } from "@/components/pokemons/search-bar";
import { PokemonsGridList } from "@/components/pokemons/pokemons-grid-list";
import { FilterLabel } from "@/components/shared/filter-label";
import { FilterSkeleton } from "@/components/shared/filter-skeleton";
import { GridSkeleton } from "@/components/pokemons/grid-skeleton";

import { getQueryClient } from "@/lib/api/query-client";
import { getPokemons } from "@/lib/api/queries";

export default async function Home() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["pokemons", { type: "all", generation: "all", search: "" }],
    queryFn: ({ pageParam }) =>
      getPokemons({
        pageParam,
        filters: { type: "all", generation: "all", search: "" },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    pages: 1,
  });

  return (
    <section>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl uppercase text-center font-bold">
          BinPar Pokédex
        </h1>
      </div>

      <div className="flex items-center lg:flex-row flex-col justify-between gap-12 mt-24 w-full">
        <div className="w-full">
          <FilterLabel label="Search by Name" />
          <div className="flex gap-4 sm:flex-row flex-col mt-2 w-full">
            <Suspense fallback={<FilterSkeleton />}>
              <SearchBar />
            </Suspense>
          </div>
        </div>

        <div className="w-full">
          <FilterLabel label="Filter by" />
          <div className="flex gap-4 w-full mt-2">
            <Suspense fallback={<FilterSkeleton />}>
              <TypeFilters />
            </Suspense>
            <Suspense fallback={<FilterSkeleton />}>
              <GenerationFilters />
            </Suspense>
          </div>
        </div>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="mt-12 min-h-screen">
          <Suspense fallback={<GridSkeleton />}>
            <PokemonsGridList />
          </Suspense>
        </div>
      </HydrationBoundary>
    </section>
  );
}
