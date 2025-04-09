import { pokemonColors } from "@/lib/data/colors";

// INTERFACES

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonEvolution {
  name: string;
  image: string;
}

interface EvolutionChain {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChain[];
}

export interface PokemonListItem {
  name: string;
  image: string;
}

export interface PokemonListResponse {
  data: Pokemon[];
  nextCursor: number | null;
  total: number;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
  stats: PokemonStat[];
  generation: string;
  color: string;
  colorCode: string;
  evolutions: PokemonEvolution[];
  weight: number;
  height: number;
}

export interface PokemonResponse {
  data: Pokemon[];
  total: number;
}

// HELPERS

export const getRelatedPokemonFromEvolutionChain = async (
  chain: EvolutionChain
): Promise<Pokemon[]> => {
  const relatedPokemon: Pokemon[] = [];

  // Process evolution chain
  const processEvolution = async (evolution: EvolutionChain) => {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`
    );
    const pokemonData = await pokemonResponse.json();

    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();

    const colorName = speciesData.color.name;
    const colorCode =
      pokemonColors.find((color) => color.name === colorName)?.code ||
      "#000000";

    const image =
      pokemonData.sprites.other["official-artwork"]?.front_default ||
      pokemonData.sprites.front_default ||
      "/images/placeholder.webp";

    relatedPokemon.push({
      id: pokemonData.id,
      name: pokemonData.name,
      sprites: {
        front_default: image,
      },
      types: pokemonData.types,
      stats: pokemonData.stats,
      generation: speciesData.generation.name,
      color: colorName,
      colorCode: colorCode,
      evolutions: [],
      weight: pokemonData.weight,
      height: pokemonData.height,
    });

    if (evolution.evolves_to && evolution.evolves_to.length > 0) {
      for (const nextEvolution of evolution.evolves_to) {
        await processEvolution(nextEvolution);
      }
    }
  };

  await processEvolution(chain);
  return relatedPokemon;
};

// QUERIES

export async function getPokemons({
  pageParam = 0,
  filters = {
    type: "all",
    generation: "all",
    search: "",
  },
}: {
  pageParam?: number;
  filters?: {
    type: string;
    generation: string;
    search: string;
  };
}) {
  const baseLimit = 20;
  const limit =
    filters.type !== "all" || filters.generation !== "all" || filters.search
      ? baseLimit * 3
      : baseLimit;

  const offset = pageParam * limit;

  if (filters.search) {
    const allPokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0`
    );
    const allPokemonData = await allPokemonResponse.json();

    // Filter Pokémon by name
    const searchTerm = filters.search.toLowerCase();
    const matchingPokemon = allPokemonData.results.filter(
      (pokemon: { name: string }) =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );

    // Avoid evolution chain duplicates
    const processedEvolutionChains = new Set<string>();

    // Track unique Pokémon by ID
    const uniquePokemonMap = new Map<number, Pokemon>();

    // Get evolution chain for each matching Pokémon
    for (const pokemon of matchingPokemon) {
      const response = await fetch(pokemon.url);
      const pokemonData = await response.json();

      const speciesResponse = await fetch(pokemonData.species.url);
      const speciesData = await speciesResponse.json();

      // Get evolution chain
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();

      // Check already processed evolution chain
      if (processedEvolutionChains.has(evolutionData.chain.species.name)) {
        continue; // Skip chain processed
      }

      // Mark chain as processed
      processedEvolutionChains.add(evolutionData.chain.species.name);

      // Get related Pokémon from evolution chain
      const relatedPokemon = await getRelatedPokemonFromEvolutionChain(
        evolutionData.chain
      );

      // Add each Pokémon to unique map
      for (const pokemon of relatedPokemon) {
        uniquePokemonMap.set(pokemon.id, pokemon);
      }
    }

    const allRelatedPokemon = Array.from(uniquePokemonMap.values());

    // Calculate pagination for filtered results
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, allRelatedPokemon.length);
    const paginatedResults = allRelatedPokemon.slice(startIndex, endIndex);

    // Apply type and generation filters
    let filteredPokemons = paginatedResults;

    if (filters.type !== "all") {
      filteredPokemons = filteredPokemons.filter((pokemon) =>
        pokemon.types.some(
          (type: PokemonType) => type.type.name === filters.type
        )
      );
    }

    if (filters.generation !== "all") {
      filteredPokemons = filteredPokemons.filter(
        (pokemon) => pokemon.generation === filters.generation
      );
    }

    // Sort by ID
    filteredPokemons.sort((a, b) => a.id - b.id);

    return {
      data: filteredPokemons,
      nextCursor: endIndex < allRelatedPokemon.length ? pageParam + 1 : null,
      total: allRelatedPokemon.length,
    };
  }

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();

  const pokemons = await Promise.all(
    data.results.map(async (pokemon: { name: string; url: string }) => {
      const response = await fetch(pokemon.url);
      const pokemonData = await response.json();

      const speciesResponse = await fetch(pokemonData.species.url);
      const speciesData = await speciesResponse.json();

      const colorName = speciesData.color.name;
      const colorCode =
        pokemonColors.find((color) => color.name === colorName)?.code ||
        "#000000";

      const image =
        pokemonData.sprites.other["official-artwork"]?.front_default ||
        pokemonData.sprites.front_default ||
        "/images/placeholder.webp";

      return {
        id: pokemonData.id,
        name: pokemonData.name,
        sprites: {
          front_default: image,
        },
        types: pokemonData.types,
        stats: pokemonData.stats,
        generation: speciesData.generation.name,
        color: colorName,
        colorCode: colorCode,
        evolutions: [],
        weight: pokemonData.weight,
        height: pokemonData.height,
      };
    })
  );

  let filteredPokemons = pokemons;

  if (filters.type !== "all") {
    filteredPokemons = filteredPokemons.filter((pokemon) =>
      pokemon.types.some((type: PokemonType) => type.type.name === filters.type)
    );
  }

  if (filters.generation !== "all") {
    filteredPokemons = filteredPokemons.filter(
      (pokemon) => pokemon.generation === filters.generation
    );
  }

  filteredPokemons.sort((a, b) => a.id - b.id);

  const hasMoreData = data.next !== null;
  const needsMoreData = filteredPokemons.length === 0 && hasMoreData;

  if (needsMoreData) {
    return getPokemons({
      pageParam: pageParam + 1,
      filters,
    });
  }

  return {
    data: filteredPokemons,
    nextCursor: data.next ? pageParam + 1 : null,
    total: data.count,
  };
}

export async function getPokemonById(id: string): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemonData = await response.json();

  const speciesResponse = await fetch(pokemonData.species.url);
  const speciesData = await speciesResponse.json();

  const evolutions = await getEvolutionChain(pokemonData.species.url);

  const colorName = speciesData.color.name;
  const colorCode =
    pokemonColors.find((color) => color.name === colorName)?.code || "#000000";

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    sprites: {
      front_default:
        pokemonData.sprites.other["official-artwork"].front_default,
    },
    types: pokemonData.types,
    stats: pokemonData.stats,
    generation: speciesData.generation.name,
    color: colorName,
    colorCode: colorCode,
    evolutions,
    weight: pokemonData.weight,
    height: pokemonData.height,
  };
}

async function getEvolutionChain(
  speciesUrl: string
): Promise<PokemonEvolution[]> {
  const speciesResponse = await fetch(speciesUrl);
  const speciesData = await speciesResponse.json();

  const evolutionResponse = await fetch(speciesData.evolution_chain.url);
  const evolutionData = await evolutionResponse.json();

  const evolutions: PokemonEvolution[] = [];

  // Helper function to process evolution chain
  const processEvolution = async (evolution: EvolutionChain) => {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`
    );
    const pokemonData = await pokemonResponse.json();

    evolutions.push({
      name: evolution.species.name,
      image: pokemonData.sprites.front_default,
    });

    if (evolution.evolves_to && evolution.evolves_to.length > 0) {
      for (const nextEvolution of evolution.evolves_to) {
        await processEvolution(nextEvolution);
      }
    }
  };

  await processEvolution(evolutionData.chain);
  return evolutions;
}
