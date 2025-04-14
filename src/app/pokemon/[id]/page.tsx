import { Stats } from "@/components/pokemon/stats";
import { MainInfo } from "@/components/pokemon/main-info";
import { EvolutionChain } from "@/components/pokemon/evolution-chain";

import { getPokemonById } from "@/lib/api/queries";

interface PokemonPageProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({ params }: PokemonPageProps) => {
  const { id } = await params;
  const pokemon = await getPokemonById(id);
  const capitalizedName =
    pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return {
    title: `${capitalizedName} - Pokédex`,
    description: `Explore the details of ${capitalizedName} in the Pokédex.`,
  };
};

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { id } = await params;

  const pokemon = await getPokemonById(id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MainInfo pokemon={pokemon} />

      <div className="flex flex-col gap-6">
        <Stats pokemon={pokemon} />
        <EvolutionChain pokemon={pokemon} />
      </div>
    </div>
  );
}
