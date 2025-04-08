import { pokemonColors } from "@/lib/data/colors";

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

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
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

export interface PokemonResponse {
  data: Pokemon[];
  total: number;
}

export async function getPokemons({
  generation,
  type,
  limit = 20,
  offset = 0,
  sort = "id",
  search,
}: {
  generation?: string;
  type?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  search?: string;
}): Promise<PokemonResponse> {
  try {
    if (search) {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=1302`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon list: ${response.status}`);
        }

        const data: PokemonListResponse = await response.json();
        const allPokemonNames = data.results.map((p) => p.name);

        const matchingPokemonNames = allPokemonNames.filter((name) =>
          name.toLowerCase().includes(search.toLowerCase())
        );

        const evolutionPromises = matchingPokemonNames.map(async (name) => {
          try {
            const pokemonResponse = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${name}`
            );
            if (!pokemonResponse.ok) return null;
            const pokemonData = await pokemonResponse.json();

            const speciesResponse = await fetch(pokemonData.species.url);
            if (!speciesResponse.ok) return null;
            const speciesData = await speciesResponse.json();

            const evolutionResponse = await fetch(
              speciesData.evolution_chain.url
            );
            if (!evolutionResponse.ok) return null;
            const evolutionData = await evolutionResponse.json();

            const evolutionNames = new Set<string>();
            const processEvolution = (chain: EvolutionChain) => {
              evolutionNames.add(chain.species.name);
              chain.evolves_to.forEach(processEvolution);
            };
            processEvolution(evolutionData.chain);

            return Array.from(evolutionNames);
          } catch (error) {
            console.error(`Error getting evolution chain for ${name}:`, error);
            return [name];
          }
        });

        const evolutionResults = await Promise.all(evolutionPromises);
        const allRelatedPokemonNames = new Set<string>();
        evolutionResults.forEach((names) => {
          if (names) names.forEach((name) => allRelatedPokemonNames.add(name));
        });

        const filteredPokemonNames = Array.from(allRelatedPokemonNames);

        const total = filteredPokemonNames.length;
        const paginatedPokemonNames = filteredPokemonNames.slice(
          offset,
          offset + limit
        );

        const pokemonPromises = paginatedPokemonNames.map(async (name) => {
          try {
            const pokemonResponse = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${name}`
            );
            if (!pokemonResponse.ok) {
              console.error(
                `Failed to fetch Pokémon details for ${name}: ${pokemonResponse.status}`
              );
              return null;
            }
            const pokemonData = await pokemonResponse.json();

            const speciesResponse = await fetch(pokemonData.species.url);
            if (!speciesResponse.ok) {
              console.error(
                `Failed to fetch species data for ${name}: ${speciesResponse.status}`
              );
              return null;
            }
            const speciesData = await speciesResponse.json();

            const evolutions = await getEvolutionChain(pokemonData.species.url);

            const colorName = speciesData.color.name;
            const colorCode =
              pokemonColors.find((color) => color.name === colorName)?.code ||
              "#000000";

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
            } as Pokemon;
          } catch (error) {
            console.error(`Error processing Pokémon ${name}:`, error);
            return null;
          }
        });

        const pokemonResults = await Promise.all(pokemonPromises);
        const pokemonList = pokemonResults.filter(
          (pokemon): pokemon is Pokemon => pokemon !== null
        );

        const sortedPokemonList = [...pokemonList];
        if (sort === "name-desc") {
          sortedPokemonList.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sort === "name-asc") {
          sortedPokemonList.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          sortedPokemonList.sort((a, b) => a.id - b.id);
        }

        return {
          data: sortedPokemonList,
          total,
        };
      } catch (error) {
        console.error("Error in search:", error);
        return { data: [], total: 0 };
      }
    }

    if (generation && type) {
      try {
        const typeResponse = await fetch(
          `https://pokeapi.co/api/v2/type/${type}`
        );
        if (!typeResponse.ok) {
          console.error(`Failed to fetch type data: ${typeResponse.status}`);
          return getPokemons({ generation, limit, offset });
        }
        const typeData = await typeResponse.json();
        const typePokemonNames = typeData.pokemon.map(
          (p: { pokemon: { name: string } }) => p.pokemon.name
        );

        const generationResponse = await fetch(
          `https://pokeapi.co/api/v2/generation/${generation}`
        );
        if (!generationResponse.ok) {
          console.error(
            `Failed to fetch generation data: ${generationResponse.status}`
          );
          return getPokemons({ type, limit, offset });
        }
        const generationData = await generationResponse.json();
        const generationPokemonNames = generationData.pokemon_species.map(
          (p: { name: string }) => p.name
        );

        const filteredPokemonNames = typePokemonNames.filter((name: string) =>
          generationPokemonNames.includes(name)
        );

        if (filteredPokemonNames.length === 0) {
          console.log(
            `No Pokémon found matching both type ${type} and generation ${generation}`
          );
          return { data: [], total: 0 };
        }

        const total = filteredPokemonNames.length;
        const paginatedPokemonNames = filteredPokemonNames.slice(
          offset,
          offset + limit
        );

        const pokemonPromises = paginatedPokemonNames.map(
          async (name: string) => {
            try {
              const pokemonResponse = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${name}`
              );
              if (!pokemonResponse.ok) {
                console.error(
                  `Failed to fetch Pokémon details for ${name}: ${pokemonResponse.status}`
                );
                return null;
              }
              const pokemonData = await pokemonResponse.json();

              const speciesResponse = await fetch(pokemonData.species.url);
              if (!speciesResponse.ok) {
                console.error(
                  `Failed to fetch species data for ${name}: ${speciesResponse.status}`
                );
                return null;
              }
              const speciesData = await speciesResponse.json();

              const evolutions = await getEvolutionChain(
                pokemonData.species.url
              );

              const colorName = speciesData.color.name;
              const colorCode =
                pokemonColors.find((color) => color.name === colorName)?.code ||
                "#000000";

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
              } as Pokemon;
            } catch (error) {
              console.error(`Error processing Pokémon ${name}:`, error);
              return null;
            }
          }
        );

        const pokemonResults = await Promise.all(pokemonPromises);
        const pokemonList = pokemonResults.filter(
          (pokemon): pokemon is Pokemon => pokemon !== null
        );

        const sortedPokemonList = [...pokemonList];
        if (sort === "name-desc") {
          sortedPokemonList.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sort === "name-asc") {
          sortedPokemonList.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          sortedPokemonList.sort((a, b) => a.id - b.id);
        }

        return {
          data: sortedPokemonList,
          total,
        };
      } catch (error) {
        console.error("Error in combined filter:", error);
        return getPokemons({ limit, offset });
      }
    } else if (generation) {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/generation/${generation}`
        );

        if (!response.ok) {
          console.error(`Failed to fetch generation data: ${response.status}`);
          return getPokemons({ limit, offset });
        }

        const data = await response.json();
        const pokemonNames = data.pokemon_species.map(
          (p: { name: string }) => p.name
        );
        const total = pokemonNames.length;

        const paginatedPokemonNames = pokemonNames.slice(
          offset,
          offset + limit
        );

        const pokemonPromises = paginatedPokemonNames.map(
          async (name: string) => {
            try {
              const pokemonResponse = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${name}`
              );
              if (!pokemonResponse.ok) {
                console.error(
                  `Failed to fetch Pokémon details for ${name}: ${pokemonResponse.status}`
                );
                return null;
              }
              const pokemonData = await pokemonResponse.json();

              const speciesResponse = await fetch(pokemonData.species.url);
              if (!speciesResponse.ok) {
                console.error(
                  `Failed to fetch species data for ${name}: ${speciesResponse.status}`
                );
                return null;
              }
              const speciesData = await speciesResponse.json();

              const evolutions = await getEvolutionChain(
                pokemonData.species.url
              );

              const colorName = speciesData.color.name;
              const colorCode =
                pokemonColors.find((color) => color.name === colorName)?.code ||
                "#000000";

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
              } as Pokemon;
            } catch (error) {
              console.error(`Error processing Pokémon ${name}:`, error);
              return null;
            }
          }
        );

        const pokemonResults = await Promise.all(pokemonPromises);
        const pokemonList = pokemonResults.filter(
          (pokemon): pokemon is Pokemon => pokemon !== null
        );

        const sortedPokemonList = [...pokemonList];
        if (sort === "name-desc") {
          sortedPokemonList.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sort === "name-asc") {
          sortedPokemonList.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          sortedPokemonList.sort((a, b) => a.id - b.id);
        }

        return {
          data: sortedPokemonList,
          total,
        };
      } catch (error) {
        console.error("Error in generation filter:", error);
        return getPokemons({ limit, offset });
      }
    } else if (type) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);

        if (!response.ok) {
          console.error(`Failed to fetch type data: ${response.status}`);
          return getPokemons({ limit, offset });
        }

        const data = await response.json();
        const pokemonNames = data.pokemon.map(
          (p: { pokemon: { name: string } }) => p.pokemon.name
        );
        const total = pokemonNames.length;

        const paginatedPokemonNames = pokemonNames.slice(
          offset,
          offset + limit
        );

        const pokemonPromises = paginatedPokemonNames.map(
          async (name: string) => {
            try {
              const pokemonResponse = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${name}`
              );
              if (!pokemonResponse.ok) {
                console.error(
                  `Failed to fetch Pokémon details for ${name}: ${pokemonResponse.status}`
                );
                return null;
              }
              const pokemonData = await pokemonResponse.json();

              const speciesResponse = await fetch(pokemonData.species.url);
              if (!speciesResponse.ok) {
                console.error(
                  `Failed to fetch species data for ${name}: ${speciesResponse.status}`
                );
                return null;
              }
              const speciesData = await speciesResponse.json();

              const evolutions = await getEvolutionChain(
                pokemonData.species.url
              );

              const colorName = speciesData.color.name;
              const colorCode =
                pokemonColors.find((color) => color.name === colorName)?.code ||
                "#000000";

              return {
                id: pokemonData.id,
                name: pokemonData.name,
                sprites: {
                  front_default:
                    pokemonData.sprites.other["official-artwork"]
                      .front_default ?? pokemonData.sprites.front_default,
                },
                types: pokemonData.types,
                stats: pokemonData.stats,
                generation: speciesData.generation.name,
                color: colorName,
                colorCode: colorCode,
                evolutions,
              } as Pokemon;
            } catch (error) {
              console.error(`Error processing Pokémon ${name}:`, error);
              return null;
            }
          }
        );

        const pokemonResults = await Promise.all(pokemonPromises);
        const pokemonList = pokemonResults.filter(
          (pokemon): pokemon is Pokemon => pokemon !== null
        );

        const sortedPokemonList = [...pokemonList];
        if (sort === "name-desc") {
          sortedPokemonList.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sort === "name-asc") {
          sortedPokemonList.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          sortedPokemonList.sort((a, b) => a.id - b.id);
        }

        return {
          data: sortedPokemonList,
          total,
        };
      } catch (error) {
        console.error("Error in type filter:", error);
        return getPokemons({ limit, offset });
      }
    } else {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=1302`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon list: ${response.status}`);
        }

        const data: PokemonListResponse = await response.json();
        const total = data.count;

        const paginatedResults = data.results.slice(offset, offset + limit);

        const pokemonPromises = paginatedResults.map(async (pokemon) => {
          try {
            const pokemonResponse = await fetch(pokemon.url);

            if (!pokemonResponse.ok) {
              console.error(
                `Failed to fetch Pokémon details for ${pokemon.name}: ${pokemonResponse.status}`
              );
              return null;
            }

            const pokemonData = await pokemonResponse.json();

            const speciesResponse = await fetch(pokemonData.species.url);
            if (!speciesResponse.ok) {
              console.error(
                `Failed to fetch species data for ${pokemon.name}: ${speciesResponse.status}`
              );
              return null;
            }
            const speciesData = await speciesResponse.json();

            const evolutions = await getEvolutionChain(pokemonData.species.url);

            const colorName = speciesData.color.name;
            const colorCode =
              pokemonColors.find((color) => color.name === colorName)?.code ||
              "#000000";

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
            } as Pokemon;
          } catch (error) {
            console.error(`Error processing Pokémon ${pokemon.name}:`, error);
            return null;
          }
        });

        const pokemonResults = await Promise.all(pokemonPromises);
        const pokemonList = pokemonResults.filter(
          (pokemon): pokemon is Pokemon => pokemon !== null
        );

        const sortedPokemonList = [...pokemonList];
        if (sort === "name-desc") {
          sortedPokemonList.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sort === "name-asc") {
          sortedPokemonList.sort((a, b) => a.name.localeCompare(b.name));
        } else {
          sortedPokemonList.sort((a, b) => a.id - b.id);
        }

        return {
          data: sortedPokemonList,
          total,
        };
      } catch (error) {
        console.error("Error fetching all Pokémon:", error);
        return { data: [], total: 0 };
      }
    }
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    return { data: [], total: 0 };
  }
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

export async function getGenerations(): Promise<Generation[]> {
  const response = await fetch("https://pokeapi.co/api/v2/generation");
  const data = await response.json();
  return data.results;
}

export interface Generation {
  name: string;
  url: string;
}
