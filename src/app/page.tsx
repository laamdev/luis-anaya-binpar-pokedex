import { GenerationFilters } from "@/components/pokemon/generation-filters";
import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { TypeFilters } from "@/components/pokemon/type-filters";
import { ListPagination } from "@/components/pokemon/list-pagination";
import { SearchInput } from "@/components/pokemon/search-input";
import { SortFilters } from "@/components/pokemon/sort-filters";
import { MobileFilterSheet } from "@/components/pokemon/mobile-filter-sheet";

import { getGenerations, getPokemons } from "@/api/queries";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const {
    generation,
    type,
    sort,
    page: pageParam,
    limit: limitParam,
    search,
  } = await searchParams;

  const page = pageParam ? parseInt(pageParam as string) : 1;
  const limit = limitParam ? parseInt(limitParam as string) : 20;
  const offset = (page - 1) * limit;

  const pokemonsResponse = await getPokemons({
    generation: generation as string | undefined,
    type: type as string | undefined,
    limit,
    offset,
    sort: sort as string | undefined,
    search: search as string | undefined,
  });

  const generations = await getGenerations();

  const totalPages = Math.ceil(pokemonsResponse.total / limit);

  return (
    <section>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl text-center font-bold">
          Search for your favorite Pokémon!
        </h1>
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <SearchInput />
            </div>
            <MobileFilterSheet generations={generations} />
          </div>
        </div>
      </div>
      <div className="hidden md:flex mt-12 justify-between items-center flex-col sm:flex-row gap-4">
        <div>
          <p className="text-xs font-mono uppercase tracking-wider opacity-75">
            Filter by
          </p>
          <div className="flex gap-4 sm:flex-row flex-col mt-2">
            <TypeFilters />
            <GenerationFilters generations={generations} />
          </div>
        </div>
        <div>
          <p className="text-xs font-mono uppercase tracking-wider opacity-75">
            Sort by
          </p>
          <div className="flex gap-4 mt-2">
            <SortFilters />
          </div>
        </div>
      </div>
      <ul className="grid mt-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 auto-rows-fr">
        {pokemonsResponse.data.map((pokemon) => (
          <li key={pokemon.name} className="h-full">
            <PokemonCard pokemon={pokemon} />
          </li>
        ))}
      </ul>

      <div className="mt-12">
        <ListPagination
          currentPage={page}
          totalPages={totalPages}
          limit={limit}
        />
      </div>
    </section>
  );
}
