import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { GenerationFilters } from "@/components/pokemon/generation-filters";
import { TypeFilters } from "@/components/pokemon/type-filters";
import { SearchBar } from "@/components/pokemon/search-bar";
import { GridList } from "@/components/pokemon/grid-list";

import { getQueryClient } from "@/lib/get-query-client";
import { getPokemons } from "@/api/queries";

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
          <p className="text-xs font-mono uppercase tracking-wider opacity-75">
            Search by Name
          </p>
          <div className="flex gap-4 sm:flex-row flex-col mt-2 w-full">
            <Suspense
              fallback={
                <div className="w-full h-10 bg-muted animate-pulse rounded-md" />
              }
            >
              <SearchBar />
            </Suspense>
          </div>
        </div>

        <div className="w-full">
          <p className="text-xs font-mono uppercase tracking-wider opacity-75">
            Filter by
          </p>
          <div className="flex gap-4 w-full mt-2">
            <Suspense
              fallback={
                <div className="w-full h-10 bg-muted animate-pulse rounded-md" />
              }
            >
              <TypeFilters />
            </Suspense>
            <Suspense
              fallback={
                <div className="w-full h-10 bg-muted animate-pulse rounded-md" />
              }
            >
              <GenerationFilters />
            </Suspense>
          </div>
        </div>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="mt-12">
          <Suspense
            fallback={
              <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }
          >
            <GridList />
          </Suspense>
        </div>
      </HydrationBoundary>
    </section>
  );
}
