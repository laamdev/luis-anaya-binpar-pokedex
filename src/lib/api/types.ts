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
  weight: number;
  height: number;
}

export interface EvolutionChain {
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

export interface PokemonFilters {
  type: string;
  generation: string;
  search: string;
}

export interface GetPokemonsParams {
  pageParam?: number;
  filters?: PokemonFilters;
}

export interface PaginatedResponse {
  data: Pokemon[];
  nextCursor: number | null;
  total: number;
}
