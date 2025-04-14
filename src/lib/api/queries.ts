import { pokemonColors } from "@/lib/data/colors";
import {
  PaginatedResponse,
  EvolutionChain,
  Pokemon,
  PokemonType,
} from "@/lib/api/types";

/**
 * Fetches all related Pokémon from an evolution chain
 * This function recursively processes the evolution chain to get all Pokémon in the chain
 * @param chain - The evolution chain object containing the base Pokémon and its evolutions
 * @returns Promise<Pokemon[]> - Array of all Pokémon in the evolution chain
 */
export const getRelatedPokemonFromEvolutionChain = async (
  chain: EvolutionChain
): Promise<Pokemon[]> => {
  const relatedPokemon: Pokemon[] = [];

  /**
   * Recursive function to process each evolution in the chain
   * @param evolution - Current evolution chain node to process
   */
  const processEvolution = async (evolution: EvolutionChain) => {
    // Fetch Pokémon and species data in parallel for better performance
    const [pokemonResponse, speciesResponse] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${evolution.species.name}`),
      fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${evolution.species.name}`
      ),
    ]);

    // Parse both responses in parallel
    const [pokemonData, speciesData] = await Promise.all([
      pokemonResponse.json(),
      speciesResponse.json(),
    ]);

    // Get the Pokémon's color from the species data and find its corresponding color code
    const colorName = speciesData.color.name;
    const colorCode =
      pokemonColors.find((color) => color.name === colorName)?.code ||
      "#000000";

    // Get the Pokémon's image, prioritizing official artwork, then default sprite, or fallback to placeholder
    const image =
      pokemonData.sprites.other["official-artwork"]?.front_default ||
      pokemonData.sprites.front_default ||
      "/images/placeholder.webp";

    // Add the processed Pokémon to our results array
    relatedPokemon.push({
      id: pokemonData.id,
      name: pokemonData.name,
      sprites: { front_default: image },
      types: pokemonData.types,
      stats: pokemonData.stats,
      generation: speciesData.generation.name,
      color: colorName,
      colorCode: colorCode,
      evolutions: [],
      weight: pokemonData.weight,
      height: pokemonData.height,
    });

    // If there are more evolutions, process them recursively
    if (evolution.evolves_to?.length > 0) {
      await Promise.all(evolution.evolves_to.map(processEvolution));
    }
  };

  await processEvolution(chain);
  return relatedPokemon;
};

/**
 * Fetches a paginated list of Pokémon with optional filters
 * @param pageParam - Current page number for pagination
 * @param filters - Object containing type, generation, and search filters
 * @returns Promise<PaginatedResponse> - Paginated response with Pokémon data
 */
export const getPokemons = async ({
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
}): Promise<PaginatedResponse> => {
  const baseLimit = 20;
  const limit =
    filters.type !== "all" || filters.generation !== "all" || filters.search
      ? baseLimit * 3
      : baseLimit;

  const offset = pageParam * limit;

  if (filters.search) {
    try {
      // First, fetch all species data to get evolution chain URLs
      const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species?limit=1000&offset=0`
      );

      if (!speciesResponse.ok) {
        throw new Error(`HTTP error! status: ${speciesResponse.status}`);
      }

      const speciesData = await speciesResponse.json();
      const searchTerm = filters.search.toLowerCase();

      // Filter species by name
      const matchingSpecies = speciesData.results.filter(
        (species: { name: string }) =>
          species.name.toLowerCase().includes(searchTerm)
      );

      // Track processed evolution chains to avoid duplicates
      const processedEvolutionChains = new Set<string>();
      const uniquePokemonMap = new Map<number, Pokemon>();

      // Process each matching species
      await Promise.all(
        matchingSpecies.map(async (species: { url: string }) => {
          // Fetch species details to get evolution chain URL
          const speciesDetailsResponse = await fetch(species.url);
          const speciesDetails = await speciesDetailsResponse.json();

          // Skip if we've already processed this evolution chain
          if (
            processedEvolutionChains.has(speciesDetails.evolution_chain.url)
          ) {
            return;
          }

          processedEvolutionChains.add(speciesDetails.evolution_chain.url);

          // Fetch evolution chain data
          const evolutionResponse = await fetch(
            speciesDetails.evolution_chain.url
          );
          const evolutionData = await evolutionResponse.json();

          // Get all Pokémon in the evolution chain
          const relatedPokemon = await getRelatedPokemonFromEvolutionChain(
            evolutionData.chain
          );

          // Add all related Pokémon to our map
          relatedPokemon.forEach((pokemon) =>
            uniquePokemonMap.set(pokemon.id, pokemon)
          );
        })
      );

      // Convert map to array and apply additional filters
      const allRelatedPokemon = Array.from(uniquePokemonMap.values());
      const filteredPokemons = allRelatedPokemon
        .filter(
          (pokemon) =>
            (filters.type === "all" ||
              pokemon.types.some(
                (type: PokemonType) => type.type.name === filters.type
              )) &&
            (filters.generation === "all" ||
              pokemon.generation === filters.generation)
        )
        .sort((a, b) => a.id - b.id);

      // Apply pagination to filtered results
      const startIndex = offset;
      const endIndex = Math.min(startIndex + limit, filteredPokemons.length);
      const paginatedResults = filteredPokemons.slice(startIndex, endIndex);

      return {
        data: paginatedResults,
        nextCursor: endIndex < filteredPokemons.length ? pageParam + 1 : null,
        total: filteredPokemons.length,
      };
    } catch (error) {
      console.error("Error during search:", error);
      return {
        data: [],
        nextCursor: null,
        total: 0,
      };
    }
  }

  // Regular paginated fetch without search
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();

  // Process each Pokémon in the current page
  const pokemons = await Promise.all(
    data.results.map(async (pokemon: { url: string }) => {
      // Fetch Pokémon and species data in parallel
      const [pokemonResponse, speciesResponse] = await Promise.all([
        fetch(pokemon.url),
        fetch(pokemon.url.replace("pokemon", "pokemon-species")),
      ]);

      const [pokemonData, speciesData] = await Promise.all([
        pokemonResponse.json(),
        speciesResponse.json(),
      ]);

      // Process color and image data
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
        sprites: { front_default: image },
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

  // Apply type and generation filters
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

  // Check if we need to fetch more data
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
};

/**
 * Fetches detailed information about a specific Pokémon by ID
 * @param id - The Pokémon's ID
 * @returns Promise<Pokemon> - Detailed Pokémon information including evolution chain
 */
export const getPokemonById = async (id: string): Promise<Pokemon> => {
  // Fetch Pokémon and species data in parallel
  const [pokemonResponse, speciesResponse] = await Promise.all([
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`),
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
  ]);

  const [pokemonData, speciesData] = await Promise.all([
    pokemonResponse.json(),
    speciesResponse.json(),
  ]);

  // Fetch and process evolution chain
  const evolutionResponse = await fetch(speciesData.evolution_chain.url);
  const evolutionData = await evolutionResponse.json();

  const evolutions = await getRelatedPokemonFromEvolutionChain(
    evolutionData.chain
  );

  // Process color data
  const colorName = speciesData.color.name;
  const colorCode =
    pokemonColors.find((color) => color.name === colorName)?.code || "#000000";

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    sprites: {
      front_default:
        pokemonData.sprites.other["official-artwork"]?.front_default ||
        pokemonData.sprites.front_default ||
        "/images/placeholder.webp",
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
};
